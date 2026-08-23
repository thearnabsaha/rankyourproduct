"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/time";
import { UTM_SOURCE } from "@/lib/site";
import { withUtm } from "@/lib/url";

type Bid = {
  id: string;
  amount: number;
  domain: string;
  url: string;
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
    <div className="relative border border-foreground/[0.06] rounded-3xl p-5 pt-8">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-base font-bold tracking-wide text-[#FE4103] uppercase whitespace-nowrap">
        Latest payments
      </div>
      {bids.length === 0 ? (
        <div className="text-sm text-black/50 text-center py-4">
          No payments on the board yet.
        </div>
      ) : (
        bids.map((bid) => {
          const domain = bid.domain.replace(/^www\./, "");
          return (
            <div
              key={bid.id}
              onClick={() =>
                window.open(withUtm(bid.url, UTM_SOURCE), "_blank", "noopener,noreferrer")
              }
              className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="min-w-0">
                <p className="text-black font-semibold truncate">{domain}</p>
                <p className="text-black/50 text-sm">{relativeTime(bid.createdAt)}</p>
              </div>
              <p className="font-semibold tabular-nums text-black shrink-0">
                ${bid.amount}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
