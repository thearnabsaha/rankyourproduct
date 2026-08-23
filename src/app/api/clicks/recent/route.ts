import { NextResponse } from "next/server";
import { getRecentClicks } from "@/lib/clicks";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clicks = await getRecentClicks();
    return NextResponse.json({ clicks, source: "db" });
  } catch {
    return NextResponse.json({ clicks: [], source: "db" });
  }
}
