import prisma from "@/lib/db";
import { collectedRevenueDollars } from "@/lib/stats";

export const COOKIE_NAME = "ryp_vid";
export const LIVE_WINDOW_MS = 120_000;
const SESSION_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|discord|preview|vercel-screenshot|lighthouse/i;

export type Presence = {
  liveVisitors: number;
  totalVisitors: number;
  totalRevenue: number;
  sessionId: string;
};

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_RE.test(userAgent);
}

export function normalizeSessionId(value: string | null | undefined): string | null {
  if (!value) return null;
  const id = value.trim();
  return SESSION_RE.test(id) ? id : null;
}

export async function readPresence(): Promise<Omit<Presence, "sessionId">> {
  const cutoff = new Date(Date.now() - LIVE_WINDOW_MS);
  const [liveVisitors, visitorRows, stat, totalRevenue] = await Promise.all([
    prisma.visitor.count({ where: { lastSeenAt: { gte: cutoff } } }),
    prisma.visitor.count(),
    prisma.stat.upsert({
      where: { id: "global" },
      create: { id: "global" },
      update: {},
    }),
    collectedRevenueDollars(),
  ]);

  const totalVisitors = Math.max(stat.totalVisitors, visitorRows);
  if (totalVisitors > stat.totalVisitors) {
    await prisma.stat.update({
      where: { id: "global" },
      data: { totalVisitors },
    });
  }

  return { liveVisitors, totalVisitors, totalRevenue };
}

export async function heartbeat(rawSessionId: string | null): Promise<Presence> {
  const sessionId = normalizeSessionId(rawSessionId) || crypto.randomUUID();
  const now = new Date();

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

  const snapshot = await readPresence();
  return { ...snapshot, sessionId };
}

export function sessionCookie(sessionId: string) {
  return {
    name: COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.VERCEL === "1",
  };
}

export async function sessionIdFromRequest(
  req: { cookies: { get(name: string): { value: string } | undefined }; json(): Promise<unknown> },
): Promise<string | null> {
  const fromCookie = normalizeSessionId(req.cookies.get(COOKIE_NAME)?.value);
  if (fromCookie) return fromCookie;
  try {
    const body = (await req.json()) as { sessionId?: string };
    return normalizeSessionId(body.sessionId);
  } catch {
    return null;
  }
}


