import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { fulfillPayment } from "@/lib/fulfill";

export const dynamic = "force-dynamic";

function verifySignature(raw: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.replace(/^sha256=/, ""));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type DodoEvent = {
  type?: string;
  event_type?: string;
  data?: {
    payment_id?: string;
    id?: string;
    status?: string;
    metadata?: Record<string, string>;
    payload?: {
      payment_id?: string;
      metadata?: Record<string, string>;
    };
  };
};

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const secret = process.env.DODO_WEBHOOK_SECRET || "";
  const signature =
    req.headers.get("webhook-signature") ||
    req.headers.get("x-webhook-signature") ||
    req.headers.get("dodo-signature");

  if (secret && !verifySignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: DodoEvent;
  try {
    event = JSON.parse(raw) as DodoEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = event.type || event.event_type || "";
  const payload = event.data?.payload || event.data || {};
  const metadata = payload.metadata || event.data?.metadata || {};
  const paymentId = payload.payment_id || event.data?.payment_id || event.data?.id;
  const status = (payload as { status?: string }).status || event.data?.status;

  const succeeded =
    type.includes("payment.succeeded") ||
    type.includes("payment.success") ||
    status === "succeeded" ||
    status === "success";

  if (!succeeded) {
    return NextResponse.json({ received: true, ignored: true });
  }

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  try {
    await fulfillPayment({
      paymentId,
      amount: Number(metadata.amount || 0),
      listingId: metadata.listingId || null,
      url: metadata.url || null,
      domain: metadata.domain || null,
      title: metadata.title || null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fulfill failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
