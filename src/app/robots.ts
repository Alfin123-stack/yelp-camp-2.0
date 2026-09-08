import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/campgrounds/new", "/campgrounds/*/edit", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
