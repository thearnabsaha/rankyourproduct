import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { listingCount, predictedRank } from "@/lib/rank";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const amount = Math.floor(Number(req.nextUrl.searchParams.get("amount") || 0));
  const listingId = req.nextUrl.searchParams.get("listingId");

  if (!Number.isFinite(amount) || amount < 1) {
    return NextResponse.json({ error: "Amount has to be at least $1" }, { status: 400 });
  }

  let currentBid = 0;
  let minimumBid = 1;
  if (listingId) {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (listing) {
      currentBid = listing.highestBid;
      minimumBid = listing.highestBid > 0 ? listing.highestBid + 1 : 1;
    }
  }

  const rank = await predictedRank(amount, listingId);
  const totalListings = await listingCount();

  return NextResponse.json({
    rank,
    amount,
    currentBid,
    minimumBid,
    totalListings,
  });
}
