// desktop-nav-menu.tsx
"use client";

import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavGridCard,
  NavSmallItem,
} from "@/components/ui/navigation-menu";
import { campgroundLinks, infoLinks } from "@/components/nav-links-data";

const triggerClass =
  "group rounded-full px-3 py-1.5 text-sm font-medium text-cream-100/80 transition-colors hover:text-gold-300 data-[state=open]:text-gold-300";

function TriggerLabel({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChevronDown className="h-3.5 w-3.5 text-cream-100/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </>
  );
}

// Hidden below `lg` — <MobileNav> (mobile-nav.tsx) covers that breakpoint
// with the same nav-links-data.ts content in a sheet instead.
export default function DesktopNavMenu() {
  return (
    <NavigationMenu align="start" className="hidden lg:flex">
      <NavigationMenuList className="gap-0.5">
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClass}>
            <TriggerLabel>Campgrounds</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(90vw,640px)] grid-cols-[1.3fr_1fr]">
              <ul className="grid grid-cols-3 gap-3 border-r border-forest-100 p-5">
                {campgroundLinks.slice(0, 3).map((link) => (
                  <li key={link.title}>
                    <NavGridCard link={link} />
                  </li>
                ))}
              </ul>
              <ul className="space-y-0.5 p-3">
                {campgroundLinks.slice(3).map((link) => (
                  <li key={link.title}>
                    <NavSmallItem item={link} href={link.href} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClass}>
            <TriggerLabel>About</TriggerLabel>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[min(90vw,560px)] grid-cols-[1fr_1fr]">
              <ul className="grid grid-cols-2 gap-3 border-r border-forest-100 p-5">
                {infoLinks.slice(0, 2).map((link) => (
                  <li key={link.title}>
                    <NavGridCard link={link} className="min-h-32" />
                  </li>
                ))}
              </ul>
              <ul className="space-y-0.5 p-3">
                {infoLinks.slice(2).map((link) => (
                  <li key={link.title}>
                    <NavSmallItem item={link} href={link.href} />
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
