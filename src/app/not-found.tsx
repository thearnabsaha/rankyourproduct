import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false, nocache: true },
};

export default function NotFound() {
  return (
    <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black mb-4">
        That page is not on the board.
      </h1>
      <p className="text-[17px] leading-8 text-black/70 mb-8">
        The link may be old, or that listing is not live yet.
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3.5 bg-[#FE4103] text-white font-medium rounded-xl hover:opacity-90"
      >
        Back to the product board
      </Link>
    </div>
  );
}
