import Link from "next/link";
import { Suspense } from "react";
import { Tent, Plus } from "lucide-react";
import NavAuthLinks from "@/components/nav-auth-links";
import MobileAuthLinks from "@/components/mobile-auth-links";
import NavCampgroundsMenu from "@/components/nav-campgrounds-menu";
import MobileNav from "@/components/mobile-nav";

// Static placeholders shown while the session is being resolved, sized to
// roughly match the real content so there's no layout shift when it swaps
// in — one for the slim desktop chip, one for the full-width mobile pair.
function NavAuthFallback() {
  return (
    <span
      className="h-4 w-24 animate-pulse rounded bg-forest-800"
      aria-hidden="true"
    />
  );
}

function MobileAuthFallback() {
  return (
    <div className="h-11 w-full animate-pulse rounded-full bg-forest-800" aria-hidden="true" />
  );
}

// usePathname() inside <NavCampgroundsMenu> reads the current URL, which
// (like the session read in <NavAuthLinks>) is only known at request time —
// it needs its own Suspense boundary or Next treats the whole route as
// unprerenderable. Sized to roughly match the trigger button + chevron.
function NavCampgroundsMenuFallback() {
  return (
    <span
      className="h-4 w-28 animate-pulse rounded bg-forest-800"
      aria-hidden="true"
    />
  );
}

// Static shell: no request-time data is read here, so this (and therefore
// the pages that render it) can be prerendered. <NavCampgroundsMenu> reads
// the route and <NavAuthLinks>/<MobileAuthLinks> read the session — all
// three are isolated behind their own boundary so the navbar itself stays
// server-rendered.
export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-800/60 bg-forest-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="group flex items-center gap-2 font-serif text-lg font-bold text-cream-50"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-gold-400 text-forest-950 transition-transform duration-300 ease-out group-hover:-rotate-12 group-hover:scale-105">
            <Tent className="h-4 w-4" />
          </span>
          YelpCamp
        </Link>

        {/* Desktop: mega-menu + CTA + auth. Hidden below md — the navbar
            had no responsive collapse before, so this is the first real
            mobile nav for the app. */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Suspense fallback={<NavCampgroundsMenuFallback />}>
            <NavCampgroundsMenu />
          </Suspense>

          {/* Primary action gets its own pill treatment instead of a plain
              text link, so it reads as a call-to-action, not just another
              nav item. */}
          <Link
            href="/campgrounds/new"
            className="group inline-flex items-center gap-1.5 rounded-full bg-gold-300 px-3.5 py-1.5 text-forest-950 transition-all duration-200 ease-out hover:bg-gold-200 hover:shadow-md hover:shadow-gold-900/20 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
            New Campground
          </Link>

          <Suspense fallback={<NavAuthFallback />}>
            <NavAuthLinks />
          </Suspense>
        </div>

        {/* Mobile: a single hamburger opens the full sheet, which carries
            the mega-menu links, the CTA, and auth all together. The auth
            section is its own <Suspense> boundary (like <NavAuthLinks>
            above) so this per-request read doesn't force the whole navbar
            — and therefore the static homepage — to render dynamically. */}
        <div className="md:hidden">
          <MobileNav
            authSlot={
              <Suspense fallback={<MobileAuthFallback />}>
                <MobileAuthLinks />
              </Suspense>
            }
          />
        </div>
      </nav>
    </header>
  );
}