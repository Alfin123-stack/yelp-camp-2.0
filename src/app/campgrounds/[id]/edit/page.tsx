import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCampgroundById, updateCampground } from "@/lib/actions/campgrounds";
import { auth } from "@/auth";
import CampgroundForm from "@/components/campground-form";
import type { CampgroundData } from "@/types/campground";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit campground",
};

// No `dynamic = "force-dynamic"` needed under Cache Components — see
// loading.tsx for the Suspense boundary this route needs instead.

export default async function EditCampgroundPage({ params }: PageProps) {
  const { id } = await params;
  const [campground, session] = await Promise.all([
    getCampgroundById(id) as Promise<CampgroundData | null>,
    auth(),
  ]);

  if (!campground) notFound();
  if (!session?.user || session.user.id !== campground.author?._id) {
    redirect(`/campgrounds/${id}?error=You do not have permission to do that!`);
  }

  const boundUpdate = updateCampground.bind(null, id);
  const coverImage = campground.images[0]?.url;

  return (
    <div className="grid min-h-screen gap-8 bg-cream-50 p-6 md:grid-cols-2 md:p-20">
      {/* Left: the campground's own cover photo rather than generic stock —
          editing should feel like returning to *this* listing, not a blank
          form. Falls back to a plain forest gradient panel (same palette,
          no photo) if it has no images yet, instead of a broken <img>.
          Sticky on desktop, matching the Add page's hero panel. */}
      <div className="relative h-64 overflow-hidden rounded-3xl shadow-xl shadow-forest-900/10 md:sticky md:top-20 md:h-[calc(100vh-10rem)]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={campground.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Editing
          </span>
          <p className="mt-3 max-w-sm font-serif text-2xl font-medium text-cream-50 sm:text-3xl">
            {campground.title}
          </p>
        </div>
      </div>

      {/* Right: the form, in its own rounded + shadowed panel — same
          structure as the Add page's form panel. */}
      <div className="relative overflow-hidden rounded-3xl border border-forest-100 bg-white px-4 py-10 shadow-xl shadow-forest-900/10 sm:px-8 md:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--color-gold-100)_0%,_transparent_60%)] opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Update your site
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
            Edit campground
          </h1>
          <p className="mt-1 text-sm text-forest-700/70">
            Update the details below — changes go live as soon as you save.
          </p>

          <div className="mt-8">
            <CampgroundForm
              action={boundUpdate}
              campground={campground}
              submitLabel="Update campground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}