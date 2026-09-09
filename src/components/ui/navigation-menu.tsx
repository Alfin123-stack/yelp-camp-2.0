// navigation-menu.tsx
"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridCard } from "@/components/ui/grid-card";

// Extended from a single trigger+dropdown (the account menu in
// <UserMenu>) to also support a full mega-menu (NavGridCard / NavSmallItem
// / NavLargeItem / NavItemMobile) for <DesktopNavMenu> in navbar.tsx.
//
// <UserMenu> always renders with `viewport={false}`, and every style below
// that applies to that mode is gated behind `group-data-[viewport=false]`
// and kept byte-for-byte equal to what it was before this file grew a
// mega-menu — that account dropdown doesn't change at all.

export type NavItemType = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function NavigationMenu({
  className,
  children,
  viewport = true,
  align = "end",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
  /** Which side the mega-menu viewport hugs. Only matters when viewport=true. */
  align?: "start" | "end";
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn("group/navigation-menu relative flex items-center", className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport align={align} />}
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
   * Only affects the viewport=false (self-positioned) path — e.g.
   * <NavCampgroundsMenu>, <UserMenu>. Ignored when viewport=true, since
   * <NavigationMenuViewport> owns positioning there instead (see its own
   * `align` prop for that case).
   */
  align?: "start" | "end";
}) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        // Mega-menu mode (viewport=true): <NavigationMenuViewport> below
        // owns sizing/position via Radix's measured width/height vars —
        // Content here just needs to fill whatever space it's given.
        "w-full md:w-max",
        // Account-dropdown mode (viewport=false, e.g. <UserMenu>) — Content
        // positions and paints itself directly. Unchanged from before this
        // file grew mega-menu support, aside from left/right now being
        // driven by `align` instead of hardcoded to the right.
        "group-data-[viewport=false]/navigation-menu:absolute group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:w-max group-data-[viewport=false]/navigation-menu:scale-95 group-data-[viewport=false]/navigation-menu:opacity-0 group-data-[viewport=false]/navigation-menu:transition-all group-data-[viewport=false]/navigation-menu:duration-150 group-data-[viewport=false]/navigation-menu:ease-out group-data-[viewport=false]/navigation-menu:data-[state=open]:scale-100 group-data-[viewport=false]/navigation-menu:data-[state=open]:opacity-100",
        align === "start"
          ? "group-data-[viewport=false]/navigation-menu:left-0 group-data-[viewport=false]/navigation-menu:origin-top-left"
          : "group-data-[viewport=false]/navigation-menu:right-0 group-data-[viewport=false]/navigation-menu:origin-top-right",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  align = "end",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  align?: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "absolute top-full isolate z-50 flex",
        align === "start" ? "left-0 justify-start" : "right-0 justify-end"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-2xl shadow-forest-900/10 transition-[width,height] duration-200",
          className
        )}
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
// Used together in <DesktopNavMenu> (desktop-nav-menu.tsx) and
// <MobileNav> (mobile-nav.tsx) — see nav-links-data.ts for the content.

function NavGridCard({
  link,
  className,
  ...props
}: React.ComponentProps<"a"> & { link: NavItemType }) {
  return (
    // Wraps a real <a href> (not GridCard itself) so this always navigates
    // — GridCard is a plain div and can't carry an href on its own.
    <NavigationMenuPrimitive.Link asChild>
      <a href={link.href} {...props}>
        <GridCard className={className}>
          {link.icon && (
            <span className="flex size-9 items-center justify-center rounded-full bg-gold-100 text-forest-800">
              <link.icon className="h-4 w-4" />
            </span>
          )}
          <div>
            <span className="font-serif text-sm font-medium text-forest-950">{link.title}</span>
            {link.description && (
              <p className="mt-1 text-xs leading-relaxed text-forest-700/60">
                {link.description}
              </p>
            )}
          </div>
        </GridCard>
      </a>
    </NavigationMenuPrimitive.Link>
  );
}

function NavSmallItem({
  item,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & {
  item: Omit<NavItemType, "description">;
}) {
  return (
    <NavigationMenuLink
      className={cn(
        "group relative h-max flex-row items-center gap-2.5 rounded-lg px-2.5 py-2 text-forest-800 transition-colors hover:bg-cream-100 hover:text-forest-950",
        className
      )}
      {...props}
    >
      {item.icon && <item.icon className="h-4 w-4 shrink-0 text-forest-500" />}
      <p className="text-sm">{item.title}</p>
      <span className="ml-auto flex h-full w-4 items-center">
        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-gold-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </span>
    </NavigationMenuLink>
  );
}

function NavLargeItem({
  link,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & { link: NavItemType }) {
  return (
    <NavigationMenuLink
      className={cn(
        "group relative flex flex-col justify-center rounded-xl border border-forest-100 bg-cream-50 p-0 transition-colors hover:border-gold-300 hover:bg-white",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <span className="text-sm font-medium leading-none text-forest-950">{link.title}</span>
          {link.description && (
            <p className="mt-1 line-clamp-1 text-xs text-forest-700/60">{link.description}</p>
          )}
        </div>
        {link.icon && <link.icon className="h-5 w-5 shrink-0 text-forest-500" />}
      </div>
    </NavigationMenuLink>
  );
}

function NavItemMobile({
  item,
  className,
  ...props
}: React.ComponentProps<"a"> & { item: NavItemType }) {
  return (
    <a
      className={cn(
        "group relative flex gap-3 rounded-lg p-2 transition-colors hover:bg-forest-900",
        className
      )}
      {...props}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-forest-800/60 bg-forest-900/60">
        {item.icon && <item.icon className="h-4 w-4 text-gold-300" />}
      </div>
      <div className="flex h-10 flex-col justify-center">
        <p className="text-sm font-medium text-cream-50">{item.title}</p>
        {item.description && (
          <span className="line-clamp-1 text-xs leading-snug text-cream-100/60">
            {item.description}
          </span>
        )}
      </div>
    </a>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
};