"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";

export default function CtaBanner() {
  return (
    <section className="relative w-full overflow-hidden border border-forest-100 bg-cream-50 px-6 py-16 shadow-xl shadow-forest-900/5 md:px-16 md:py-24">
      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-10 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-xl text-left"
        >
          <h2 className="font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
            Ready to find your perfect campsite?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-forest-700/70">
            Join a community that values a good view and an honest review in
            equal measure.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-gold-300 px-8 h-12 text-base font-semibold text-forest-950 hover:bg-gold-200"
            >
              <Link href="/register">
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Link
              href="/campgrounds"
              className="text-sm font-medium text-forest-700 hover:text-forest-900"
            >
              or browse campgrounds first
            </Link>
          </div>
        </motion.div>

        {/* Fixed-size wrapper gives the globe a real, non-zero container
            to measure on mount — Globe itself no longer carries absolute
            positioning, so this div fully controls placement/size. */}
        <div className="relative h-[280px] w-full max-w-xl overflow-visible md:h-[360px]">
          <div className="absolute -bottom-16 -right-16 h-[380px] w-[380px] md:-right-24 md:h-[480px] md:w-[480px]">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}