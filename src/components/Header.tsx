"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SESSION_KEY = "ryp_session";

type PresenceSnap = {
  liveVisitors: number;
  totalVisitors: number;
  totalRevenue: number;
};

export default function Header({ initial }: { initial?: PresenceSnap }) {
  const [revenue, setRevenue] = useState(initial?.totalRevenue ?? 0);
  const [live, setLive] = useState(initial?.liveVisitors ?? 0);
  const [total, setTotal] = useState(initial?.totalVisitors ?? 0);

  useEffect(() => {
    let sessionId = "";
    try {
      sessionId = localStorage.getItem(SESSION_KEY) || "";
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
      }
    } catch {
      sessionId = crypto.randomUUID();
    }

    const apply = (d: Partial<PresenceSnap> & { sessionId?: string }) => {
      if (typeof d.liveVisitors === "number") setLive(d.liveVisitors);
      if (typeof d.totalVisitors === "number") {
        setTotal((prev) => Math.max(prev, d.totalVisitors as number));
      }
      if (typeof d.totalRevenue === "number") setRevenue(d.totalRevenue);
      if (d.sessionId) {
        try {
          localStorage.setItem(SESSION_KEY, d.sessionId);
        } catch {
          /* ignore */
        }
      }
    };

    const ping = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      fetch("/api/visitors/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        credentials: "same-origin",
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.sessionId) sessionId = d.sessionId;
          apply(d);
        })
        .catch(() => {});
    };

    ping();
    const beat = setInterval(ping, 25000);
    const onVis = () => {
      if (!document.hidden) ping();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(beat);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/85 backdrop-blur-md border-b border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        <Link
          href="/"
          className="flex items-center gap-3 group relative z-10 shrink-0"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] object-contain"
            priority
          />
          <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-ink group-hover:text-accent transition-colors duration-[180ms]">
            rankyourproduct
          </span>
        </Link>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center px-3 py-1.5 rounded-[8px] bg-accent-soft border border-accent/25">
          <span className="text-xs font-bold tracking-wide uppercase text-accent">
            Collected ${revenue} so far
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 relative z-10">
          <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
            <Link
              href="/about"
              className="text-ink-soft hover:text-ink transition-colors duration-[180ms]"
            >
              About
            </Link>
            <Link
              href="/rules"
              className="text-ink-soft hover:text-ink transition-colors duration-[180ms]"
            >
              Rules
            </Link>
          </nav>
          <div
            className="flex items-center gap-3 sm:gap-4 bg-raised border border-line rounded-[10px] px-3 sm:px-4 py-2 select-none"
            aria-label={`Collected $${revenue}. ${live} live visitors. ${total} total visitors.`}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-sm font-semibold text-ink tabular-nums">
                {live}{" "}
                <span className="text-ink-mute font-semibold hidden sm:inline">
                  Live
                </span>
              </span>
            </div>
            <div className="w-px h-4 bg-line" />
            <div className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm font-semibold text-ink tabular-nums">
                {total}{" "}
                <span className="text-ink-mute font-semibold hidden sm:inline">
                  Total
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
