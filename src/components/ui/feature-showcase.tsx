"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type TabMedia = {
  value: string;
  label: string;
  src: string;
  alt?: string;
};

export type ShowcaseStep = {
  id: string;
  title: string;
  text: string;
};

export type FeatureShowcaseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  stats?: string[];
  steps?: ShowcaseStep[];
  tabs: TabMedia[];
  defaultTab?: string;
  panelMinHeight?: number;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  className?: string;
  /** ms between auto-rotating tabs, set 0 to disable */
  autoPlayInterval?: number;
};

function AccordionRow({
  step,
  isOpen,
  onToggle,
}: {
  step: ShowcaseStep;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-forest-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-serif text-base font-medium text-forest-950">
          {step.title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-forest-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-forest-700/70">
              {step.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeatureShowcase({
  eyebrow = "Discover",
  title,
  description,
  stats = [],
  steps = [],
  tabs = [],
  defaultTab,
  panelMinHeight = 640,
  ctaHref,
  ctaLabel = "Get started",
  secondaryCtaHref,
  secondaryCtaLabel = "Browse examples",
  className = "",
  autoPlayInterval = 4000,
}: FeatureShowcaseProps) {
  const [activeTab, setActiveTab] = useState(
    defaultTab ?? tabs[0]?.value ?? ""
  );
  const [openStep, setOpenStep] = useState<string | null>(
    steps[0]?.id ?? null
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const active = tabs.find((t) => t.value === activeTab) ?? tabs[0];

  useEffect(() => {
    if (!autoPlayInterval || tabs.length < 2) return;

    intervalRef.current = setInterval(() => {
      setActiveTab((current) => {
        const idx = tabs.findIndex((t) => t.value === current);
        const next = tabs[(idx + 1) % tabs.length];
        return next?.value ?? current;
      });
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tabs, autoPlayInterval]);

  function handleTabClick(value: string) {
    setActiveTab(value);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoPlayInterval && tabs.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveTab((current) => {
          const idx = tabs.findIndex((t) => t.value === current);
          const next = tabs[(idx + 1) % tabs.length];
          return next?.value ?? current;
        });
      }, autoPlayInterval);
    }
  }

  return (
    <section className={`bg-cream-50 py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-12 md:gap-14">
          {/* Left column */}
          <div className="md:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-500">
                {eyebrow}
              </span>

              <h2 className="mt-3 text-balance font-serif text-3xl font-medium leading-[1.05] text-forest-950 sm:text-4xl md:text-5xl">
                {title}
              </h2>

              {description ? (
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-forest-700/70">
                  {description}
                </p>
              ) : null}

              {stats.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {stats.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-forest-100 bg-white px-3 py-1 text-xs font-medium text-forest-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-10 max-w-xl"
              >
                <div className="border-t border-forest-100">
                  {steps.map((step) => (
                    <AccordionRow
                      key={step.id}
                      step={step}
                      isOpen={openStep === step.id}
                      onToggle={() =>
                        setOpenStep(openStep === step.id ? null : step.id)
                      }
                    />
                  ))}
                </div>

                {(ctaHref || secondaryCtaHref) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {ctaHref && (
                      <Link
                        href={ctaHref}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-forest-900 px-6 text-sm font-medium text-gold-300 transition-colors hover:bg-forest-800"
                      >
                        {ctaLabel}
                      </Link>
                    )}
                    {secondaryCtaHref && (
                      <Link
                        href={secondaryCtaHref}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-forest-200 bg-transparent px-6 text-sm font-medium text-forest-900 transition-colors hover:bg-forest-50"
                      >
                        {secondaryCtaLabel}
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-6"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-xl shadow-forest-900/5"
              style={{ height: panelMinHeight, minHeight: panelMinHeight }}
            >
              <AnimatePresence mode="wait">
                {active && (
                  <motion.img
                    key={active.value}
                    src={active.src}
                    alt={active.alt ?? active.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>

              {tabs.length > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex w-full justify-center">
                  <div className="pointer-events-auto flex gap-1 rounded-xl border border-forest-100 bg-white/85 p-1 backdrop-blur supports-[backdrop-filter]:bg-white/70">
                    {tabs.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => handleTabClick(t.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === t.value
                            ? "bg-forest-900 text-gold-300"
                            : "text-forest-700 hover:text-forest-950"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}