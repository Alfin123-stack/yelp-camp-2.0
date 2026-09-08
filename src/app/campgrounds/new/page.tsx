import type { Metadata } from "next";
import CampgroundForm from "@/components/campground-form";
import { createCampground } from "@/lib/actions/campgrounds";

export const metadata: Metadata = {
  title: "Add a new campground",
  description: "List your campground on YelpCamp.",
};

export default function NewCampgroundPage() {
  return (
    <div className="grid min-h-screen gap-8 bg-cream-50 p-6 md:grid-cols-2 md:p-20">
      {/* Left: full-height image, sticky on desktop so it stays in view
          while the form on the right scrolls. Stacks on top on mobile.
          Rounded + shadowed like its own panel, matching the form's card
          on the right, instead of a sharp-edged image bleeding to the
          page edge. */}
      <div className="relative h-64 overflow-hidden rounded-3xl shadow-xl shadow-forest-900/10 md:sticky md:top-20 md:h-[calc(100vh-10rem)]">
        <img
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=80"
          alt="Tent pitched in a forest campground at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Become a host
          </span>
          <p className="mt-3 max-w-sm font-serif text-2xl font-medium text-cream-50 sm:text-3xl">
            Every great trip starts with the right site.
          </p>
        </div>
      </div>

      {/* Right: the form, in its own rounded + shadowed panel */}
      <div className="relative overflow-hidden rounded-3xl border border-forest-100 bg-white px-4 py-10 shadow-xl shadow-forest-900/10 sm:px-8 md:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--color-gold-100)_0%,_transparent_60%)] opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            List your site
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
            Add a new campground
          </h1>
          <p className="mt-1 text-sm text-forest-700/70">
            Share the details campers actually care about — where it is, what it costs, and what
            makes it worth the drive.
          </p>

          <div className="mt-8">
            <CampgroundForm action={createCampground} submitLabel="Create campground" />
          </div>
        </div>
      </div>
    </div>
  );
}