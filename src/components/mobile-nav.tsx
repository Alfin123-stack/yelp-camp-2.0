"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Menu, Tent, Plus, Compass, Wallet, MapPinned, Sparkles } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { NavItemMobile, type NavItemType } from "@/components/ui/navigation-menu";

// Same set as <NavCampgroundsMenu>'s desktop mega-menu, kept in sync
// manually since the two live in different components for different
// breakpoints.
const browseLinks: NavItemType[] = [
  { title: "All campgrounds", href: "/campgrounds", description: "Every listing, pinned on the map", icon: Compass },
  { title: "Under $50/night", href: "/campgrounds?price=budget", description: "Budget-friendly sites", icon: Wallet },
  { title: "$50–150/night", href: "/campgrounds?price=mid", description: "The most popular range", icon: MapPinned },
  { title: "$150+/night", href: "/campgrounds?price=premium", description: "Cabins, glamping, and more", icon: Sparkles },
];

// Split out as its own client component (same pattern as <NavLink> and
// <UserMenu>) so <Navbar> itself stays a static server component. The
// `authSlot` it renders is passed down from the server already wrapped in
// its own <Suspense> boundary there — see navbar.tsx.
export default function MobileNav({ authSlot }: { authSlot: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-full text-cream-100/80 transition-colors hover:bg-white/5 hover:text-gold-300"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        title="Site navigation"
        className="w-4/5 border-forest-800 bg-forest-950 text-cream-50 sm:max-w-xs"
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 py-6">
          <div className="flex items-center gap-2 pr-8">
            <span className="flex size-8 items-center justify-center rounded-full bg-gold-400 text-forest-950">
              <Tent className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg font-bold text-cream-50">YelpCamp</span>
          </div>

          <SheetClose asChild>
            <Link
              href="/campgrounds/new"
              className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-gold-300 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-200"
            >
              <Plus className="h-4 w-4" />
              New Campground
            </Link>
          </SheetClose>

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="explore" className="border-forest-800">
              <AccordionTrigger className="text-cream-50 hover:text-gold-300">
                Campgrounds
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 pb-3">
                  {browseLinks.map((link) => (
                    <li key={link.href}>
                      <SheetClose asChild>
                        <NavItemMobile item={link} />
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-auto pt-8">{authSlot}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
