"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// Sits directly beside <NavCampgroundsMenu> with the same active-state
// treatment, but is a plain link rather than a dropdown trigger — /saved is
// a single page with nothing to expand into a menu.
export default function NavSavedLink() {
  const pathname = usePathname();
  const isActive = pathname?.startsWith("/saved");

  return (
    <Link
      href="/saved"
      className={cn(
        "flex items-center gap-1.5 transition-colors",
        isActive ? "text-gold-300" : "text-cream-100/70 hover:text-gold-300"
      )}
    >
      <Heart className="h-3.5 w-3.5" />
      Tersimpan
    </Link>
  );
}
