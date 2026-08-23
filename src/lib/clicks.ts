import prisma from "@/lib/db";

export type RecentClick = {
  id: string;
  domain: string;
  url: string;
  slug: string;
  createdAt: string;
};

export async function getRecentClicks(limit = 12): Promise<RecentClick[]> {
  const clicks = await prisma.click.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      domain: true,
      url: true,
      createdAt: true,
      listing: { select: { slug: true } },
    },
  });

  return clicks.map((c) => ({
    id: c.id,
    domain: c.domain,
    url: c.url,
    slug: c.listing?.slug || "",
    createdAt: c.createdAt.toISOString(),
  }));
}
