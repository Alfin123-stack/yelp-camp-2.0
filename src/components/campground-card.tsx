import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface CampgroundCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export default function CampgroundCard({
  id,
  title,
  location,
  price,
  description,
  imageUrl,
}: CampgroundCardProps) {
  return (
    <Link
      href={`/campgrounds/${id}`}
      className="group relative block h-[380px] w-full overflow-hidden rounded-2xl border border-forest-100 shadow-lg shadow-forest-900/5 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Background image with zoom on hover, or a neutral fallback */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-forest-100 text-sm text-forest-500">
          No image
        </div>
      )}

      {/* Gradient overlay for text readability, tinted forest instead of black */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-6">
        {/* Price badge, always visible top-right */}
        <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-cream-50 backdrop-blur-sm">
          ${price}/night
        </span>

        {/* Title + location + overview, slides up on hover to make room for CTA */}
        <div className="space-y-3 transition-transform duration-500 ease-in-out group-hover:-translate-y-14">
          <div>
            <h3 className="font-serif text-2xl font-medium text-cream-50">
              {title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-cream-100/80">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-cream-100/70 line-clamp-2">
            {description}
          </p>
        </div>

        {/* CTA revealed on hover */}
        <div className="absolute -bottom-14 left-0 w-full px-6 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-300 px-5 py-2 text-sm font-semibold text-forest-950">
            View campsite
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}