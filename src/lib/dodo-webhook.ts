import { Webhooks } from "@dodopayments/nextjs";
import { fulfillPayment } from "@/lib/fulfill";
import { dodoWebhookKey } from "@/lib/dodo-env";

export const POST = Webhooks({
  webhookKey: dodoWebhookKey(),
  onPaymentSucceeded: async (payload) => {
    const data = payload.data;
    const metadata = (data.metadata || {}) as Record<string, string>;

    const amountFromMeta = Number(metadata.amount || 0);
    const amountFromCents = Math.round((data.total_amount || 0) / 100);

    await fulfillPayment({
      paymentId: data.payment_id,
      amount: amountFromMeta || amountFromCents,
      listingId: metadata.listingId || null,
      url: metadata.url || null,
      domain: metadata.domain || null,
      title: metadata.title || null,
    });
  },
});
