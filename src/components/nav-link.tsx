"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Split out as its own client component (same pattern as <NavAuthLinks>)
// so <Navbar> itself stays a static server component — only this small
// piece needs the current route to know which link is "active".
export default function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={`group relative py-1 transition-colors focus-visible:outline-none focus-visible:text-gold-300 ${
        isActive ? "text-gold-300" : "text-cream-100/70 hover:text-gold-300"
      }`}
    >
      {children}
      {/* Underline that grows from the center on hover, stays full-width
          when the link is the active route. */}
      <span
        className={`pointer-events-none absolute -bottom-1 left-1/2 h-px -translate-x-1/2 bg-gold-300 transition-all duration-300 ease-out ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}