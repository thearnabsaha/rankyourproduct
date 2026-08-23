import { SITE_URL } from "@/lib/site";

export function isMockPayments(): boolean {
  return (
    process.env.DODO_MOCK === "1" ||
    !process.env.DODO_API_KEY ||
    !process.env.DODO_PRODUCT_ID
  );
}

export async function createDodoCheckout(input: {
  amount: number;
  metadata: Record<string, string>;
}): Promise<{ checkoutUrl: string }> {
  const returnUrl = `${SITE_URL.replace(/\/$/, "")}/success`;

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

  const base =
    process.env.DODO_ENVIRONMENT === "live_mode"
      ? "https://live.dodopayments.com"
      : "https://test.dodopayments.com";

  const res = await fetch(`${base}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DODO_API_KEY}`,
    },
    body: JSON.stringify({
      product_cart: [
        {
          product_id: process.env.DODO_PRODUCT_ID,
          quantity: input.amount,
        },
      ],
      return_url: returnUrl,
      metadata: input.metadata,
      customization: { theme: "light" },
      feature_flags: { redirect_immediately: true },
    }),
  });

  const data = (await res.json()) as {
    checkout_url?: string;
    checkoutUrl?: string;
    error?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to create checkout");
  }

  const checkoutUrl = data.checkout_url || data.checkoutUrl;
  if (!checkoutUrl) throw new Error("Dodo did not return a checkout URL");
  return { checkoutUrl };
}
