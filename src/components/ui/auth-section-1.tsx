// auth-section-1.tsx
"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { Tent } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthSectionOneProps {
  title: string;
  subtitle?: string;
  panelHeadline: [string, string];
  panelCta?: { label: string; href: string };
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthSectionOne({
  title,
  subtitle,
  panelHeadline,
  panelCta,
  footer,
  children,
}: AuthSectionOneProps) {
  return (
    <section className="bg-cream-50 px-3 py-10 font-sans text-forest-950 antialiased dark:bg-forest-950 dark:text-cream-50 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 lg:min-h-[640px] lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex items-center rounded-md border border-forest-200 bg-white px-6 py-10 sm:px-10 sm:py-14 dark:border-forest-800 dark:bg-forest-900/30 lg:px-14 xl:px-16">
          <div className="mx-auto w-full max-w-[480px]">
            <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 font-sans text-base leading-snug text-forest-700/70 dark:text-cream-100/55 sm:text-lg">
                {subtitle}
              </p>
            )}

            <div className="mt-10">{children}</div>

            {footer && (
              <div className="mt-6 font-sans text-sm text-forest-700/70 dark:text-cream-100/60">
                {footer}
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-md bg-forest-950 p-10 text-cream-50 lg:flex lg:min-h-0">
          <GrainGradient
            speed={1}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={["#f6ecd4", "#3c7a61", "#1a3c2d", "#dfc07d"]}
            colorBack="#00000000"
            className="absolute inset-0 bg-forest-950"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <h2 className="max-w-[520px] font-serif text-4xl font-medium tracking-tight text-cream-50 xl:text-[52px] xl:leading-[1.02]">
              {panelHeadline[0]}
              <br />
              {panelHeadline[1]}
            </h2>

            {panelCta && (
              <Link
                href={panelCta.href}
                className="mb-0 inline-flex h-12 max-w-full items-center gap-3 self-start rounded-[10px] border border-gold-300/40 px-5 font-sans text-base font-medium text-cream-100/85 backdrop-blur-sm transition-colors hover:border-gold-300 hover:text-gold-100"
              >
                <Tent className="size-5 shrink-0" aria-hidden="true" />
                <span className="truncate whitespace-nowrap">{panelCta.label}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}