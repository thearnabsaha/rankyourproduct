import { SITE_URL } from "@/lib/site";

export const dodoEnvironment =
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ||
  process.env.DODO_ENVIRONMENT === "live_mode"
    ? "live_mode"
    : "test_mode";

export function dodoApiKey(): string {
  return (
    process.env.DODO_PAYMENTS_API_KEY ||
    process.env.DODO_API_KEY ||
    ""
  );
}

export function dodoWebhookKey(): string {
  return (
    process.env.DODO_PAYMENTS_WEBHOOK_KEY ||
    process.env.DODO_WEBHOOK_SECRET ||
    ""
  );
}

export function dodoProductId(): string {
  return (
    process.env.DODO_PAYMENTS_PRODUCT_ID ||
    process.env.DODO_PRODUCT_ID ||
    ""
  );
}

export function dodoReturnUrl(): string {
  if (process.env.DODO_PAYMENTS_RETURN_URL) {
    return process.env.DODO_PAYMENTS_RETURN_URL.replace(/\/$/, "");
  }
  return `${SITE_URL}/success`;
}
