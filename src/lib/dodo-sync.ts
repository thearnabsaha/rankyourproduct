import { getDodoClient, isMockPayments } from "@/lib/dodo";
import { fulfillPayment } from "@/lib/fulfill";

let lastSync = 0;
const SYNC_EVERY_MS = 8_000;

function metaString(meta: Record<string, unknown> | undefined, key: string): string {
  const value = meta?.[key];
  if (value == null) return "";
  return String(value).trim();
}

export async function fulfillFromDodoPayment(payment: {
  payment_id?: string;
  total_amount?: number;
  metadata?: Record<string, unknown> | null;
  product_cart?: Array<{ quantity?: number }> | null;
}): Promise<void> {
  const paymentId = payment.payment_id || "";
  if (!paymentId) return;

  const meta = (payment.metadata || {}) as Record<string, unknown>;
  const url = metaString(meta, "url");
  const listingId = metaString(meta, "listingId");
  const domain = metaString(meta, "domain");
  const title = metaString(meta, "title");
  const qty = payment.product_cart?.[0]?.quantity;
  const amount =
    Number(metaString(meta, "amount")) ||
    (typeof qty === "number" ? qty : 0) ||
    Math.round((payment.total_amount || 0) / 100);

  if (!url && !listingId) return;
  if (!Number.isFinite(amount) || amount < 1) return;

  await fulfillPayment({
    paymentId,
    amount,
    listingId: listingId || null,
    url: url || null,
    domain: domain || null,
    title: title || null,
  });
}

export async function syncPaidListingsFromDodo(force = false): Promise<void> {
  if (isMockPayments()) return;
  const now = Date.now();
  if (!force && now - lastSync < SYNC_EVERY_MS) return;

  const client = getDodoClient();
  const importPaid = async () => {
    let count = 0;
    for await (const payment of client.payments.list({
      status: "succeeded",
      page_size: 50,
    })) {
      try {
        await fulfillFromDodoPayment(payment);
      } catch {
        /* skip a bad row; keep importing the rest */
      }
      count += 1;
      if (count >= 50) break;
    }
  };

  await Promise.race([
    importPaid(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("dodo sync timeout")), 12000),
    ),
  ]);
  lastSync = Date.now();
}

export async function fulfillDodoPaymentById(paymentId: string): Promise<void> {
  if (!paymentId || isMockPayments()) return;
  const payment = await getDodoClient().payments.retrieve(paymentId);
  if (payment.status && payment.status !== "succeeded") return;
  await fulfillFromDodoPayment(payment);
}
