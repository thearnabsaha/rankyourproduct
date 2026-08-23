import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { syncBackdoorListings } from "@/lib/backdoor";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await syncBackdoorListings();
    const bids = await prisma.bid.findMany({
      where: { status: "succeeded" },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { listing: { select: { domain: true, canonicalUrl: true, slug: true } } },
    });

    return NextResponse.json({
      bids: bids.map((b) => ({
        id: b.id,
        amount: b.amount,
        domain: b.listing.domain,
        url: b.listing.canonicalUrl,
        slug: b.listing.slug,
        createdAt: b.createdAt.toISOString(),
      })),
      source: "db",
    });
  } catch {
    return NextResponse.json({ bids: [], source: "db" });
  }
}
