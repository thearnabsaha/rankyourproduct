import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isOwnSiteUrl, parseListingUrl } from "@/lib/url";
import { createDodoCheckout } from "@/lib/dodo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    amount?: number;
    listingId?: string;
    url?: string;
    domain?: string;
    title?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Amount has to be at least $1" }, { status: 400 });
  }

  const amount = Math.floor(Number(body.amount));
  if (!Number.isFinite(amount) || amount < 1) {
    return NextResponse.json({ error: "Amount has to be at least $1" }, { status: 400 });
  }

  if (!body.listingId && !(body.url && body.domain)) {
    return NextResponse.json(
      { error: "Either listingId or url and domain are required" },
      { status: 400 },
    );
  }

  try {
    let listingId = body.listingId || "";
    let url = body.url || "";
    let domain = body.domain || "";
    let title = body.title || "";

    if (listingId) {
      const listing = await prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      const min = listing.highestBid + 1;
      if (amount < min) {
        return NextResponse.json(
          { error: `You need at least $${min}` },
          { status: 400 },
        );
      }
      url = listing.canonicalUrl;
      domain = listing.domain;
      title = listing.title;
      if (isOwnSiteUrl(url, domain)) {
        return NextResponse.json(
          { error: "You can't list RankYourProduct on its own board." },
          { status: 400 },
        );
      }
    } else {
      const parsed = parseListingUrl(url);
      url = parsed.canonicalUrl;
      domain = parsed.domain;
      if (isOwnSiteUrl(url, domain)) {
        return NextResponse.json(
          { error: "You can't list RankYourProduct on its own board." },
          { status: 400 },
        );
      }
      const existing = await prisma.listing.findUnique({
        where: { canonicalUrl: parsed.canonicalUrl },
      });
      if (existing) {
        listingId = existing.id;
        const min = existing.highestBid + 1;
        if (amount < min) {
          return NextResponse.json(
            { error: `You need at least $${min}` },
            { status: 400 },
          );
        }
        title = existing.title;
      }
    }

    const { checkoutUrl } = await createDodoCheckout({
      amount,
      metadata: {
        amount: String(amount),
        url,
        domain,
        title,
        listingId,
      },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
