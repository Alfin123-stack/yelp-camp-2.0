"use client";

import { motion } from "framer-motion";
import { Compass, CalendarCheck, PenLine, type LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Compass,
    title: "Discover",
    description:
      "Search by location, price, or terrain and browse a curated map of campgrounds worth the drive.",
  },
  {
    icon: CalendarCheck,
    title: "Plan your visit",
    description:
      "Check exact coordinates, photos, and pricing, then get directions straight from the listing.",
  },
  {
    icon: PenLine,
    title: "Share the story",
    description:
      "Come back after your trip and leave a rating — every review helps the next camper choose well.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream-50 py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500">
            How it works
          </span>
          <h2 className="mt-3 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
            Three steps to your next campsite
          </h2>
        </motion.div>

        <div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          <div
            className="absolute left-0 right-0 top-6 hidden h-px bg-forest-200 sm:block"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold-300 bg-cream-50 text-forest-800">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-medium text-forest-950">
                {String(i + 1).padStart(2, "0")} — {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest-700/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}