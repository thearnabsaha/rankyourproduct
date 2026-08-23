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
          <div key={i} className="h-16 bg-raised rounded-[10px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <section
      aria-labelledby="latest-payments"
      className="relative surface-card p-5 pt-8"
    >
      <h2
        id="latest-payments"
        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-canvas px-3 text-sm font-bold tracking-wide text-accent uppercase whitespace-nowrap"
      >
        Latest payments
      </h2>
      {bids.length === 0 ? (
        <div className="text-sm text-ink-mute text-center py-4">
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
              className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:translate-x-0.5 transition-transform duration-[180ms]"
            >
              <div className="min-w-0">
                <p className="text-ink font-semibold truncate">
                  {slug ? (
                    <Link
                      href={`/p/${slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-accent hover:underline underline-offset-3 transition-colors duration-[180ms]"
                    >
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </p>
                <p className="text-ink-mute text-sm">{relativeTime(bid.createdAt)}</p>
              </div>
              <p className="font-semibold tabular-nums text-ink shrink-0">
                ${bid.amount}
              </p>
            </div>
          );
        })
      )}
    </section>
  );
}
