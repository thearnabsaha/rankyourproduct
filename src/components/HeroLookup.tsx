"use client";

import { useCallback, useEffect, useState } from "react";
import { listingAvatar, listingLabel } from "@/lib/url";

type Preview = {
  id: string | null;
  url: string;
  domain: string;
  title: string;
  imageUrl?: string;
  highestBid: number;
  totalBids: number;
  rank: number;
  globalHighestBid: number;
};

export default function HeroLookup() {
  const [url, setUrl] = useState("");
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<Preview | null>(null);
  const [amount, setAmount] = useState(1);
  const [rank, setRank] = useState<number | null>(null);
  const [rankLoading, setRankLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const minBid = Math.max(1, (listing?.highestBid || 0) + 1);

  useEffect(() => {
    if (!listing) return;
    const takeFirst = Math.max(minBid, (listing.globalHighestBid || 0) + 1);
    setAmount(takeFirst);
    setRank(listing.rank);
  }, [listing, minBid]);

  const fetchRank = useCallback(async (value: number, listingId?: string | null) => {
    if (value < 1) return;
    setRankLoading(true);
    try {
      const qs = listingId
        ? `/api/listings/rank?amount=${value}&listingId=${listingId}`
        : `/api/listings/rank?amount=${value}`;
      const res = await fetch(qs);
      const data = await res.json();
      if (res.ok) setRank(data.rank);
    } catch {
      /* ignore */
    } finally {
      setRankLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!listing) return;
    const t = setTimeout(() => fetchRank(amount, listing.id), 300);
    return () => clearTimeout(t);
  }, [amount, listing, fetchRank]);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLooking(true);
    setError(null);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not read that link");
        return;
      }
      setListing(data.listing);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLooking(false);
    }
  };

  const pay = async () => {
    if (!listing) return;
    if (amount < minBid) {
      setError(`You need at least $${minBid}`);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = { amount };
      if (listing.id) payload.listingId = listing.id;
      else {
        payload.url = listing.url;
        payload.domain = listing.domain;
        payload.title = listing.title;
      }
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create checkout");
        return;
      }
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="text-center space-y-6 w-full mb-12">
      <h1 className="text-5xl sm:text-6xl md:text-[5rem] font-display font-medium leading-[1.1] tracking-tight text-black">
        Rank your product <br className="hidden sm:block" />
        <span className="italic">
          or your <span className="text-[#FE4103]">X profile.</span>
        </span>
      </h1>

      <div className="flex flex-col items-center space-y-8">
        <p className="text-lg text-[#FE4103] font-medium tracking-wide uppercase">
          A row starts at $1
        </p>

        <div className="w-full max-w-3xl mx-auto space-y-8">
          {listing ? (
            <div className="space-y-6">
              <div className="bg-white border border-foreground/[0.04] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl border border-foreground/[0.04] shadow-sm flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listingAvatar(listing.url, listing.domain, listing.imageUrl)}
                    alt=""
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-semibold text-black truncate">
                    {listingLabel(listing.url, listing.domain)}
                  </p>
                  {listing.title ? (
                    <p className="text-sm text-black/60 truncate">{listing.title}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setListing(null);
                    setError(null);
                  }}
                  className="ml-auto text-sm text-black/40 hover:text-black min-h-10 px-2"
                  aria-label="Choose a different product or profile"
                >
                  Change
                </button>
              </div>

              <div className="relative rounded-3xl border border-foreground/[0.04] bg-white px-6 py-8 sm:px-10 flex flex-col items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="text-center space-y-1 relative z-10">
                  <p className="text-xs font-bold text-[#FE4103] uppercase tracking-widest">
                    Pick your amount
                  </p>
                  {listing.highestBid > 0 && (
                    <p className="text-xs text-[#FE4103] font-medium">
                      Lowest you can pay now: ${minBid}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5 sm:gap-8 relative z-10">
                  <button
                    type="button"
                    aria-label="Decrease price"
                    onClick={() => setAmount((v) => Math.max(minBid, v - 1))}
                    className="w-12 h-12 rounded-2xl bg-white border border-foreground/[0.04] shadow-sm flex items-center justify-center text-xl font-bold text-[#FE4103] hover:bg-[#FE4103]/5 active:scale-95 transition-all cursor-pointer"
                  >
                    −
                  </button>
                  <div className="flex items-center text-5xl sm:text-6xl font-semibold tracking-tighter text-black">
                    <span className="text-[#FE4103] mr-1 select-none">$</span>
                    <input
                      id="bid-amount"
                      aria-label="Bid amount in US dollars"
                      type="number"
                      min={minBid}
                      value={amount || ""}
                      onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        if (!Number.isNaN(n) && n >= 1) setAmount(n);
                        if (e.target.value === "") setAmount(0);
                      }}
                      onBlur={() => {
                        if (amount < minBid || Number.isNaN(amount)) setAmount(minBid);
                      }}
                      className="w-32 sm:w-48 bg-transparent text-center focus:outline-none border-none p-0 m-0"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Increase price"
                    onClick={() => setAmount((v) => (v || 0) + 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-foreground/[0.04] shadow-sm flex items-center justify-center text-xl font-bold text-[#FE4103] hover:bg-[#FE4103]/5 active:scale-95 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-5 pt-3 w-full relative z-10">
                  <div className="flex items-center w-full justify-between px-5 py-3 bg-white border border-foreground/[0.04] rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <span className="text-[#FE4103] font-bold text-xs uppercase tracking-wider">
                      Rank
                    </span>
                    <span className="text-xl font-semibold text-black">
                      {rankLoading ? "..." : `#${rank ?? "?"}`}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center font-medium relative z-10">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={pay}
                  disabled={paying || amount < minBid}
                  className="w-full px-6 py-4 bg-[#FE4103] text-white font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-base shadow-lg shadow-[#FE4103]/20 disabled:opacity-50 disabled:active:scale-100 relative z-10 cursor-pointer disabled:cursor-not-allowed"
                >
                  {paying ? "Opening checkout..." : `Pay $${amount} to go live`}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={lookup} className="flex flex-col space-y-4">
              <label htmlFor="listing-url" className="sr-only">
                Product URL or X handle
              </label>
              <input
                id="listing-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Product URL or @handle on X..."
                autoComplete="url"
                required
                disabled={looking}
                className="w-full px-5 py-4 text-base bg-white border border-foreground/[0.04] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FE4103]/30 transition-all placeholder:text-black/40 text-black font-medium"
              />
              <button
                type="submit"
                disabled={looking}
                className="w-[85%] mx-auto px-6 py-3.5 bg-[#FE4103] text-white font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-base shadow-lg shadow-[#FE4103]/20 disabled:opacity-50 disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
              >
                {looking ? "Looking that up..." : "Get on the board"}
              </button>
              {error && (
                <p className="text-red-500 text-sm text-center font-medium">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
