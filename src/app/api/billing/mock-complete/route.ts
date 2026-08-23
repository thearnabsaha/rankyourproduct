import { NextRequest, NextResponse } from "next/server";
import { fulfillPayment } from "@/lib/fulfill";
import { isMockPayments } from "@/lib/dodo";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isMockPayments()) {
    return NextResponse.json({ error: "Mock payments are disabled" }, { status: 403 });
  }

  const paymentId = req.nextUrl.searchParams.get("paymentId") || "";
  const amount = Number(req.nextUrl.searchParams.get("amount") || 0);
  const listingId = req.nextUrl.searchParams.get("listingId") || "";
  const url = req.nextUrl.searchParams.get("url") || "";
  const domain = req.nextUrl.searchParams.get("domain") || "";
  const title = req.nextUrl.searchParams.get("title") || "";

  try {
    await fulfillPayment({
      paymentId,
      amount,
      listingId: listingId || null,
      url: url || null,
      domain: domain || null,
      title: title || null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fulfill failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const dest = req.nextUrl.clone();
  dest.pathname = "/success";
  dest.search = "mock=1";
  return NextResponse.redirect(dest);
}
