"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface FeaturedCampground {
  id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  image: string;
}

// Demo content using Unsplash stock photography, picked to match the app's
// existing "campground" shape (title/location/price/image) so this drops in
// cleanly once real data is ready.
//
// To switch to real listings: fetch with `getCampgrounds()` (see
// src/lib/actions/campgrounds.ts) inside its own small async server
// component, and wrap *that* component in <Suspense> — the same Cache
// Components pattern already used for <NavAuthLinks> in navbar.tsx and the
// footer's cached copyright year — so this section streams in instead of
// forcing the whole homepage to render dynamically.
const DEMO_CAMPGROUNDS: FeaturedCampground[] = [
  {
    id: "1",
    title: "Cedar Hollow Ridge",
    location: "Asheville, North Carolina",
    price: 42,
    category: "Forest",
    image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&auto=format&q=75",
  },
  {
    id: "2",
    title: "Silver Lake Basecamp",
    location: "Lake Tahoe, California",
    price: 58,
    category: "Lakeside",
    image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&q=75",
  },
  {
    id: "3",
    title: "Windward Bluff",
    location: "Moab, Utah",
    price: 35,
    category: "Desert",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&q=75",
  },
  {
    id: "4",
    title: "Pinecrest Meadow",
    location: "Aspen, Colorado",
    price: 64,
    category: "Mountain",
    image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800&auto=format&q=75",
  },
  {
    id: "5",
    title: "Driftwood Cove",
    location: "Olympic Peninsula, Washington",
    price: 49,
    category: "Coastal",
    image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800&auto=format&q=75",
  },
];

const CARD_WIDTH = 300;
const CARD_GAP = 24;

export default function FeaturedCampgrounds({
  campgrounds = DEMO_CAMPGROUNDS,
}: {
  campgrounds?: FeaturedCampground[];
}) {
  const track = [...campgrounds, ...campgrounds];
  const loopDistance = campgrounds.length * (CARD_WIDTH + CARD_GAP);

  return (
    <section className="relative overflow-hidden bg-forest-950 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              Featured spots
            </span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-cream-50 sm:text-4xl">
              A handful of favorites
            </h2>
          </div>
          <Link
            href="/campgrounds"
            className="group inline-flex items-center gap-1 text-sm font-medium text-cream-100/80 hover:text-gold-300"
          >
            View all campgrounds
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-forest-950 to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-forest-950 to-transparent sm:w-40" />

        <motion.div
          className="flex gap-6 pl-4"
          animate={{ x: [0, -loopDistance] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: campgrounds.length * 5,
              ease: "linear",
            },
          }}
        >
          {track.map((camp, i) => (
            <Link
              key={`${camp.id}-${i}`}
              href="/campgrounds"
              className="group relative h-[360px] w-[300px] shrink-0 overflow-hidden rounded-2xl"
            >
              <img
                src={camp.image}
                alt={camp.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/10 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cream-50 backdrop-blur-sm">
                ${camp.price}/night
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-gold-300">
                  {camp.category}
                </span>
                <h3 className="mt-1 font-serif text-xl font-medium text-cream-50">
                  {camp.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-cream-100/70">
                  <MapPin className="h-3.5 w-3.5" />
                  {camp.location}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}