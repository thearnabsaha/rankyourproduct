import type { Metadata } from "next";
import HeroLookup from "@/components/HeroLookup";
import Leaderboard from "@/components/Leaderboard";
import LiveTraffic from "@/components/LiveTraffic";
import RecentBids from "@/components/RecentBids";
import HomeIntro from "@/components/HomeIntro";
import JsonLd from "@/components/JsonLd";
import prisma from "@/lib/db";
import { listingOrderBy } from "@/lib/rank";
import { syncBackdoorListings } from "@/lib/backdoor";
import { syncPaidListingsFromDodo } from "@/lib/dodo-sync";
import {
  absUrl,
  breadcrumbJsonLd,
  pageMetadata,
  SEO_DESCRIPTION,
  SEO_TITLE,
  webPageJsonLd,
} from "@/lib/seo";
import { isPublicListingUrl, listingLabel } from "@/lib/url";
import { getRecentClicks } from "@/lib/clicks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  let listings: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  let totalCount = 0;
  let recentClicks: Awaited<ReturnType<typeof getRecentClicks>> = [];
  try {
    await syncBackdoorListings();
    try {
      await syncPaidListingsFromDodo();
    } catch {
      /* paid rows still import from /api/listings */
    }
    const [board, count, clicks] = await Promise.all([
      prisma.listing.findMany({
        where: { highestBid: { gt: 0 } },
        orderBy: listingOrderBy,
        take: 50,
      }),
      prisma.listing.count({
        where: { highestBid: { gt: 0 } },
      }),
      getRecentClicks(),
    ]);
    listings = board;
    totalCount = count;
    recentClicks = clicks;
  } catch {
    listings = [];
    totalCount = 0;
    recentClicks = [];
  }

  const initial = listings.map((l) => ({
    id: l.id,
    url: l.canonicalUrl,
    domain: l.domain,
    highestBid: l.highestBid,
    totalClicks: l.totalClicks,
    title: l.title,
    imageUrl: l.imageUrl,
    slug: l.slug,
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RankYourProduct board",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: totalCount,
    itemListElement: initial
      .filter((item) => item.slug && isPublicListingUrl(item.url))
      .map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/p/${item.slug}`),
        name: listingLabel(item.url, item.domain),
        description: item.title || undefined,
      })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Board", path: "/" }])} />
      <JsonLd
        data={webPageJsonLd({
          path: "/",
          name: SEO_TITLE,
          description: SEO_DESCRIPTION,
        })}
      />
      <JsonLd data={itemList} />
      <div className="relative min-h-screen pb-8 pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden w-full max-w-[2000px] mx-auto">
        <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-start">
          <aside className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 mt-12 lg:mt-0">
            <LiveTraffic initialClicks={recentClicks} />
          </aside>
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center">
            <HeroLookup />
            <div className="w-full">
              <Leaderboard
                initialListings={initial}
                initialPages={Math.max(1, Math.ceil(totalCount / 50))}
              />
            </div>
          </div>
          <aside className="order-2 lg:order-3 lg:col-span-3 lg:sticky lg:top-24 mt-12 lg:mt-0">
            <RecentBids />
          </aside>
        </div>
        <HomeIntro />
      </div>
    </>
  );
}
