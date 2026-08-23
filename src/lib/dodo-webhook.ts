import { NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { fulfillPayment } from "@/lib/fulfill";
import { dodoWebhookKey } from "@/lib/dodo-env";

const key = dodoWebhookKey();

export const POST = key
  ? Webhooks({
      webhookKey: key,
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
    })
  : async () =>
      NextResponse.json(
        { error: "Dodo webhook key is not configured" },
        { status: 503 },
      );
