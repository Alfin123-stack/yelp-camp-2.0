import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getCampgroundById, getRelatedCampgrounds } from "@/lib/actions/campgrounds";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { CampgroundDetailHero } from "@/components/campground-detail-hero";
import ShowMap from "@/components/show-map";
import ReviewForm from "@/components/review-form";
import ReviewList from "@/components/review-list";
import RelatedCampgrounds from "@/components/related-campgrounds";
import DeleteCampgroundButton from "@/components/delete-campground-button";
import type { CampgroundData } from "@/types/campground";

interface PageProps {
  params: Promise<{ id: string }>;
}

// No `dynamic = "force-dynamic"` needed under Cache Components — see
// loading.tsx for the Suspense boundary this route needs instead.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const campground: CampgroundData | null = await getCampgroundById(id);

  if (!campground) {
    return { title: "Campground not found" };
  }

  const description = campground.description.slice(0, 155);

  return {
    title: campground.title,
    description,
    openGraph: {
      title: campground.title,
      description,
      images: campground.images[0] ? [{ url: campground.images[0].url }] : undefined,
    },
  };
}

export default async function CampgroundShowPage({ params }: PageProps) {
  const { id } = await params;
  const [campground, session] = await Promise.all([
    getCampgroundById(id) as Promise<CampgroundData | null>,
    auth(),
  ]);

  if (!campground) {
    notFound();
  }

  const isAuthor = session?.user?.id === campground.author?._id;
  const avgRating =
    campground.reviews.length > 0
      ? campground.reviews.reduce((sum, r) => sum + r.rating, 0) / campground.reviews.length
      : null;

  // Fetched alongside the review/author data the hero needs — not blocking
  // on it, since the related grid renders as its own section further down.
  const related = await getRelatedCampgrounds(campground._id, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: campground.title,
    description: campground.description,
    address: campground.location,
    image: campground.images.map((img) => img.url),
    ...(avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: campground.reviews.length,
      },
    }),
    geo: {
      "@type": "GeoCoordinates",
      longitude: campground.geometry.coordinates[0],
      latitude: campground.geometry.coordinates[1],
    },
  };

  return (
    <div className="bg-cream-50 py-10">
      {/* JSON-LD structured data for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4">
        {/* Single card shell — mirrors the reference's "bg-card rounded-2xl
            shadow-sm" wrapper so the hero, map, reviews and related grid
            all read as one cohesive product-style page instead of loose
            floating sections. */}
        <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-sm shadow-forest-900/5">
          <div className="p-6 sm:p-10">
            <CampgroundDetailHero
              breadcrumbs={[
                { label: "Beranda", href: "/" },
                { label: "Campground", href: "/campgrounds" },
                { label: campground.title, href: `/campgrounds/${campground._id}` },
              ]}
              title={campground.title}
              location={campground.location}
              price={campground.price}
              description={campground.description}
              images={campground.images}
              host={campground.author ? { username: campground.author.username } : undefined}
              avgRating={avgRating}
              reviewCount={campground.reviews.length}
              reviewsHref="#reviews"
              mapHref="#map"
              actions={
                isAuthor ? (
                  <>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={`/campgrounds/${campground._id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteCampgroundButton id={campground._id} />
                  </>
                ) : undefined
              }
            />
          </div>

          {/* Location */}
          <div id="map" className="scroll-mt-24 border-t border-forest-100 px-6 py-10 sm:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Lokasi
            </span>
            <h2 className="mt-2 mb-4 font-serif text-2xl font-medium text-forest-950">
              Di mana campground ini
            </h2>
            <ShowMap
              coordinates={campground.geometry.coordinates}
              title={campground.title}
              location={campground.location}
            />
          </div>

          {/* Reviews */}
          <div
            id="reviews"
            className="scroll-mt-24 border-t border-forest-100 px-6 py-10 sm:px-10"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Ulasan
            </span>
            <h2 className="mt-2 mb-6 font-serif text-2xl font-medium text-forest-950">
              {campground.reviews.length > 0
                ? `${campground.reviews.length} ulasan`
                : "Belum ada ulasan"}
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {session?.user ? (
                <ReviewForm campgroundId={campground._id} />
              ) : (
                <p className="h-fit rounded-2xl border border-forest-100 bg-white p-6 text-sm text-forest-700/70 shadow-sm shadow-forest-900/5">
                  <Link href="/login" className="font-medium text-gold-600 hover:underline">
                    Login
                  </Link>{" "}
                  untuk memberi ulasan.
                </p>
              )}

              <ReviewList
                campgroundId={campground._id}
                reviews={campground.reviews}
                currentUserId={session?.user?.id}
              />
            </div>
          </div>

          {/* You might also like */}
          {related.length > 0 && (
            <div className="border-t border-forest-100 px-6 py-10 sm:px-10">
              <RelatedCampgrounds campgrounds={related} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}