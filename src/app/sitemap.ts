import type { MetadataRoute } from "next";
import { getCampgroundLocations } from "@/lib/actions/campgrounds";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Every campground needs a URL entry, but the sitemap only needs the id —
  // the lightweight projection avoids pulling every campground's full
  // images/description just to build a list of links.
  const campgrounds = await getCampgroundLocations();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/campgrounds`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/register`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const campgroundRoutes: MetadataRoute.Sitemap = campgrounds.map(
    (c: { _id: string }) => ({
      url: `${siteUrl}/campgrounds/${c._id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...campgroundRoutes];
}
