import type { MetadataRoute } from "next";
import prisma from "@/lib/db";
import { absUrl } from "@/lib/seo";
import { isPublicListingUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    {
      url: absUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: absUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absUrl("/rules"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const listings = await prisma.listing.findMany({
      where: { highestBid: { gt: 0 }, slug: { not: "" } },
      select: { slug: true, updatedAt: true, canonicalUrl: true },
    });
    for (const listing of listings) {
      if (!isPublicListingUrl(listing.canonicalUrl)) continue;
      pages.push({
        url: absUrl(`/p/${listing.slug}`),
        lastModified: listing.updatedAt,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  } catch {
    /* db may be cold */
  }

  return pages;
}
