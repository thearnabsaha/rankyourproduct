"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/time";
import { UTM_SOURCE } from "@/lib/site";
import { listingLabel, withUtm } from "@/lib/url";

type Click = {
  id: string;
  domain: string;
  url: string;
  createdAt: string;
};

export default function LiveTraffic() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/clicks/recent");
        if (res.ok) {
          const data = await res.json();
          setClicks(data.clicks || []);
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

  if (loading && clicks.length === 0) {
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
        Latest clicks
      </div>
      {clicks.length === 0 ? (
        <div className="text-sm text-black/50 text-center py-4">
          Nobody has opened a row yet.
        </div>
      ) : (
        clicks.map((click) => {
          return (
            <div
              key={click.id}
              onClick={() =>
                window.open(withUtm(click.url, UTM_SOURCE), "_blank", "noopener,noreferrer")
              }
              className="py-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="leading-tight mb-0.5">
                <span className="text-black font-semibold truncate block text-base">
                  {listingLabel(click.url, click.domain)}
                </span>
                <span className="text-black/50 text-sm">
                  visited {relativeTime(click.createdAt)}
                </span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
