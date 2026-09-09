"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampgroundData } from "@/types/campground";

type SavedCampground = Pick<CampgroundData, "_id" | "title" | "location" | "price" | "images">;

interface SavedCampgroundCardProps {
  campground: SavedCampground;
  onRemove: () => void;
}

// Adapted from the HoverRevealCards reference: same "hover one, dim the
// rest" group effect (the `group` class lives on <SavedCampgroundsGrid>'s
// wrapper), restyled forest/gold/cream, plus a working remove button the
// reference didn't have. The image/heart/link are siblings rather than the
// button nested inside the <Link> — nesting a button inside an anchor is
// invalid HTML and would make the whole card a single ambiguous target.
export default function SavedCampgroundCard({ campground, onRemove }: SavedCampgroundCardProps) {
  const image = campground.images[0]?.url;

  return (
    <div
      role="listitem"
      aria-label={`${campground.title}, ${campground.location}`}
      className={cn(
        "relative h-80 overflow-hidden rounded-2xl bg-forest-100 bg-cover bg-center shadow-lg shadow-forest-900/10 transition-all duration-500 ease-in-out",
        "group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]",
        "hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-within:!scale-105 focus-within:!opacity-100 focus-within:!blur-none"
      )}
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {!image && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-forest-500">
          Belum ada foto
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />

      {/* Whole-card click target, underneath the remove button (z-0 vs z-10
          below) so the two never compete for the same click. */}
      <Link
        href={`/campgrounds/${campground._id}`}
        className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        aria-label={`Lihat ${campground.title}`}
      />

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-cream-50 backdrop-blur-sm">
        ${campground.price}/malam
      </span>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Hapus dari simpanan"
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-forest-950/50 text-cream-50 backdrop-blur-sm transition-colors hover:bg-forest-950/80"
      >
        <Heart className="h-4 w-4 fill-gold-400 text-gold-400" />
      </button>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full p-5">
        <p className="flex items-center gap-1 text-xs font-light uppercase tracking-widest text-cream-100/80">
          <MapPin className="h-3 w-3" />
          {campground.location}
        </p>
        <h3 className="mt-1 font-serif text-xl font-medium text-cream-50">{campground.title}</h3>
      </div>
    </div>
  );
}
