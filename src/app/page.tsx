import type { Metadata } from "next";
import HeroLookup from "@/components/HeroLookup";
import Leaderboard from "@/components/Leaderboard";
import LiveTraffic from "@/components/LiveTraffic";
import RecentBids from "@/components/RecentBids";
import JsonLd from "@/components/JsonLd";
import prisma from "@/lib/db";
import { listingOrderBy } from "@/lib/rank";
import { syncBackdoorListings } from "@/lib/backdoor";
import { absUrl, breadcrumbJsonLd, SEO_DESCRIPTION, SEO_TITLE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: SEO_TITLE },
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: absUrl("/"),
    type: "website",
  },
  twitter: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
};

export default async function Home() {
  let listings: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  let totalCount = 0;
  try {
    await syncBackdoorListings();
    listings = await prisma.listing.findMany({
      where: { highestBid: { gt: 0 } },
      orderBy: listingOrderBy,
      take: 50,
    });
    totalCount = await prisma.listing.count({
      where: { highestBid: { gt: 0 } },
    });
  } catch {
    listings = [];
    totalCount = 0;
  }

  const initial = listings.map((l) => ({
    id: l.id,
    url: l.canonicalUrl,
    domain: l.domain,
    highestBid: l.highestBid,
    totalClicks: l.totalClicks,
    title: l.title,
    imageUrl: l.imageUrl,
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "rankyourproduct board",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: totalCount,
    itemListElement: initial.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      name: item.domain,
      description: item.title || undefined,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <JsonLd data={itemList} />
      <div className="relative min-h-screen pb-20 pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden w-full max-w-[2000px] mx-auto">
        <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-start">
          <aside className="order-3 lg:order-1 lg:col-span-3 lg:sticky lg:top-24 mt-12 lg:mt-0">
            <LiveTraffic />
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
      </div>
    </>
  );
}
