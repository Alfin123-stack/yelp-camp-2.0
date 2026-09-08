# YelpCamp

A campground listing and review app — browse, add, and review campgrounds on an
interactive map. Built with the Next.js App Router, MongoDB, Cloudinary for
image storage, and MapTiler for geocoding and maps.

This is a Next.js rewrite of the classic Express/EJS "YelpCamp" project from
Colt Steele's Web Dev Bootcamp, rebuilt with Server Components, Server
Actions, and Next.js 16 Cache Components.

## Features

- **Browse campgrounds** on a clustered map (MapTiler + MapLibre GL) or a
  paginated, filterable grid
- **Search & sort** by location and price
- **Add / edit campgrounds** with a click-to-pick location map, reverse
  geocoding, and drag-and-drop multi-image upload
- **Image hosting** via Cloudinary, with per-image delete support when editing
- **Reviews** on campground listings
- **Auth** — sign in to create, edit, and delete your own listings
- Themed end-to-end with a custom forest/gold/cream design system (Tailwind v4)

## Tech stack

| Layer      | Choice                                                |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router, Cache Components, Server Actions) |
| Database   | MongoDB via Mongoose                                    |
| Auth       | Auth.js (NextAuth)                                      |
| Images     | Cloudinary                                              |
| Maps       | MapTiler SDK + MapLibre GL JS (geocoding, clustering)   |
| Styling    | Tailwind CSS v4                                         |
| Validation | Zod                                                     |
| Language   | TypeScript                                              |

## Prerequisites

- Node.js 20+
- A MongoDB connection string (local or [Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account (free tier is fine)
- A [MapTiler](https://www.maptiler.com/) API key (free tier is fine)

## Getting started

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd yelpcamp
   npm install
   ```

2. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/yelpcamp

   # Auth.js
   AUTH_SECRET=replace-with-a-random-string
   # ...plus whatever provider-specific variables your auth.ts config needs
   # (e.g. AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET, or credentials-provider config)

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret

   # MapTiler (public — used client-side for the map + geocoding widget)
   NEXT_PUBLIC_MAPTILER_API_KEY=your-maptiler-key
   ```

   > Adjust the Auth.js block above to match whichever provider(s) are
   > actually configured in `auth.ts` — the exact variable names depend on
   > that setup.

3. **Seed the database (optional)**

   ```bash
   npx tsx scripts/seed.ts
   ```

   This populates the database with sample campgrounds using placeholder
   images from `picsum.photos`, so you don't need Cloudinary credentials
   just to see listings.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── campgrounds/          # list, detail, add, edit routes
│   └── ...
├── components/
│   ├── campground-card.tsx
│   ├── campground-form.tsx   # shared add/edit form (location picker, image upload)
│   ├── cluster-map.tsx       # clustered map for the campground list
│   ├── show-map.tsx          # single-pin map for a campground's detail page
│   └── ...
├── lib/
│   ├── actions/campgrounds.ts # Server Actions: CRUD + queries
│   ├── cloudinary.ts          # image upload/delete
│   ├── db.ts                  # Mongoose connection
│   ├── maptiler.ts            # geocoding helper
│   ├── models/                # Mongoose schemas
│   └── validations/           # Zod schemas
└── types/
scripts/
└── seed.ts                    # sample data loader
```

## Notes on a few implementation details

- **Cache Components** (`cacheComponents: true` in `next.config.ts`) — routes
  that read per-request data (auth session, DB queries) rely on a
  `loading.tsx` Suspense boundary rather than `export const dynamic =
  "force-dynamic"`. If you add a new route that reads the DB or calls
  `auth()`, give it a `loading.tsx`.
- **Server Action body size** — image uploads go through a Server Action, and
  Next.js caps that at 1MB by default. This project raises it via
  `experimental.serverActions.bodySizeLimit` in `next.config.ts` to
  accommodate multi-image uploads.
- **`getCampgroundLocations()` vs `getCampgrounds()`** — the campground list
  page fetches two different shapes of data: a paginated grid via
  `getCampgrounds()`, and *every* campground's coordinates via
  `getCampgroundLocations()` so the map's pins don't disappear when you
  change pages.

## Scripts

| Command           | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`       | Start the dev server              |
| `npm run build`     | Production build                  |
| `npm run start`     | Run the production build          |
| `npm run lint`      | Lint the project                  |
| `npx tsx scripts/seed.ts` | Seed the database with sample campgrounds |

## License

MIT — replace with your project's actual license.