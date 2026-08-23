import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import VisitListing from "@/components/VisitListing";
import prisma from "@/lib/db";
import { listingOrderBy } from "@/lib/rank";
import {
  absUrl,
  breadcrumbJsonLd,
  listingJsonLd,
  pageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { isPublicListingUrl, listingAvatar, listingLabel, xHandleFromUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

type Params = { slug: string };

async function getListing(slug: string) {
  return prisma.listing.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug).catch(() => null);
  if (!listing || listing.highestBid < 1) {
    return pageMetadata({
      title: "Listing not found",
      description: "This RankYourProduct listing is not available.",
      path: `/p/${slug}`,
      index: false,
    });
  }
  const label = listingLabel(listing.canonicalUrl, listing.domain);
  const title = `${label} on RankYourProduct`;
  const description =
    listing.title ||
    `${label} is listed on RankYourProduct. Current bid $${listing.highestBid}.`;
  const meta = pageMetadata({
    title,
    description,
    path: `/p/${listing.slug}`,
    absoluteTitle: true,
    index: isPublicListingUrl(listing.canonicalUrl),
  });
  const ogImage = absUrl(`/p/${listing.slug}/opengraph-image`);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...meta.twitter,
      images: [ogImage],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const listing = await getListing(slug).catch(() => null);
  if (!listing || listing.highestBid < 1) notFound();

  const label = listingLabel(listing.canonicalUrl, listing.domain);
  const handle = xHandleFromUrl(listing.canonicalUrl);
  const avatar = listingAvatar(
    listing.canonicalUrl,
    listing.domain,
    listing.imageUrl,
  );
  const path = `/p/${listing.slug}`;
  const description =
    listing.title ||
    `${label} is listed on the RankYourProduct public board.`;
  const kind = handle ? "X profile" : "product";

  let related: Awaited<ReturnType<typeof prisma.listing.findMany>> = [];
  try {
    related = await prisma.listing.findMany({
      where: {
        highestBid: { gt: 0 },
        slug: { not: listing.slug },
      },
      orderBy: listingOrderBy,
      take: 4,
    });
  } catch {
    related = [];
  }

  return (
    <article className="max-w-[680px] mx-auto px-6 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Board", path: "/" },
          { name: label, path },
        ])}
      />
      <JsonLd
        data={webPageJsonLd({
          path,
          name: `${label} on RankYourProduct`,
          description,
        })}
      />
      <JsonLd
        data={listingJsonLd({
          slug: listing.slug,
          canonicalUrl: listing.canonicalUrl,
          domain: listing.domain,
          title: listing.title,
          imageUrl: listing.imageUrl,
          isProfile: Boolean(handle),
          label,
        })}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-ink-mute mb-6">
        <Link href="/" className="link-accent">
          Public product board
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{label}</span>
      </nav>

      <div className="flex items-start gap-5 mb-8">
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-raised rounded-[10px] border border-line overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={`${label} ${handle ? "profile photo" : "logo"}`}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-accent font-bold mb-1">
            {kind}
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink">
            {label}
          </h1>
          {listing.title ? (
            <p className="mt-2 text-[17px] leading-7 text-ink-soft">{listing.title}</p>
          ) : null}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 mb-10">
        <div className="rounded-[10px] border border-line bg-surface p-4">
          <dt className="text-xs uppercase tracking-wider text-accent font-bold">
            Current bid
          </dt>
          <dd className="text-2xl font-semibold tabular-nums mt-1">${listing.highestBid}</dd>
        </div>
        <div className="rounded-[10px] border border-line bg-surface p-4">
          <dt className="text-xs uppercase tracking-wider text-accent font-bold">
            Clicks from this board
          </dt>
          <dd className="text-2xl font-semibold tabular-nums mt-1">
            {listing.totalClicks}
          </dd>
        </div>
      </dl>

      <h2 className="text-xl font-display font-semibold text-ink mb-3">
        About this listing
      </h2>
      <p className="text-[17px] leading-8 text-ink-soft mb-8">
        {handle
          ? `${label} is an X profile listed on RankYourProduct. Rank is the highest whole-dollar amount paid for this handle — not followers, and not an algorithm.`
          : `${label} is listed on RankYourProduct, a public board where founders pay to rank products. The current bid is $${listing.highestBid}.`}
      </p>
      <p className="text-[17px] leading-8 text-ink-soft mb-8">
        Anyone can take a higher row by paying a larger whole-dollar amount for
        the same {handle ? "handle" : "URL"}. See the{" "}
        <Link href="/rules" className="link-accent">
          ranking rules
        </Link>
        .
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <VisitListing
          listingId={listing.id}
          url={listing.canonicalUrl}
          domain={listing.domain}
          label={label}
        />
        <Link
          href="/"
          className="btn-ghost px-6 py-3.5"
        >
          List your product from $1
        </Link>
      </div>

      {related.length > 0 ? (
        <section className="mt-14" aria-labelledby="also-on-the-board">
          <h2
            id="also-on-the-board"
            className="text-xl font-display font-semibold text-ink mb-4"
          >
            Also on the board
          </h2>
          <ul className="space-y-2">
            {related.map((row) => {
              const other = listingLabel(row.canonicalUrl, row.domain);
              return (
                <li key={row.id}>
                  <Link
                    href={`/p/${row.slug}`}
                    className="link-accent"
                  >
                    {other}
                  </Link>
                  <span className="text-ink-mute"> · ${row.highestBid}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
