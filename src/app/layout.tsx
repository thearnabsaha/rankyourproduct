import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";
import JsonLd from "@/components/JsonLd";
import {
  CANONICAL_HOST,
  organizationJsonLd,
  SEO_DESCRIPTION,
  SEO_TITLE,
  websiteJsonLd,
} from "@/lib/seo";
import { X_HANDLE } from "@/lib/site";
import { readPresence } from "@/lib/presence";
import { syncBackdoorListings } from "@/lib/backdoor";
import { syncPaidListingsFromDodo } from "@/lib/dodo-sync";
import Analytics from "@/components/Analytics";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_HOST),
  title: {
    default: SEO_TITLE,
    template: "%s — rankyourproduct",
  },
  description: SEO_DESCRIPTION,
  applicationName: "rankyourproduct",
  authors: [{ name: "Arnab Saha", url: `https://x.com/${X_HANDLE}` }],
  creator: `@${X_HANDLE}`,
  publisher: "Arnab Saha",
  category: "business",
  keywords: [
    "product discovery",
    "startup directory",
    "pay to rank",
    "list your product",
    "X profile ranking",
  ],
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: CANONICAL_HOST,
    siteName: "RankYourProduct",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    creator: `@${X_HANDLE}`,
    site: `@${X_HANDLE}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "rankyourproduct",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#141413",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let initial = { liveVisitors: 0, totalVisitors: 0, totalRevenue: 0 };
  try {
    await syncBackdoorListings();
    try {
      await syncPaidListingsFromDodo();
    } catch {
      /* Dodo may be slow or unset; board still loads */
    }
    initial = await readPresence();
  } catch {
    /* db may be cold on Vercel */
  }

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSans.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-raised focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Analytics />
        <PwaRegister />
        <Header initial={initial} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
