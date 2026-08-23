import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { parseListingUrl, xHandleFromUrl } from "@/lib/url";
import { scrapeTitle } from "@/lib/og";
import { fetchXProfile } from "@/lib/x-profile";
import { globalHighestBid, listingOrderBy, predictedRank } from "@/lib/rank";
import { syncBackdoorListings } from "@/lib/backdoor";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || 1));
  const limit = Math.min(
    50,
    Math.max(1, Number(req.nextUrl.searchParams.get("limit") || 50)),
  );
  try {
    await syncBackdoorListings();
  } catch {
    /* db may still be warming on first Vercel boot */
  }
  const where = { highestBid: { gt: 0 } };
  let totalCount = 0;
  let listings: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  try {
    totalCount = await prisma.listing.count({ where });
    listings = await prisma.listing.findMany({
      where,
      orderBy: listingOrderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
  } catch {
    listings = [];
    totalCount = 0;
  }

  return NextResponse.json({
    listings: listings.map((l) => ({
      id: l.id,
      url: l.canonicalUrl,
      domain: l.domain,
      highestBid: l.highestBid,
      totalBids: l.totalBids,
      totalClicks: l.totalClicks,
      createdAt: l.createdAt.toISOString(),
      title: l.title,
      imageUrl: l.imageUrl,
      slug: l.slug,
    })),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
  });
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Need a product link or @handle" }, { status: 400 });
  }

  if (!body.url?.trim()) {
    return NextResponse.json({ error: "Need a product link or @handle" }, { status: 400 });
  }

  try {
    const parsed = parseListingUrl(body.url);
    const existing = await prisma.listing.findUnique({
      where: { canonicalUrl: parsed.canonicalUrl },
    });
    const handle = xHandleFromUrl(parsed.canonicalUrl);
    const profile = handle ? await fetchXProfile(handle) : null;
    const scraped = existing?.title || (await scrapeTitle(parsed.canonicalUrl));
    const title = profile?.name || scraped || parsed.displayUrl;
    const imageUrl = profile?.avatarUrl || existing?.imageUrl || "";
    const top = await globalHighestBid();
    const highestBid = existing?.highestBid ?? 0;
    const rank = await predictedRank(
      highestBid > 0 ? highestBid : 1,
      existing?.id,
    );

    return NextResponse.json({
      listing: {
        id: existing?.id ?? null,
        url: parsed.canonicalUrl,
        domain: parsed.domain,
        title,
        imageUrl,
        highestBid,
        totalBids: existing?.totalBids ?? 0,
        rank,
        globalHighestBid: top,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid URL";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
