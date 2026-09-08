"use client";

import { usePathname } from "next/navigation";
import {
  MapPinned,
  Compass,
  Wallet,
  Sparkles,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Plus,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavGridCard,
  NavSmallItem,
  type NavItemType,
} from "@/components/ui/navigation-menu";

// Every href below maps to filters campgrounds/page.tsx already reads
// (`price`, `sort`) — nothing here promises a filter that doesn't exist.
const browseLinks: NavItemType[] = [
  {
    title: "All campgrounds",
    href: "/campgrounds",
    description: "Every listing, pinned on the map",
    icon: Compass,
  },
  {
    title: "Under $50/night",
    href: "/campgrounds?price=budget",
    description: "Budget-friendly sites",
    icon: Wallet,
  },
  {
    title: "$50–150/night",
    href: "/campgrounds?price=mid",
    description: "The most popular range",
    icon: MapPinned,
  },
  {
    title: "$150+/night",
    href: "/campgrounds?price=premium",
    description: "Cabins, glamping, and more",
    icon: Sparkles,
  },
];

const quickLinks: NavItemType[] = [
  { title: "Price: low to high", href: "/campgrounds?sort=price-asc", icon: ArrowUpWideNarrow },
  { title: "Price: high to low", href: "/campgrounds?sort=price-desc", icon: ArrowDownWideNarrow },
  { title: "List your site", href: "/campgrounds/new", icon: Plus },
];

// Split out as its own client component (same pattern as <NavLink> and
// <UserMenu>) so <Navbar> itself stays a static server component — only
// this piece needs the current route (to know when "Campgrounds" counts as
// active) and interactive open/close state.
export default function NavCampgroundsMenu() {
  const pathname = usePathname();
  const isActive = pathname?.startsWith("/campgrounds");

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "group gap-1.5 rounded-full bg-transparent px-0 py-1 transition-colors hover:bg-transparent",
              isActive
                ? "text-gold-300"
                : "text-cream-100/70 hover:text-gold-300 data-[state=open]:text-gold-300"
            )}
          >
            <MapPinned className="h-3.5 w-3.5" />
            Campgrounds
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenuTrigger>

          <NavigationMenuContent align="start">
            <div className="flex w-[560px] overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-xl shadow-forest-900/10">
              <ul className="grid flex-1 grid-cols-2 gap-3 border-r border-forest-100 p-4">
                {browseLinks.map((link) => (
                  <li key={link.href}>
                    <NavGridCard link={link} />
                  </li>
                ))}
              </ul>
              <ul className="w-52 space-y-1 p-4">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <NavSmallItem item={link} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
