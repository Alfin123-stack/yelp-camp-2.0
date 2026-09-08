import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NextAuth's own signIn()/redirectTo already guards against redirecting to
// an external origin, but returnTo is attacker-controlled (it's a query
// param anyone can craft into a shared login link) and gets used again in
// login-form.tsx before it ever reaches NextAuth, so it's validated here
// too as defense in depth. Only a same-app relative path is allowed:
// - must start with a single "/"
// - reject "//host" or "/\host" (browsers treat these as protocol-relative
//   URLs to a different origin, not as a path)
export function isSafeRelativePath(value: string): boolean {
  return /^\/(?!\/|\\)/.test(value);
}

// Zod's `noHtml()` rule (see lib/validations/schemas.ts) is the only thing
// currently stopping a campground's title/location/description from
// containing markup, and it guards a database write path, not every place
// that later renders that string as HTML. The MapTiler popups build their
// content as raw HTML strings (`.setHTML()`), so anything read back out of
// the DB must be escaped again right before interpolation — defense in
// depth in case validation is ever relaxed or bypassed (e.g. a future
// import/API path that skips the Zod schema).
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
