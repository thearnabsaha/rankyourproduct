import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { collectedRevenueDollars, liveVisitorCount } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const [stat, liveVisitors, totalRevenue] = await Promise.all([
    prisma.stat.upsert({
      where: { id: "global" },
      create: { id: "global" },
      update: {},
    }),
    liveVisitorCount(),
    collectedRevenueDollars(),
  ]);

  return NextResponse.json({
    totalVisitors: stat.totalVisitors,
    totalRevenue,
    liveVisitors,
  });
}
