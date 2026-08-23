import DodoPayments from "dodopayments";
import {
  dodoApiKey,
  dodoEnvironment,
  dodoProductId,
  dodoReturnUrl,
  dodoWebhookKey,
} from "@/lib/dodo-env";

export function isMockPayments(): boolean {
  if (process.env.DODO_MOCK === "1") return true;
  return !dodoApiKey() || !dodoProductId();
}

let client: DodoPayments | null = null;

export function dodoClient(): DodoPayments {
  if (!client) {
    client = new DodoPayments({
      bearerToken: dodoApiKey(),
      environment: dodoEnvironment,
      webhookKey: dodoWebhookKey() || undefined,
    });
  }
  return client;
}

export async function createDodoCheckout(input: {
  amount: number;
  metadata: Record<string, string>;
}): Promise<{ checkoutUrl: string }> {
  if (isMockPayments()) {
    const paymentId = `mock_${crypto.randomUUID()}`;
    const params = new URLSearchParams({
      paymentId,
      amount: String(input.amount),
      ...input.metadata,
    });
    return {
      checkoutUrl: `/api/billing/mock-complete?${params.toString()}`,
    };
  }

  const session = await dodoClient().checkoutSessions.create({
    product_cart: [
      {
        product_id: dodoProductId(),
        quantity: input.amount,
      },
    ],
    return_url: dodoReturnUrl(),
    metadata: input.metadata,
    customization: { theme: "light" },
    feature_flags: { redirect_immediately: true },
  });

  if (!session.checkout_url) {
    throw new Error("Dodo did not return a checkout URL");
  }

  return { checkoutUrl: session.checkout_url };
}
