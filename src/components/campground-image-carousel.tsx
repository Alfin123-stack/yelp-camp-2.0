// src/components/campground-image-carousel.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CampgroundImageCarouselProps {
  images: { url: string }[];
  title: string;
}

export default function CampgroundImageCarousel({
  images,
  title,
}: CampgroundImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-forest-100 text-sm text-forest-500">
        No image
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <img
        src={images[index].url}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Foto sebelumnya"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-950/40 p-1.5 text-cream-50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-forest-950/60"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Foto berikutnya"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-forest-950/40 p-1.5 text-cream-50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-forest-950/60"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? "w-4 bg-gold-300" : "w-1.5 bg-cream-50/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}