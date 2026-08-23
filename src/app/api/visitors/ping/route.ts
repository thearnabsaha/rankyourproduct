import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let sessionId = "";
  try {
    const body = (await req.json()) as { sessionId?: string };
    sessionId = body.sessionId || "";
  } catch {
    sessionId = "";
  }

  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  const now = new Date();
  try {
    const existing = await prisma.visitor.findUnique({
      where: { sessionId },
    });

    await prisma.visitor.upsert({
      where: { sessionId },
      create: { sessionId, lastSeenAt: now },
      update: { lastSeenAt: now },
    });

    if (!existing) {
      await prisma.stat.upsert({
        where: { id: "global" },
        create: { id: "global", totalVisitors: 1 },
        update: { totalVisitors: { increment: 1 } },
      });
    }

    const liveVisitors = await prisma.visitor.count({
      where: { lastSeenAt: { gte: new Date(Date.now() - 60_000) } },
    });

    return NextResponse.json({ liveVisitors, sessionId });
  } catch {
    return NextResponse.json({ liveVisitors: 0, sessionId });
  }
}
