import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface SpotlightCampgroundProps {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export default function SpotlightCampground({
  id,
  title,
  location,
  price,
  description,
  imageUrl,
}: SpotlightCampgroundProps) {
  return (
    <Link
      href={`/campgrounds/${id}`}
      className="group relative flex min-h-[320px] overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-xl shadow-forest-900/5 md:min-h-[380px]"
    >
      <div className="relative w-full md:w-1/2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-forest-100 text-sm text-forest-500">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent md:hidden" />
      </div>

      <div className="relative flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Spotlight
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 flex items-center gap-1 text-sm text-forest-700/80">
          <MapPin className="h-3.5 w-3.5" />
          {location}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-forest-700/70 line-clamp-3">
          {description}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <span className="rounded-full bg-forest-950 px-4 py-1.5 text-sm font-medium text-cream-50">
            ${price}/night
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest-950 group-hover:text-gold-600">
            View campsite
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}