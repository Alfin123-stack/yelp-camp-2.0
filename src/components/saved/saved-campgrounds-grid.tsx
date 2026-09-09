"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Compass, Heart } from "lucide-react";
import { toggleSaveCampground } from "@/lib/actions/campgrounds";
import SavedCampgroundCard from "./saved-campground-card";
import type { CampgroundData } from "@/types/campground";

type SavedCampground = Pick<CampgroundData, "_id" | "title" | "location" | "price" | "images">;

interface SavedCampgroundsGridProps {
  campgrounds: SavedCampground[];
}

// Owns the list client-side (rather than just rendering server props
// as-is) so a remove can disappear instantly and — if the user hits Undo —
// reappear without a full page reload. Every card here is guaranteed
// already-saved, so toggleSaveCampground always means "remove" the first
// time and "re-add" if undone; no need to check current state before
// calling it.
export default function SavedCampgroundsGrid({ campgrounds: initial }: SavedCampgroundsGridProps) {
  const [campgrounds, setCampgrounds] = React.useState(initial);

  function handleRemove(removed: SavedCampground) {
    setCampgrounds((prev) => prev.filter((c) => c._id !== removed._id));
    toggleSaveCampground(removed._id);

    toast("Dihapus dari simpanan", {
      description: removed.title,
      action: {
        label: "Undo",
        onClick: () => {
          setCampgrounds((prev) =>
            prev.some((c) => c._id === removed._id) ? prev : [removed, ...prev]
          );
          toggleSaveCampground(removed._id);
        },
      },
    });
  }

  if (campgrounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-forest-200 bg-white/60 px-6 py-20 text-center">
        <Heart className="h-10 w-10 text-forest-300" />
        <h2 className="mt-4 font-serif text-xl font-medium text-forest-950">
          Belum ada campground tersimpan
        </h2>
        <p className="mt-2 max-w-sm text-sm text-forest-700/70">
          Yuk mulai jelajahi dan simpan tempat camping favoritmu — tinggal tap ikon hati di
          halaman campground.
        </p>
        <Link
          href="/campgrounds"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gold-300 px-5 py-2.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-200"
        >
          <Compass className="h-4 w-4" />
          Jelajahi Campground
        </Link>
      </div>
    );
  }

  return (
    <div
      role="list"
      className="group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {campgrounds.map((campground) => (
        <SavedCampgroundCard
          key={campground._id}
          campground={campground}
          onRemove={() => handleRemove(campground)}
        />
      ))}
    </div>
  );
}
