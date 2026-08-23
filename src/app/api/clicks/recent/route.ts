import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clicks = await prisma.click.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    return NextResponse.json({
      clicks: clicks.map((c) => ({
        id: c.id,
        domain: c.domain,
        url: c.url,
        createdAt: c.createdAt.toISOString(),
      })),
      source: "db",
    });
  } catch {
    return NextResponse.json({ clicks: [], source: "db" });
  }
}
