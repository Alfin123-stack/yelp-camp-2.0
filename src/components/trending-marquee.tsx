"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface TrendingItem {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
}

const CARD_WIDTH = 260;
const CARD_GAP = 20;

export default function TrendingMarquee({ campgrounds }: { campgrounds: TrendingItem[] }) {
  if (campgrounds.length === 0) return null;

  // Duplicate the list so the loop has no visible seam, same pattern as
  // the landing page's marquee.
  const track = [...campgrounds, ...campgrounds];
  const loopDistance = campgrounds.length * (CARD_WIDTH + CARD_GAP);

  return (
    <div className="relative -mx-4 overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream-50 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream-50 to-transparent sm:w-24" />

      <motion.div
        className="flex gap-5 px-4"
        animate={{ x: [0, -loopDistance] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: campgrounds.length * 4,
            ease: "linear",
          },
        }}
      >
        {track.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            href={`/campgrounds/${c.id}`}
            className="group relative h-[180px] w-[260px] shrink-0 overflow-hidden rounded-xl"
          >
            {c.imageUrl ? (
              <img
                src={c.imageUrl}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-forest-100 text-xs text-forest-500">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
            <span className="absolute right-3 top-3 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-cream-50 backdrop-blur-sm">
              ${c.price}/night
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <h4 className="font-serif text-sm font-medium text-cream-50">{c.title}</h4>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-cream-100/75">
                <MapPin className="h-3 w-3" />
                {c.location}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}