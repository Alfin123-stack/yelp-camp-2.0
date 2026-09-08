import type { Metadata } from "next";
import Link from "next/link";
import { getCampgrounds, getCampgroundLocations } from "@/lib/actions/campgrounds";
import CampgroundCard from "@/components/campground-card";
import SpotlightCampground from "@/components/spotlight-campground";
import TrendingMarquee from "@/components/trending-marquee";
import ClusterMap from "@/components/cluster-map";
import { Search, ArrowUpDown } from "lucide-react";

export const metadata: Metadata = {
  title: "All Campgrounds",
  description: "Browse every campground listed on YelpCamp, pinned on an interactive map.",
};

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

type PriceRange = "budget" | "mid" | "premium" | null;

function parsePriceRange(value: string | string[] | undefined): PriceRange {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "budget" || raw === "mid" || raw === "premium") return raw;
  return null;
}

function matchesPriceRange(price: number, range: PriceRange): boolean {
  if (!range) return true;
  if (range === "budget") return price < 50;
  if (range === "mid") return price >= 50 && price <= 150;
  return price > 150; // premium
}

// No `dynamic = "force-dynamic"` needed under Cache Components: reading the
// DB with no `"use cache"` already makes this render per-request, and
// revalidatePath() in the campground/review server actions keeps it in sync
// as soon as data changes. loading.tsx supplies the Suspense boundary that
// Cache Components requires around that per-request read.
export default async function CampgroundsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[];
    location?: string;
    sort?: string;
    price?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const location = Array.isArray(params.location) ? params.location[0] : params.location ?? "";
  const sort = Array.isArray(params.sort) ? params.sort[0] : params.sort ?? "";
  const priceRange = parsePriceRange(params.price);

  // The card grid below is paginated (getCampgrounds), but the map always
  // plots every campground via a lightweight id/title/description/geometry
  // projection (getCampgroundLocations) — otherwise switching pages would
  // make pins disappear from the map, which would be confusing.
  const [{ campgrounds, total, totalPages }, allLocations] = await Promise.all([
    getCampgrounds(page),
    getCampgroundLocations(),
  ]);

  const features = allLocations.map((c) => ({
    type: "Feature" as const,
    geometry: c.geometry,
    properties: {
      id: c._id,
      title: c.title,
      description: c.description.slice(0, 60),
      price: c.price,
      imageUrl: c.images[0]?.url,
    },
  }));

  // Spotlight + trending marquee are a "hero" treatment for the first page
  // only — on later pages there are often too few items left over once one
  // is pulled out for the spotlight, which made the marquee duplicate a
  // single card and left the grid looking empty. Plain pages just get the
  // grid.
  const showHero = page === 1 && campgrounds.length >= 3;
  const spotlight = showHero ? campgrounds[0] : undefined;
  const gridSource = showHero ? campgrounds.slice(1) : campgrounds;

  // The price chips only filter what's already been fetched for this page
  // (`gridSource`) — they don't re-query the database, so `total`/pagination
  // counts above stay tied to the unfiltered page. Real global price
  // filtering would need a `price` param wired into getCampgrounds() itself.
  const filteredGrid = gridSource.filter((c) => matchesPriceRange(c.price, priceRange));

  const priceChips: { label: string; value: PriceRange }[] = [
    { label: "All prices", value: null },
    { label: "Under $50", value: "budget" },
    { label: "$50–150", value: "mid" },
    { label: "$150+", value: "premium" },
  ];

  function chipHref(value: PriceRange) {
    const qs = new URLSearchParams();
    if (location) qs.set("location", location);
    if (sort) qs.set("sort", sort);
    if (value) qs.set("price", value);
    const s = qs.toString();
    return `/campgrounds${s ? `?${s}` : ""}`;
  }

  return (
    <div className="relative min-h-screen bg-cream-50">
      {/* Soft radial glow behind the map area instead of a flat background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--color-gold-100)_0%,_transparent_60%)] opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Explore
        </span>
        <h1 className="mt-2 font-serif text-3xl font-medium text-forest-950 sm:text-4xl">
          All Campgrounds
        </h1>
        <p className="mt-1 text-forest-700/70">{total} campgrounds found</p>

        {/* Map + floating search/sort bar */}
        <div className="relative mt-10">
          <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-xl shadow-forest-900/5">
            <ClusterMap campgrounds={features} />
          </div>

          {/* Floating glassmorphism bar overlapping the top of the map.
              Wired to navigate with `location`/`sort` query params — actual
              filtering/sorting still needs to be implemented in
              getCampgrounds() to read these. */}
          <form
            action="/campgrounds"
            method="GET"
            className="absolute left-1/2 top-4 z-10 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 sm:top-6"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-forest-100 bg-white/85 p-2 shadow-lg shadow-forest-900/10 backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-forest-500" />
                <input
                  type="text"
                  name="location"
                  defaultValue={location}
                  placeholder="Search by city or region..."
                  className="w-full bg-transparent text-sm text-forest-950 placeholder:text-forest-700/50 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 border-t border-forest-100 px-3 py-2 sm:border-l sm:border-t-0">
                <ArrowUpDown className="h-4 w-4 shrink-0 text-forest-500" />
                <select
                  name="sort"
                  defaultValue={sort}
                  className="bg-transparent text-sm text-forest-950 focus:outline-none"
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gold-300 px-5 py-2 text-sm font-semibold text-forest-950 transition hover:bg-gold-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Spotlight + trending — first page only, see showHero above */}
        {spotlight && (
          <div className="mt-14">
            <SpotlightCampground
              id={spotlight._id}
              title={spotlight.title}
              location={spotlight.location}
              price={spotlight.price}
              description={spotlight.description}
              imageUrl={spotlight.images[0]?.url}
            />
          </div>
        )}

        {showHero && gridSource.length >= 3 && (
          <div className="mt-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Trending
            </span>
            <div className="mt-4">
              <TrendingMarquee
                campgrounds={gridSource.map((c) => ({
                  id: c._id,
                  title: c.title,
                  location: c.location,
                  price: c.price,
                  imageUrl: c.images[0]?.url,
                }))}
              />
            </div>
          </div>
        )}

        {/* Grid, with price chips and a bento layout (every 4th card wider).
            grid-flow-dense lets the grid backfill any gap a wide card
            would otherwise leave behind it instead of pushing a hole down
            to the next row. */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              {showHero ? "Popular right now" : "All campgrounds"}
            </span>
            <div className="flex flex-wrap gap-2">
              {priceChips.map((chip) => (
                <Link
                  key={chip.label}
                  href={chipHref(chip.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    priceRange === chip.value
                      ? "border-forest-950 bg-forest-950 text-cream-50"
                      : "border-forest-100 bg-white text-forest-700 hover:bg-forest-50"
                  }`}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-flow-dense gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrid.map((c, i) => (
              <div
                key={c._id}
                className={(i + 1) % 4 === 0 ? "sm:col-span-2" : undefined}
              >
                <CampgroundCard
                  id={c._id}
                  title={c.title}
                  location={c.location}
                  price={c.price}
                  description={c.description}
                  imageUrl={c.images[0]?.url}
                />
              </div>
            ))}
          </div>

          {filteredGrid.length === 0 && (
            <p className="mt-10 text-center text-forest-700/70">
              {priceRange
                ? "No campgrounds on this page match that price range — try another range or a different page."
                : "No campgrounds yet — be the first to add one!"}
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <Link
              href={`/campgrounds?page=${Math.max(1, page - 1)}`}
              aria-disabled={page <= 1}
              className={`rounded-md border border-forest-100 px-3 py-1.5 text-sm ${
                page <= 1
                  ? "pointer-events-none text-forest-300"
                  : "text-forest-700 hover:bg-forest-50"
              }`}
            >
              Previous
            </Link>
            <span className="text-sm text-forest-700/70">
              Page {page} of {totalPages}
            </span>
            <Link
              href={`/campgrounds?page=${Math.min(totalPages, page + 1)}`}
              aria-disabled={page >= totalPages}
              className={`rounded-md border border-forest-100 px-3 py-1.5 text-sm ${
                page >= totalPages
                  ? "pointer-events-none text-forest-300"
                  : "text-forest-700 hover:bg-forest-50"
              }`}
            >
              Next
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}