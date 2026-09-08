// src/components/landing/campsite-showcase.tsx
"use client";

import FeatureShowcase, { type TabMedia } from "../ui/feature-showcase";

const tabs: TabMedia[] = [
  {
    value: "tent",
    label: "Tent sites",
    src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
    alt: "Tent pitched in a forest campground",
  },
  {
    value: "cabin",
    label: "Cabins",
    src: "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=1200&q=80",
    alt: "Wooden cabin surrounded by trees",
  },
  {
    value: "rv",
    label: "RV spots",
    src: "https://images.unsplash.com/photo-1533873984035-25970ab07461?w=1200&q=80",
    alt: "RV parked at a campground site",
  },
];

export default function CampsiteShowcase() {
  return (
    <FeatureShowcase
      eyebrow="Discover"
      title="Find the site that fits how you camp"
      description="From a simple tent pitch to a fully-equipped cabin or an RV hookup — browse real campgrounds, pinned precisely on the map, with photos and reviews from campers who've actually stayed there."
      stats={["500+ campgrounds", "Verified locations", "Real reviews"]}
      steps={[
        {
          id: "step-1",
          title: "Search by location",
          text: "Drop a pin or search a region — every campground on the map is geocoded to its exact spot, no guesswork.",
        },
        {
          id: "step-2",
          title: "Compare site types",
          text: "Switch between tent sites, cabins, and RV spots to see what's actually available before you commit.",
        },
        {
          id: "step-3",
          title: "Book with confidence",
          text: "Read first-hand reviews and ratings from campers who've pitched a tent there, then reserve your spot.",
        },
      ]}
      tabs={tabs}
      defaultTab="tent"
      panelMinHeight={640}
      ctaHref="/campgrounds"
      ctaLabel="Browse campgrounds"
      secondaryCtaHref="/campgrounds/new"
      secondaryCtaLabel="List your site"
    />
  );
}