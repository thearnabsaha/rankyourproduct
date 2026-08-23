import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clicks = await prisma.click.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { listing: { select: { slug: true } } },
    });

    return NextResponse.json({
      clicks: clicks.map((c) => ({
        id: c.id,
        domain: c.domain,
        url: c.url,
        slug: c.listing?.slug || "",
        createdAt: c.createdAt.toISOString(),
      })),
      source: "db",
    });
  } catch {
    return NextResponse.json({ clicks: [], source: "db" });
  }
}
