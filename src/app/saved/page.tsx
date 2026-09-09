import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSavedCampgrounds } from "@/lib/actions/campgrounds";
import SavedCampgroundsGrid from "@/components/saved/saved-campgrounds-grid";

export const metadata: Metadata = {
  title: "Campground Tersimpan",
};

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const campgrounds = await getSavedCampgrounds();

  return (
    <div className="bg-cream-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Koleksi kamu
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
            Campground Tersimpan
          </h1>
          <p className="mt-1 text-sm text-forest-700/60">
            {campgrounds.length > 0
              ? `${campgrounds.length} campground tersimpan`
              : "Belum ada yang disimpan"}
          </p>
        </div>

        <SavedCampgroundsGrid campgrounds={campgrounds} />
      </div>
    </div>
  );
}
