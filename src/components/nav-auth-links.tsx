import Link from "next/link";
import { auth, signOut } from "@/auth";
import UserMenu from "@/components/user-menu";

// Reads the session. This is the only part of the Navbar that depends on
// per-request data, so it's kept in its own component and rendered inside a
// <Suspense> boundary in navbar.tsx — that's what lets the rest of the page
// (and the whole static homepage) be prerendered instead of forcing every
// route to render dynamically.
export default async function NavAuthLinks() {
  const session = await auth();

  if (session?.user) {
    const username = session.user.name ?? session.user.email ?? "Account";

    async function logout() {
      "use server";
      await signOut({ redirectTo: "/campgrounds" });
    }

    return <UserMenu username={username} onLogout={logout} />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-cream-100/70 transition-colors hover:text-gold-300"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full border border-gold-300/60 px-3.5 py-1.5 text-gold-300 transition-colors hover:bg-gold-300 hover:text-forest-950"
      >
        Register
      </Link>
    </div>
  );
}