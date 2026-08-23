import prisma from "@/lib/db";
import { parseListingUrl } from "@/lib/url";
import { scrapeTitle } from "@/lib/og";

export type FulfillInput = {
  paymentId: string;
  amount: number;
  listingId?: string | null;
  url?: string | null;
  domain?: string | null;
  title?: string | null;
};

export async function fulfillPayment(input: FulfillInput) {
  const amount = Math.floor(Number(input.amount));
  if (!input.paymentId || !Number.isFinite(amount) || amount < 1) {
    throw new Error("Invalid payment");
  }

  const already = await prisma.bid.findUnique({
    where: { paymentId: input.paymentId },
  });
  if (already) return already;

  let canonicalUrl = "";
  let domain = input.domain || "";
  let title = (input.title || "").trim();
  let listingId = input.listingId || "";

  if (listingId) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new Error("Listing not found");
    canonicalUrl = listing.canonicalUrl;
    domain = listing.domain;
    if (!title) title = listing.title;
  } else if (input.url) {
    const parsed = parseListingUrl(input.url);
    canonicalUrl = parsed.canonicalUrl;
    domain = parsed.domain;
  } else {
    throw new Error("listingId or url is required");
  }

  if (!title) title = await scrapeTitle(canonicalUrl);

  return prisma.$transaction(async (tx) => {
    const dup = await tx.bid.findUnique({ where: { paymentId: input.paymentId } });
    if (dup) return dup;

    const existing = await tx.listing.findUnique({
      where: { canonicalUrl },
    });

    const listing = existing
      ? await tx.listing.update({
          where: { id: existing.id },
          data: {
            domain,
            title: title || existing.title,
            totalBids: { increment: 1 },
            highestBid: amount > existing.highestBid ? amount : existing.highestBid,
          },
        })
      : await tx.listing.create({
          data: {
            canonicalUrl,
            domain,
            title,
            highestBid: amount,
            totalBids: 1,
          },
        });

    const bid = await tx.bid.create({
      data: {
        listingId: listing.id,
        amount,
        paymentId: input.paymentId,
        status: "succeeded",
      },
    });

    await tx.stat.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        totalRevenueCents: amount * 100,
        totalVisitors: 0,
      },
      update: { totalRevenueCents: { increment: amount * 100 } },
    });

    return bid;
  });
}
