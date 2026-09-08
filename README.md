# 🏕️ YelpCamp — Next.js Edition

Full rewrite of the original Express + EJS YelpCamp app to **Next.js 16 (App Router)**,
TypeScript, Tailwind, and Server Actions.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + hand-written shadcn-style primitives |
| Database | MongoDB via Mongoose (connection singleton) |
| Auth | NextAuth v5 (Credentials provider, bcrypt, JWT sessions) |
| Image upload | Cloudinary, uploaded directly from Server Actions |
| Maps / geocoding | `@maptiler/sdk` (client map) + `@maptiler/client` (server geocoding) |
| Validation | Zod + `sanitize-html` (anti-XSS, same behaviour as the old Joi rules) |
| Notifications | `sonner` toasts (replaces `connect-flash`) |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run dev
```

### Environment variables (`.env.local`)

```
DB_URL=                        # MongoDB connection string
AUTH_SECRET=                   # generate with: npx auth secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
MAPTILER_API_KEY=              # server-side geocoding
NEXT_PUBLIC_MAPTILER_API_KEY=  # same key, exposed to the browser for map rendering
SITE_URL=http://localhost:3000 # used for metadata / sitemap.xml / robots.txt
```

> ⚠️ **Security note**: the original project's `.env` (uploaded earlier in this
> conversation) contained live MongoDB Atlas, Cloudinary, and MapTiler credentials.
> Those were **not** copied into this project. Rotate them before using this app
> in production, then paste the fresh values into `.env.local`.

## What changed vs. the original Express app

- **Auth**: Passport-local-mongoose (PBKDF2 hashes) → NextAuth Credentials + bcrypt.
  **Existing users need to register again** — the password hash formats aren't
  compatible, per your earlier decision.
- **Views**: EJS templates → React Server/Client Components.
- **Flash messages**: `connect-flash` (session-based) → `sonner` toasts driven by
  `?success=`/`?error=` query params, cleared client-side after showing.
- **Validation**: Joi + `sanitize-html` → Zod + the same `sanitize-html` anti-XSS check.
- **Delete authorization**: the original Express route for deleting a campground only
  checked `isLoggedIn` (any logged-in user could delete *any* campground — likely an
  oversight). This rewrite adds an author check, matching the edit/update route.
- **Routing convention**: Next.js 16 renamed `middleware.ts` → `src/proxy.ts`; this
  project already uses the new convention.

## Rendering strategy

This project uses Next.js 16 **Cache Components** (`cacheComponents: true` in
`next.config.ts`, the successor to the old `experimental.ppr` flag). Instead
of each route being either fully static or fully dynamic, per-request reads
(the session in `<Navbar>`, DB queries) are isolated in their own components
and wrapped in `<Suspense>`, so Next.js can prerender a static HTML shell for
everything else and stream the dynamic parts in on the same request.

| Route | Rendering |
|---|---|
| `/` | Partial Prerender (`◐`) — static shell, only the Navbar's Login/Logout links stream in |
| `/campgrounds` | Partial Prerender — DB read streamed behind `loading.tsx`, revalidated on-demand after writes |
| `/campgrounds/[id]` | Partial Prerender, `generateMetadata` per campground (OG image, description) + JSON-LD |
| `/campgrounds/new`, `/campgrounds/[id]/edit` | Partial Prerender, auth-gated via `src/proxy.ts` |
| `/login`, `/register` | Server-rendered shell + Server Action form submit |
| `/sitemap.xml` | Fully dynamic (`ƒ`), regenerated per request — no DB access needed at build/deploy time |
| `/robots.txt` | Fully static (`○`) |

Verify with `npm run build`: the route table it prints marks each route `○`
(static), `◐` (partial prerender), or `ƒ` (dynamic).

**How the Navbar fix works**: `<Navbar>` used to call `auth()` directly,
which made *every* page — including the home page — dynamically rendered.
It's now split into a static shell (`src/components/navbar.tsx`) and a
`<NavAuthLinks>` server component (`src/components/nav-auth-links.tsx`) that
reads the session, wrapped in `<Suspense fallback={<NavAuthFallback />}>`.
Same pattern for the copyright year in `<Footer>`, which used
`new Date().getFullYear()` (a fresh, non-deterministic value on every
render) — it's now behind a `"use cache"` function with a one-day
`cacheLife`, so it doesn't force the whole page dynamic either.

## Project structure

```
src/
  app/                # routes (App Router)
  components/          # shared React components
    ui/                 # button, input, card, etc. (shadcn-style primitives)
  lib/
    actions/            # Server Actions (campgrounds, reviews, auth, login)
    models/             # Mongoose schemas (TypeScript)
    validations/         # Zod schemas
    db.ts, cloudinary.ts, maptiler.ts, utils.ts
  auth.ts               # NextAuth config
  proxy.ts              # route protection (formerly middleware.ts)
  types/                # shared TypeScript types
```

## Seeding sample data

```bash
npm run seed                # add 25 sample campgrounds, keep existing data
npm run seed -- --reset     # wipe campgrounds + reviews first, then reseed
npm run seed -- --count=50  # control how many to create
```

Creates (or reuses) a `yelpcamp-seed` user as the author of every seeded
campground, and uses [picsum.photos](https://picsum.photos) for placeholder
images since it needs no API key — unlike the old Express seed script, which
hardcoded a live Pexels key (deliberately not ported here). See
`scripts/seed.ts` for details, including the one caveat: deleting a seeded
image from the UI no-ops against Cloudinary instead of actually removing
anything, since the placeholder was never uploaded there.

## Not yet done / suggested next steps

- Automated tests.
- The seed script's city list is a small, hand-picked set (not the full
  ~30k-city dataset the original Express app's `seeds/cities.json` had) —
  extend `cities` in `scripts/seed.ts` if you want more geographic variety.
# yelp-camp-2.0
# yelp-camp-2.0
