import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false, nocache: true },
};

export default function NotFound() {
  return (
    <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-ink mb-4">
        That page is not on the board.
      </h1>
      <p className="text-[17px] leading-8 text-ink-soft mb-8">
        The link may be old, or that listing is not live yet.
      </p>
      <Link href="/" className="btn-primary px-6 py-3.5">
        Back to the product board
      </Link>
    </div>
  );
}
