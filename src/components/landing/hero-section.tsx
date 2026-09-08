"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageStreamHero } from "./image-stream-hero";

// Real campsites, not stock-photo filler — every shot is something a
// camper on this platform could plausibly have taken.
const CORRIDOR_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Tent pitched on a mountain overlook",
  },
  {
    src: "https://images.unsplash.com/photo-1780840883415-6babdeaf9d70?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Sunlight breaking through a forest trail",
  },
  {
    src: "https://images.unsplash.com/photo-1758170751412-3ef5db7d1de6?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Canoe resting on a turquoise mountain lake",
  },
  {
    src: "https://images.unsplash.com/photo-1724870173195-cb2829436cd1?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Tent pitched on a mountainside at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1632714392895-81a0293c75e8?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Campfire glowing under a starry sky beside a lake",
  },
  {
    src: "https://images.unsplash.com/photo-1758272960205-96258d60ac1f?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Friends gathered around a campfire at night",
  },
  {
    src: "https://images.unsplash.com/photo-1758705023495-b64dfe01f970?w=600&h=800&fit=crop&auto=format&q=70",
    alt: "Tent under a sky full of stars",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  return (
    <ImageStreamHero
      images={CORRIDOR_IMAGES}
      cards={CORRIDOR_IMAGES.length}
      speed={22}
      axis={58}
      className="min-h-[100svh] bg-forest-950 text-cream-50"
    >
      {/* Vignette: dark enough at top and bottom to carry text, but the
          corridor is left mostly uncovered through the middle where the
          cards are largest — the photos are the point. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/25 to-forest-950"
        aria-hidden="true"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-between px-4 py-16 text-center sm:py-20"
      >
        <div className="flex flex-col items-center">
          <motion.h1
            variants={item}
            className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-cream-50 sm:text-6xl"
          >
            Find a campground,
            <br />
            then disappear into it.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-cream-100/80 sm:text-lg"
          >
            Camper-verified sites, honest reviews, and booking that takes a
            minute — so the only thing left to plan is which trail to hike
            first.
          </motion.p>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            variants={item}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-gold-300 px-8 h-12 text-base font-semibold text-forest-950 shadow-lg shadow-gold-900/20 hover:bg-gold-200"
            >
              <Link href="/campgrounds">
                Browse campgrounds
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-cream-100/25 bg-white/5 px-8 h-12 text-base text-cream-50 hover:bg-white/10"
            >
              <Link href="/campgrounds/new">List your site</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 text-sm text-cream-100/70"
          >
            Every listing here comes from someone who&apos;s actually camped
            there.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.6 },
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            }}
            className="mt-10 hidden sm:flex"
            aria-hidden="true"
          >
            <ChevronDown className="h-5 w-5 text-cream-100/40" />
          </motion.div>
        </div>
      </motion.div>
    </ImageStreamHero>
  );
}