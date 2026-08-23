import prisma from "@/lib/db";
import { parseListingUrl, xHandleFromUrl } from "@/lib/url";
import { BACKDOOR_LISTINGS } from "@/data/backdoor-listings";
import { fetchXProfile } from "@/lib/x-profile";

let lastSync = 0;
const SYNC_EVERY_MS = 5_000;

export async function syncBackdoorListings(force = false) {
  const now = Date.now();
  if (!force && now - lastSync < SYNC_EVERY_MS) return;
  lastSync = now;

  const canonicals: string[] = [];

  for (const item of BACKDOOR_LISTINGS) {
    const bid = Math.max(1, Math.floor(item.bid));
    const pinOrder = Math.max(1, Math.floor(item.pinOrder));
    const parsed = parseListingUrl(item.url);
    canonicals.push(parsed.canonicalUrl);

    const clicks = Math.max(0, Math.floor(item.clicks ?? 0));
    const handle = xHandleFromUrl(parsed.canonicalUrl);
    const profile = handle ? await fetchXProfile(handle) : null;
    const title = profile?.name || item.title;
    const imageUrl = profile?.avatarUrl || "";

    const listing = await prisma.listing.upsert({
      where: { canonicalUrl: parsed.canonicalUrl },
      create: {
        canonicalUrl: parsed.canonicalUrl,
        domain: parsed.domain,
        title,
        imageUrl,
        highestBid: bid,
        totalBids: 1,
        totalClicks: clicks,
        pinned: true,
        pinOrder,
      },
      update: {
        domain: parsed.domain,
        title,
        ...(imageUrl ? { imageUrl } : {}),
        highestBid: bid,
        totalClicks: clicks,
        pinned: true,
        pinOrder,
      },
    });

    if (clicks > 0) {
      const existingClicks = await prisma.click.count({
        where: { listingId: listing.id },
      });
      const missing = clicks - existingClicks;
      if (missing > 0) {
        const now = Date.now();
        await prisma.click.createMany({
          data: Array.from({ length: missing }, (_, i) => ({
            listingId: listing.id,
            domain: parsed.domain,
            url: parsed.canonicalUrl,
            createdAt: new Date(now - (missing - i) * 45_000),
          })),
        });
      }
    }

    const paymentId = `backdoor:${parsed.canonicalUrl}`;
    const existingBid = await prisma.bid.findUnique({
      where: { paymentId },
    });
    if (!existingBid) {
      await prisma.bid.create({
        data: {
          listingId: listing.id,
          amount: bid,
          paymentId,
          status: "succeeded",
        },
      });
    } else if (existingBid.amount !== bid) {
      await prisma.bid.update({
        where: { paymentId },
        data: { amount: bid },
      });
    }
  }

  await prisma.listing.updateMany({
    where: {
      pinned: true,
      canonicalUrl: { notIn: canonicals },
    },
    data: { pinned: false, pinOrder: 0 },
  });
}
