"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/time";
import { UTM_SOURCE } from "@/lib/site";
import { listingLabel, listingSlugFromCanonical, withUtm } from "@/lib/url";
import Link from "next/link";

type Bid = {
  id: string;
  amount: number;
  domain: string;
  url: string;
  slug?: string;
  createdAt: string;
};

export default function RecentBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/bids/recent");
        if (res.ok) {
          const data = await res.json();
          setBids(data.bids || []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
    const a = setInterval(load, 60000);
    const b = setInterval(() => setTick((n) => n + 1), 15000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  if (loading && bids.length === 0) {
    return (
      <div className="animate-pulse flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-black/[0.02] rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <section
      aria-labelledby="latest-payments"
      className="relative border border-foreground/[0.06] rounded-3xl p-5 pt-8"
    >
      <h2
        id="latest-payments"
        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-base font-bold tracking-wide text-[#FE4103] uppercase whitespace-nowrap"
      >
        Latest payments
      </h2>
      {bids.length === 0 ? (
        <div className="text-sm text-black/50 text-center py-4">
          No payments on the board yet.
        </div>
      ) : (
        bids.map((bid) => {
          const label = listingLabel(bid.url, bid.domain);
          const slug = bid.slug || listingSlugFromCanonical(bid.url);
          return (
            <div
              key={bid.id}
              onClick={() =>
                window.open(withUtm(bid.url, UTM_SOURCE), "_blank", "noopener,noreferrer")
              }
              className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="min-w-0">
                <p className="text-black font-semibold truncate">
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
                </p>
                <p className="text-black/50 text-sm">{relativeTime(bid.createdAt)}</p>
              </div>
              <p className="font-semibold tabular-nums text-black shrink-0">
                ${bid.amount}
              </p>
            </div>
          );
        })
      )}
    </section>
  );
}
