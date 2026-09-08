import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 Cache Components (formerly `experimental.ppr`): lets a route
  // ship a static shell immediately and stream in the parts that read
  // per-request data (auth session, DB reads) via <Suspense>. This is what
  // restores static generation for "/", which was fully dynamic before only
  // because the Navbar called auth() with no Suspense boundary around it.
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Placeholder photos used by scripts/seed.ts (no API key required,
      // unlike the old seed script's hardcoded Pexels key).
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB. The campground form submits every selected image
      // in one <form action={...}> Server Action call, so anything past a
      // single small photo (or more than one image at once) blew past the
      // default and threw "Body exceeded 1 MB limit". Client-side
      // MAX_IMAGE_MB in campground-form.tsx caps each file at 5MB; 25mb
      // covers several images per submission with headroom for
      // multipart/form-data overhead — raise further if you allow more
      // images per listing or larger photos.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;