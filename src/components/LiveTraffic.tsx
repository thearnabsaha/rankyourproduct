"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/time";
import { UTM_SOURCE } from "@/lib/site";
import { listingLabel, listingSlugFromCanonical, withUtm } from "@/lib/url";
import Link from "next/link";

export type RecentClickView = {
  id: string;
  domain: string;
  url: string;
  slug?: string;
  createdAt: string;
};

export default function LiveTraffic({
  initialClicks = [],
}: {
  initialClicks?: RecentClickView[];
}) {
  const [clicks, setClicks] = useState<RecentClickView[]>(initialClicks);
  const [loading, setLoading] = useState(initialClicks.length === 0);
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
    if (initialClicks.length === 0) load();
    const a = setInterval(load, 30000);
    const b = setInterval(() => setTick((n) => n + 1), 15000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [initialClicks.length]);

  if (loading && clicks.length === 0) {
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
      aria-labelledby="latest-clicks"
      className="relative surface-card p-5 pt-8"
    >
      <h2
        id="latest-clicks"
        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-canvas px-3 text-sm font-bold tracking-wide text-accent uppercase whitespace-nowrap"
      >
        Latest clicks
      </h2>
      {clicks.length === 0 ? (
        <div className="text-sm text-ink-mute text-center py-4">
          Nobody has opened a row yet.
        </div>
      ) : (
        clicks.map((click) => {
          const label = listingLabel(click.url, click.domain);
          const slug = click.slug || listingSlugFromCanonical(click.url);
          return (
            <div
              key={click.id}
              onClick={() =>
                window.open(withUtm(click.url, UTM_SOURCE), "_blank", "noopener,noreferrer")
              }
              className="py-3 cursor-pointer hover:translate-x-0.5 transition-transform duration-[180ms]"
            >
              <p className="leading-tight mb-0.5">
                <span className="text-ink font-semibold truncate block text-base">
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
                </span>
                <span className="text-ink-mute text-sm">
                  visited {relativeTime(click.createdAt)}
                </span>
              </p>
            </div>
          );
        })
      )}
    </section>
  );
}
