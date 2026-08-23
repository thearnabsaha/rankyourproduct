import type { MetadataRoute } from "next";
import { absUrl, CANONICAL_HOST } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/success",
          "/success/",
          "/admin",
          "/admin/",
          "/checkout",
          "/dashboard",
          "/login",
        ],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: CANONICAL_HOST,
  };
}
