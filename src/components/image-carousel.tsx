"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampgroundImage } from "@/types/campground";

export default function ImageCarousel({ images, title }: { images: CampgroundImage[]; title: string }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
        No images uploaded
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div className="relative">
      <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <Image
          src={images[index].url}
          alt={`${title} — image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover"
          priority={index === 0}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === index ? "bg-emerald-700" : "bg-slate-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
