import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  heartbeat,
  isBot,
  sessionCookie,
  sessionIdFromRequest,
} from "@/lib/presence";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (isBot(req.headers.get("user-agent"))) {
    return NextResponse.json({
      liveVisitors: 0,
      totalVisitors: 0,
      totalRevenue: 0,
      ignored: true,
    });
  }

  try {
    const incoming = await sessionIdFromRequest(req);
    const presence = await heartbeat(incoming);
    const res = NextResponse.json(presence);
    if (presence.sessionId !== req.cookies.get(COOKIE_NAME)?.value) {
      const cookie = sessionCookie(presence.sessionId);
      res.cookies.set(cookie);
    }
    return res;
  } catch {
    return NextResponse.json({
      liveVisitors: 0,
      totalVisitors: 0,
      totalRevenue: 0,
    });
  }
}
