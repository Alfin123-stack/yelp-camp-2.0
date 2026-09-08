// src/components/campground-detail-hero.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  MapPin,
  MapPinned,
  MessageSquareText,
  Share2,
  Star,
  Tag,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CampgroundImage {
  url: string;
  filename?: string;
}

interface CampgroundHost {
  username: string;
}

export interface CampgroundDetailHeroProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  location: string;
  price: number;
  description: string;
  images: CampgroundImage[];
  host?: CampgroundHost;
  avgRating: number | null;
  reviewCount: number;
  /** Anchor the "Tulis ulasan" button scrolls to, e.g. "#reviews" */
  reviewsHref?: string;
  /** Anchor the "Lihat di peta" button scrolls to, e.g. "#map" */
  mapHref?: string;
  /** Edit/Delete buttons slot — pass only when the current user is the author */
  actions?: React.ReactNode;
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-forest-200"
          )}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-forest-700/70">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function CampgroundDetailHero({
  breadcrumbs,
  title,
  location,
  price,
  description,
  images,
  host,
  avgRating,
  reviewCount,
  reviewsHref = "#reviews",
  mapHref = "#map",
  actions,
}: CampgroundDetailHeroProps) {
  const [activeImage, setActiveImage] = React.useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-sm text-forest-700/60"
      >
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.href + item.label}>
            <Link href={item.href} className="transition-colors hover:text-forest-950">
              {item.label}
            </Link>
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
          </React.Fragment>
        ))}
      </nav>

      {/* Favorite / share row */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-forest-700 hover:bg-forest-50"
        >
          <Heart className="h-5 w-5" />
          <span className="sr-only">Simpan</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-forest-700 hover:bg-forest-50"
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Bagikan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-forest-100 bg-forest-50"
            >
              {hasImages ? (
                <img
                  src={images[activeImage].url}
                  alt={`${title} - foto ${activeImage + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-forest-500">
                  Belum ada foto
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {hasImages && images.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    activeImage === index
                      ? "w-6 bg-gold-400"
                      : "w-2 bg-forest-200 hover:bg-forest-300"
                  )}
                  aria-label={`Lihat foto ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-forest-700/70">
            <MapPin className="h-4 w-4" />
            {location}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-forest-950">
              ${price}
            </span>
            <span className="text-sm text-forest-700/60">/ malam</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="flex-1 rounded-full bg-gold-300 text-forest-950 hover:bg-gold-200"
            >
              <a href={reviewsHref}>
                <MessageSquareText className="h-4 w-4" />
                Tulis ulasan
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 rounded-full border-forest-200 text-forest-900 hover:bg-forest-50"
            >
              <a href={mapHref}>
                <MapPinned className="h-4 w-4" />
                Lihat di peta
              </a>
            </Button>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-100 bg-white px-3.5 py-1.5 text-xs font-medium text-forest-700">
              <Tag className="h-3.5 w-3.5 text-gold-500" />${price}/malam
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-100 bg-white px-3.5 py-1.5 text-xs font-medium text-forest-700">
              <MapPin className="h-3.5 w-3.5 text-gold-500" />
              {location}
            </span>
            {avgRating !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-100 bg-white px-3.5 py-1.5 text-xs font-medium text-forest-700">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                {avgRating.toFixed(1)} ({reviewCount})
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 leading-relaxed text-forest-700/80">{description}</p>

          {/* Edit / delete slot — only rendered when the caller passes it (author) */}
          {actions && <div className="mt-4 flex gap-2">{actions}</div>}

          {/* Host / author card */}
          {host && (
            <div className="mt-8 border-t border-forest-100 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-forest-100">
                    <AvatarFallback className="font-serif">
                      {host.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-forest-950">{host.username}</p>
                    {avgRating !== null ? (
                      <StarRating rating={avgRating} />
                    ) : (
                      <p className="text-sm text-forest-700/60">Belum ada ulasan</p>
                    )}
                  </div>
                </div>
                <Users className="h-5 w-5 text-forest-300" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}