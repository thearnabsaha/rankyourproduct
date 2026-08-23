import { NextResponse } from "next/server";
import { readPresence } from "@/lib/presence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const presence = await readPresence();
    return NextResponse.json(presence);
  } catch {
    return NextResponse.json({
      totalVisitors: 0,
      totalRevenue: 0,
      liveVisitors: 0,
    });
  }
}
