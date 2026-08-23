"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SESSION_KEY = "ryp_session";

export default function Header() {
  const [revenue, setRevenue] = useState(0);
  const [live, setLive] = useState(0);
  const [total, setTotal] = useState(0);

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

    const load = () => {
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.totalVisitors === "number") setTotal(d.totalVisitors);
          if (typeof d.totalRevenue === "number") setRevenue(d.totalRevenue);
          if (typeof d.liveVisitors === "number") setLive(d.liveVisitors);
        })
        .catch(() => {});
    };

    const ping = () => {
      fetch("/api/visitors/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.liveVisitors === "number") setLive(d.liveVisitors);
        })
        .catch(() => {});
    };

    load();
    ping();
    const a = setInterval(load, 20000);
    const b = setInterval(ping, 20000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-foreground/[0.03]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-opacity hover:opacity-80 relative z-10 shrink-0"
        >
          <img
            src="/logo.svg"
            alt="rankyourproduct logo"
            className="w-10 h-10 rounded-lg object-contain shadow-sm"
          />
          <span className="font-sans font-bold text-lg sm:text-xl lg:text-2xl tracking-tighter text-[#FE4103]">
            rankyourproduct
          </span>
        </Link>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center px-5 py-2 rounded-lg bg-[#FE4103]/10 border border-[#FE4103]/20">
          <span className="text-sm font-bold tracking-wide text-[#FE4103]">
            Collected ${revenue} so far
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-8 relative z-10">
          <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
            <Link
              href="/about"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/rules"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Rules
            </Link>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4 bg-foreground/[0.03] border border-foreground/[0.04] rounded-lg px-4 py-2 shadow-sm select-none">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold text-black tabular-nums">
                {live}{" "}
                <span className="text-[#FE4103] font-bold hidden sm:inline">
                  Live
                </span>
              </span>
            </div>
            <div className="w-px h-4 bg-foreground/10" />
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
                className="text-[#FE4103]"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm font-semibold text-black tabular-nums">
                {total}{" "}
                <span className="text-[#FE4103] font-bold hidden sm:inline">
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
