import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";

// Same session read as <NavAuthLinks> (nav-auth-links.tsx), but laid out
// for the mobile <Sheet> — full-width touch targets instead of a slim
// navbar chip. Kept in its own component so it can sit behind its own
// <Suspense> boundary in navbar.tsx, same reasoning as <NavAuthLinks>:
// this is the only per-request read in the mobile nav, so isolating it
// keeps the rest of the static shell prerenderable.
export default async function MobileAuthLinks() {
  const session = await auth();

  if (session?.user) {
    const username = session.user.name ?? session.user.email ?? "Account";

    async function logout() {
      "use server";
      await signOut({ redirectTo: "/campgrounds" });
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-cream-100/15 bg-white/5 px-3 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-400 text-forest-950">
            <User className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-medium text-cream-50">{username}</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cream-100/70 transition-colors hover:bg-white/5 hover:text-cream-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="flex-1 rounded-full border border-cream-100/20 py-2.5 text-center text-sm font-medium text-cream-50 transition-colors hover:border-gold-300 hover:text-gold-300"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="flex-1 rounded-full bg-gold-300 py-2.5 text-center text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-200"
      >
        Register
      </Link>
    </div>
  );
}
