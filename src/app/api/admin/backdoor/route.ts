import { NextRequest, NextResponse } from "next/server";
import { syncBackdoorListings } from "@/lib/backdoor";
import { BACKDOOR_LISTINGS } from "@/data/backdoor-listings";
import prisma from "@/lib/db";
import { listingOrderBy } from "@/lib/rank";

export const dynamic = "force-dynamic";

function authorized(req: NextRequest) {
  const secret = process.env.BACKDOOR_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const given =
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("x-backdoor-secret") ||
    "";
  return given === secret;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncBackdoorListings(true);
  const listings = await prisma.listing.findMany({
    where: { highestBid: { gt: 0 } },
    orderBy: listingOrderBy,
  });

  return NextResponse.json({
    hardcoded: BACKDOOR_LISTINGS,
    board: listings.map((l, i) => ({
      rank: i + 1,
      url: l.canonicalUrl,
      title: l.title,
      bid: l.highestBid,
      pinned: l.pinned,
      pinOrder: l.pinOrder,
    })),
  });
}
