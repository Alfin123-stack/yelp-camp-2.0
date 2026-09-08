// src/components/related-campgrounds.tsx
import Link from "next/link";

interface RelatedCampground {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: { url: string }[];
}

export default function RelatedCampgrounds({
  campgrounds,
}: {
  campgrounds: RelatedCampground[];
}) {
  if (campgrounds.length === 0) return null;

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-forest-950">
        Kamu mungkin juga suka
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {campgrounds.map((c) => (
          <Link
            key={c._id}
            href={`/campgrounds/${c._id}`}
            className="group block overflow-hidden rounded-xl"
          >
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-forest-50">
              {c.images[0]?.url ? (
                <img
                  src={c.images[0].url}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-forest-400">
                  No image
                </div>
              )}
            </div>
            <p className="mt-2 truncate text-sm font-medium text-forest-950">{c.title}</p>
            <p className="truncate text-xs text-forest-700/60">
              {c.location} · ${c.price}/malam
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
