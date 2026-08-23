import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
  alternates: { canonical: "/success" },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) {
  const q = await searchParams;
  const mock = q.mock === "1";

  return (
    <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black mb-4">
        Your row is live.
      </h1>
      <p className="text-[17px] leading-8 text-black/70 mb-8">
        {mock
          ? "Test checkout finished. The listing is on the table — plug in Dodo Payments before you go public."
          : "We have the payment. The table usually updates within a few seconds."}
      </p>
      <Link
        href="/"
        className="inline-flex px-6 py-3.5 bg-[#FE4103] text-white font-medium rounded-xl hover:opacity-90 shadow-lg shadow-[#FE4103]/20"
      >
        See the table
      </Link>
    </div>
  );
}
