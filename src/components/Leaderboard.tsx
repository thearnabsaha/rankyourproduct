"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UTM_SOURCE } from "@/lib/site";
import { listingAvatar, listingLabel, listingSlugFromCanonical, withUtm } from "@/lib/url";

export type BoardListing = {
  id: string;
  url: string;
  domain: string;
  highestBid: number;
  totalClicks: number;
  title: string;
  imageUrl?: string;
  slug?: string;
};

export default function Leaderboard({
  initialListings = [],
  initialPages = 1,
}: {
  initialListings?: BoardListing[];
  initialPages?: number;
}) {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(initialPages);
  const [listings, setListings] = useState<BoardListing[]>(initialListings);
  const [loading, setLoading] = useState(initialListings.length === 0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/listings?page=${page}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setListings(data.listings || []);
        setPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const openListing = async (item: BoardListing) => {
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: item.id,
        url: item.url,
        domain: item.domain,
      }),
    }).catch(() => {});
    window.open(withUtm(item.url, UTM_SOURCE), "_blank", "noopener,noreferrer");
  };

  if (loading && listings.length === 0) {
    return (
      <section className="w-full flex flex-col border border-[#FE4103] rounded-3xl bg-white shadow-sm overflow-hidden animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center p-4 sm:p-6 gap-3 sm:gap-6 border-b border-black/10 last:border-0"
          >
            <div className="w-5 sm:w-8 h-6 bg-black/[0.04] rounded" />
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-black/[0.04] rounded-2xl" />
            <div className="flex-grow flex flex-col gap-2 sm:gap-3">
              <div className="h-4 sm:h-5 w-32 sm:w-48 bg-black/[0.04] rounded-md" />
              <div className="h-3 sm:h-4 w-48 sm:w-72 bg-black/[0.04] rounded-md" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <section className="w-full pt-4 pb-12">
        <div className="w-full bg-white border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:rounded-3xl overflow-hidden px-8 py-16 text-center">
          <p className="text-black font-semibold text-lg">The table is empty.</p>
          <p className="text-black/50 mt-2">One dollar buys the first row.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-4 pb-12" aria-labelledby="board-heading">
      <h2 id="board-heading" className="sr-only">
        Product and X profile board
      </h2>
      <ol className="w-full bg-white border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:rounded-3xl overflow-hidden divide-y divide-foreground/[0.04] list-none">
          {listings.map((item, index) => {
            const rank = (page - 1) * 50 + index + 1;
            let wash = "hover:bg-black/[0.02]";
            if (rank === 1) wash = "bg-[#FFF0E5] hover:bg-[#FFE4D6]";
            else if (rank === 2) wash = "bg-[#FFF7F0] hover:bg-[#FFF0E5]";
            else if (rank === 3) wash = "bg-[#FFFCFA] hover:bg-[#FFF7F0]";
            const label = listingLabel(item.url, item.domain);
            const slug = item.slug || listingSlugFromCanonical(item.url);

            return (
              <li
                key={item.id}
                onClick={() => openListing(item)}
                className={`group flex items-center p-4 sm:p-6 transition-all gap-3 sm:gap-6 cursor-pointer relative ${wash}`}
              >
                <div className="w-5 sm:w-8 text-left text-base sm:text-xl tracking-tighter text-[#FE4103] font-bold">
                  #{rank}
                </div>
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl border border-foreground/[0.04] shadow-sm flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listingAvatar(item.url, item.domain, item.imageUrl)}
                    alt={`${label} ${item.url.includes("x.com") ? "profile photo" : "logo"}`}
                    width={64}
                    height={64}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate text-black group-hover:text-[#FE4103] transition-colors">
                    {slug ? (
                      <Link
                        href={`/p/${slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                  </h3>
                  {item.title ? (
                    <span className="text-xs sm:text-sm text-black block font-medium opacity-70 mt-0.5 sm:mt-1 truncate sm:whitespace-normal">
                      {item.title}
                    </span>
                  ) : null}
                  <span className="text-xs sm:text-sm text-[#FE4103] font-semibold mt-0.5">
                    {item.totalClicks ?? 0} clicks
                  </span>
                </div>
                <div className="flex items-center shrink-0 text-right pr-1 sm:pr-2 pl-2 sm:pl-0">
                  <div className="text-base sm:text-xl font-bold tracking-tight tabular-nums text-black/70">
                    ${item.highestBid}
                  </div>
                </div>
              </li>
            );
          })}
      </ol>
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page of listings"
            className="min-h-10 min-w-10 px-3 py-1.5 rounded-lg border border-foreground/[0.06] text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-black/50 tabular-nums" aria-live="polite">
            {page} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            aria-label="Next page of listings"
            className="min-h-10 min-w-10 px-3 py-1.5 rounded-lg border border-foreground/[0.06] text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
