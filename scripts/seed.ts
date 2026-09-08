import { config } from "dotenv";
config({ path: ".env.local" });   // <- kelihatannya jalan duluan...
config();

import connectDB from "../src/lib/db";  // <- ...tapi ini juga

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Campground from "../src/lib/models/campground";
import Review from "../src/lib/models/review";
import User from "../src/lib/models/user";

const SEED_USERNAME = process.env.SEED_USERNAME || "yelpcamp-seed";
const SEED_EMAIL = process.env.SEED_EMAIL || "seed@yelpcamp.local";
const SEED_PASSWORD = process.env.SEED_PASSWORD || "seed-password-123";

const DEFAULT_COUNT = 25;

const descriptors = [
  "Forest",
  "Ancient",
  "Petrified",
  "Roaring",
  "Cascade",
  "Quiet",
  "Misty",
  "Cozy",
  "Windswept",
  "Sunken",
  "Whispering",
  "Silver",
  "Hidden",
  "Rolling",
  "Frosty",
  "Sunny",
  "Shady",
  "Golden",
];

const places = [
  "Creek",
  "Valley",
  "Meadow",
  "Bluff",
  "Hollow",
  "Ridge",
  "Cove",
  "Falls",
  "Trail",
  "Pines",
  "Glade",
  "Springs",
  "Point",
  "Basin",
  "Woods",
  "Summit",
];

const sampleDescriptions = [
  "A quiet, tree-shaded spot a short walk from the water, with fire rings at every site and a small camp store up the road.",
  "Sits right at the edge of the tree line with wide-open views — bring a warm sleeping bag, it cools off fast after sunset.",
  "Popular with hikers heading into the backcountry; sites fill up on weekends, so arrive early or book ahead.",
  "A family-friendly campground with flat, grassy sites, clean restrooms, and a playground near the entrance.",
  "Remote and quiet, with no cell signal and pit toilets only — pack in what you need and pack out your trash.",
  "Set along a slow-moving creek, great for kids to wade in during the day and listen to at night.",
];

interface City {
  city: string;
  admin: string;
  lat: number;
  lng: number;
}

// A modest set of real, well-known outdoorsy towns with approximate
// coordinates (not the full ~30k-city dataset the original app's
// seeds/cities.json used, but enough variety for local testing).
const cities: City[] = [
  { city: "Asheville", admin: "NC", lat: 35.5951, lng: -82.5515 },
  { city: "Bend", admin: "OR", lat: 44.0582, lng: -121.3153 },
  { city: "Moab", admin: "UT", lat: 38.5733, lng: -109.5498 },
  { city: "Jackson", admin: "WY", lat: 43.4799, lng: -110.7624 },
  { city: "Sedona", admin: "AZ", lat: 34.8697, lng: -111.761 },
  { city: "Bar Harbor", admin: "ME", lat: 44.3876, lng: -68.2039 },
  { city: "Estes Park", admin: "CO", lat: 40.3772, lng: -105.5217 },
  { city: "Lake Placid", admin: "NY", lat: 44.2795, lng: -73.9799 },
  { city: "Big Sur", admin: "CA", lat: 36.2704, lng: -121.8081 },
  { city: "Traverse City", admin: "MI", lat: 44.7631, lng: -85.6206 },
  { city: "Ashland", admin: "OR", lat: 42.1946, lng: -122.7095 },
  { city: "Taos", admin: "NM", lat: 36.4072, lng: -105.5731 },
  { city: "Girdwood", admin: "AK", lat: 60.9522, lng: -149.1642 },
  { city: "Hana", admin: "HI", lat: 20.7644, lng: -155.9903 },
  { city: "Ely", admin: "MN", lat: 47.9032, lng: -91.8671 },
  { city: "Bozeman", admin: "MT", lat: 45.677, lng: -111.0429 },
  { city: "Chattanooga", admin: "TN", lat: 35.0456, lng: -85.3097 },
  { city: "Ketchum", admin: "ID", lat: 43.6805, lng: -114.3637 },
  { city: "Stowe", admin: "VT", lat: 44.4654, lng: -72.6874 },
  { city: "Ouray", admin: "CO", lat: 38.0231, lng: -107.6714 },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Spreads generated campgrounds out around a city's coordinates instead of
// stacking them all on the exact same point on the map.
function jitter(value: number, amount: number): number {
  return value + (Math.random() - 0.5) * amount;
}

async function ensureSeedUser() {
  const existing = await User.findOne({ username: SEED_USERNAME });
  if (existing) return existing;

  const hashed = await bcrypt.hash(SEED_PASSWORD, 12);
  const user = await User.create({
    username: SEED_USERNAME,
    email: SEED_EMAIL,
    password: hashed,
  });
  console.log(
    `Created seed user "${SEED_USERNAME}" / "${SEED_PASSWORD}" — log in and change the password if this isn't just a throwaway dev DB.`
  );
  return user;
}

async function seed(count: number, reset: boolean) {
  await connectDB();

  if (reset) {
    await Review.deleteMany({});
    await Campground.deleteMany({});
    console.log("Cleared existing campgrounds and reviews.");
  }

  const author = await ensureSeedUser();

  const docs = Array.from({ length: count }, (_, i) => {
    const place = randomFrom(cities);
    const title = `${randomFrom(descriptors)} ${randomFrom(places)}`;
    const seedTag = `${place.city.replace(/\s+/g, "-").toLowerCase()}-${i}-${Date.now()}`;

    return {
      title,
      location: `${place.city}, ${place.admin}`,
      price: randomInt(10, 200),
      description: randomFrom(sampleDescriptions),
      geometry: {
        type: "Point" as const,
        // GeoJSON order is [lng, lat], matching what maptiler.ts returns.
        coordinates: [jitter(place.lng, 0.4), jitter(place.lat, 0.4)] as [
          number,
          number,
        ],
      },
      images: [
        {
          url: `https://picsum.photos/seed/${seedTag}/800/600`,
          filename: `seed/${seedTag}`,
        },
      ],
      author: author._id,
      reviews: [],
    };
  });

  await Campground.insertMany(docs);
  console.log(`Inserted ${docs.length} campgrounds.`);
}

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes("--reset");
  const countArg = args.find((a) => a.startsWith("--count="));
  const count = countArg ? Number(countArg.split("=")[1]) : DEFAULT_COUNT;

  if (!Number.isFinite(count) || count <= 0) {
    throw new Error(`Invalid --count value: ${countArg}`);
  }

  await seed(count, reset);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
