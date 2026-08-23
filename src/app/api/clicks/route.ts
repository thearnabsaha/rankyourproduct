import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { listingId?: string; url?: string; domain?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "listingId and url are required" },
      { status: 400 },
    );
  }

  if (!body.listingId || !body.url) {
    return NextResponse.json(
      { error: "listingId and url are required" },
      { status: 400 },
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id: body.listingId },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const click = await prisma.click.create({
    data: {
      listingId: listing.id,
      url: body.url,
      domain: body.domain || listing.domain,
    },
  });

  await prisma.listing.update({
    where: { id: listing.id },
    data: { totalClicks: { increment: 1 } },
  });

  return NextResponse.json({ click: { id: click.id } });
}
