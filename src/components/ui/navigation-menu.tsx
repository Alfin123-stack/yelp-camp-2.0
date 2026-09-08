"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridCard } from "@/components/ui/grid-card";

// Extended from the original trimmed-down version: <UserMenu> only ever
// needed a single right-aligned trigger+dropdown (the viewport=false path
// below, unchanged), so NavGridCard/NavSmallItem/NavLargeItem/NavItemMobile
// were dropped at the time. They're back now for the "Campgrounds"
// mega-menu in <NavCampgroundsMenu> — added as new exports rather than
// touching the pieces <UserMenu> already relies on.

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn("group/navigation-menu relative flex items-center", className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "inline-flex w-max items-center justify-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium outline-none transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  align = "end",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & {
  /**
   * Which edge of the trigger the dropdown hangs from.
   * "end" (default) preserves the original right-aligned behaviour that
   * <UserMenu> — the last item in the navbar — already relies on.
   * "start" is for triggers nearer the left, like the Campgrounds mega-menu.
   */
  align?: "start" | "end";
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Plain Tailwind transition driven by data-state, instead of the
        // tw-animate-css `animate-in`/`zoom-in-95` utilities the original
        // reference used — avoids adding a new plugin dependency for one
        // small dropdown.
        "absolute top-full mt-2 scale-95 opacity-0 transition-all duration-150 ease-out data-[state=open]:scale-100 data-[state=open]:opacity-100",
        align === "start" ? "left-0 origin-top-left" : "right-0 origin-top-right",
        "group-data-[viewport=false]/navigation-menu:w-max",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute right-0 top-full isolate z-50 flex justify-end">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn("relative mt-2 h-[var(--radix-navigation-menu-viewport-height)]", className)}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn("flex flex-col justify-center gap-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

// ── Mega-menu building blocks ──────────────────────────────────────────
// These render real Next.js <Link>s (via NavigationMenuPrimitive.Link
// asChild) rather than plain <a> tags, matching how every other internal
// link in this app navigates — see the "why next/link here" note in
// auth-section-1.tsx, which already imports it into a ui/ primitive for
// the same reason.

export type NavItemType = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function NavGridCard({
  link,
  className,
}: {
  link: NavItemType;
  className?: string;
}) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link href={link.href} className="block">
        <GridCard className={className}>
          {link.icon && <link.icon className="relative h-5 w-5 text-forest-700" />}
          <div className="relative">
            <span className="text-sm font-medium text-forest-950">{link.title}</span>
            {link.description && (
              <p className="mt-1 text-xs leading-snug text-forest-700/60">{link.description}</p>
            )}
          </div>
        </GridCard>
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

function NavSmallItem({
  item,
  className,
}: {
  item: Omit<NavItemType, "description">;
  className?: string;
}) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link
        href={item.href}
        className={cn(
          "group relative flex h-max items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm text-forest-800 transition-colors hover:bg-gold-100/40 hover:text-forest-950",
          className
        )}
      >
        {item.icon && <item.icon className="h-4 w-4 shrink-0 text-forest-500" />}
        <span className="truncate">{item.title}</span>
        <span className="relative ml-auto flex h-full w-4 items-center">
          <ArrowRight className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

function NavLargeItem({
  link,
  className,
}: {
  link: NavItemType;
  className?: string;
}) {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link
        href={link.href}
        className={cn(
          "group relative flex flex-col justify-center overflow-hidden rounded-xl border border-forest-100 bg-white p-4 transition-colors hover:border-gold-400 hover:bg-gold-100/20",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-sm font-medium leading-none text-forest-950">{link.title}</span>
            {link.description && (
              <p className="line-clamp-1 text-xs text-forest-700/60">{link.description}</p>
            )}
          </div>
          {link.icon && <link.icon className="h-5 w-5 shrink-0 text-forest-500" />}
        </div>
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

// Not wrapped in NavigationMenuPrimitive.Link — this is used inside the
// mobile <Sheet>'s <Accordion>, entirely outside the Radix NavigationMenu
// tree, so it's just a themed Next.js <Link>.
function NavItemMobile({
  item,
  className,
}: {
  item: NavItemType;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/5",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-cream-100/15 bg-white/5">
        {item.icon && <item.icon className="h-4 w-4 text-gold-300" />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-cream-50">{item.title}</span>
        {item.description && (
          <span className="truncate text-xs text-cream-100/50">{item.description}</span>
        )}
      </span>
    </Link>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
};
