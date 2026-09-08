import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require an authenticated session, mirroring the Express
// `isLoggedIn` middleware applied on /campgrounds/new, /:id/edit and POST/PUT.
const protectedPatterns = [/^\/campgrounds\/new$/, /^\/campgrounds\/[^/]+\/edit$/];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPatterns.some((pattern) => pattern.test(pathname));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/campgrounds/new", "/campgrounds/:id/edit"],
};
