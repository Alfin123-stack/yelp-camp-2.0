import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/campsite-showcase";
import FeaturedCampgrounds from "@/components/landing/featured-campgrounds";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import CtaBanner from "@/components/landing/cta-banner";

// Fully static page: every section below uses illustrative/demo content, so
// nothing here depends on request-time data and Next.js can still prerender
// the whole route at build time (SSG) — same as before the redesign.
//
// If <FeaturedCampgrounds> is later switched to real listings via
// `getCampgrounds()` (src/lib/actions/campgrounds.ts), isolate that fetch in
// its own async server component and wrap *that* in <Suspense> — the same
// Cache Components pattern already used for <NavAuthLinks> in navbar.tsx and
// the footer's cached copyright year — so this page keeps its static shell
// instead of becoming fully dynamic.
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <FeaturedCampgrounds />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}