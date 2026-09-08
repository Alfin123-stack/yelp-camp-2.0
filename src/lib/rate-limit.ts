import { headers } from "next/headers";

/**
 * Minimal in-memory fixed-window rate limiter for auth endpoints
 * (login/register), to slow down brute-force / credential-stuffing attempts.
 *
 * CAVEATS (acceptable for this app's scale, but worth knowing):
 * - State lives in a single Node process's memory. On serverless platforms
 *   (Vercel, etc.) or any multi-instance deployment, each instance has its
 *   own counters, so the *effective* limit is (limit × instance count) and
 *   restarting/redeploying resets everyone's counters.
 * - It is per-process, not distributed — for real production hardening,
 *   replace this with a shared store (Redis, Upstash, etc.) or an edge/WAF
 *   rate limiter in front of the app.
 * - Cached on `global` (same pattern as lib/db.ts) so Next.js dev's hot
 *   reload doesn't create a fresh Map on every file save.
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

declare global {
  var rateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = global.rateLimitStore ?? new Map<string, RateLimitEntry>();
if (!global.rateLimitStore) {
  global.rateLimitStore = store;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Best-effort client IP lookup from proxy headers. Trustworthy only if the
 * app sits behind a proxy/load balancer that sets these headers itself
 * (true on Vercel); if exposed directly to the internet, a client could
 * spoof x-forwarded-for to dodge the limit. Good enough as a first line of
 * defense, not a substitute for a real edge rate limiter.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") || "unknown";
}
