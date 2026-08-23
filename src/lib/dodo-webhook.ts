import { NextResponse } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { dodoWebhookKey } from "@/lib/dodo-env";
import { fulfillFromDodoPayment } from "@/lib/dodo-sync";

const key = dodoWebhookKey();

export const POST = key
  ? Webhooks({
      webhookKey: key,
      onPaymentSucceeded: async (payload) => {
        try {
          await fulfillFromDodoPayment(payload.data);
        } catch (err) {
          console.error("fulfill payment.succeeded failed", err);
        }
      },
    })
  : async () =>
      NextResponse.json(
        { error: "Dodo webhook key is not configured" },
        { status: 503 },
      );
