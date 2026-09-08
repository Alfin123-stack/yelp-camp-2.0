// src/components/ui/grid-card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

// A single tile inside a mega-menu grid — bordered, with a faint dot-grid
// texture that fades in on hover, plus a gold highlight. Generic (no link
// semantics of its own) so callers can wrap it in whatever navigates —
// <NavGridCard> in navigation-menu.tsx wraps it in a Next.js <Link>.
const GridCard = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative flex min-h-28 flex-col justify-center gap-2 overflow-hidden rounded-xl border border-forest-100 bg-cream-50/60 p-4 transition-colors hover:border-gold-400 hover:bg-gold-100/30",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-forest-200)_1px,transparent_1px)] bg-[size:14px_14px] opacity-0 transition-opacity duration-300 group-hover:opacity-40"
      />
      <div className="relative">{children}</div>
    </div>
  )
);
GridCard.displayName = "GridCard";

export { GridCard };
