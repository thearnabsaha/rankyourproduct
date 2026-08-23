import DodoPayments from "dodopayments";
import {
  dodoApiKey,
  dodoEnvironment,
  dodoProductId,
  dodoReturnUrl,
  dodoWebhookKey,
} from "@/lib/dodo-env";

type DodoEnv = "test_mode" | "live_mode";

export function isMockPayments(): boolean {
  if (process.env.DODO_MOCK === "1") return true;
  return !dodoApiKey() || !dodoProductId();
}

export function getDodoClient(environment: DodoEnv = dodoEnvironment) {
  return new DodoPayments({
    bearerToken: dodoApiKey(),
    environment,
    webhookKey: dodoWebhookKey() || undefined,
  });
}

function errorText(err: unknown): string {
  if (err instanceof Error) return `${err.name} ${err.message}`;
  return String(err);
}

function isUnauthorized(err: unknown): boolean {
  return /401|unauthorized/i.test(errorText(err));
}

function isMerchantNotLive(err: unknown): boolean {
  return /merchant_not_live|not live|not enabled for merchant/i.test(
    errorText(err),
  );
}

const NOT_LIVE_MESSAGE =
  "Dodo live mode is not enabled on this account yet. In Vercel set DODO_PAYMENTS_ENVIRONMENT=test_mode and use the test API key, test product ID, and test webhook. Finish Dodo Verification, then switch to live keys."

async function createCheckoutSession(environment: DodoEnv, input: {
  amount: number;
  metadata: Record<string, string>;
}) {
  const session = await getDodoClient(environment).checkoutSessions.create({
    product_cart: [
      {
        product_id: dodoProductId(),
        quantity: input.amount,
      },
    ],
    return_url: dodoReturnUrl(),
    metadata: { ...input.metadata, source: "rankyourproduct" },
    customization: { theme: "dark" },
    feature_flags: { redirect_immediately: true },
  });

  if (!session.checkout_url) {
    throw new Error("Dodo did not return a checkout URL");
  }

  return { checkoutUrl: session.checkout_url };
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

  const preferred: DodoEnv = dodoEnvironment;
  const fallback: DodoEnv =
    preferred === "live_mode" ? "test_mode" : "live_mode";

  try {
    return await createCheckoutSession(preferred, input);
  } catch (err) {
    if (isMerchantNotLive(err)) {
      throw new Error(NOT_LIVE_MESSAGE);
    }
    if (!isUnauthorized(err)) throw err;

    try {
      return await createCheckoutSession(fallback, input);
    } catch (err2) {
      if (isMerchantNotLive(err2) || isUnauthorized(err2)) {
        throw new Error(NOT_LIVE_MESSAGE);
      }
      throw err2;
    }
  }
}
