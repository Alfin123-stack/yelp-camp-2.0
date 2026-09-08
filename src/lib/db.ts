import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development, and across serverless function invocations in production.
 * This prevents connections growing exponentially during API usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Read DB_URL lazily, inside the function, instead of at module top-level.
  // In ESM, `import` statements are hoisted and run before any other
  // top-level code in the importing file — so if this were read as a
  // module-level const, it could get evaluated (and fall back to
  // localhost) before scripts like seed.ts finish loading .env via
  // dotenv's config(). Reading it here, at call time, avoids that race.
  const MONGODB_URI = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

  if (!MONGODB_URI) {
    throw new Error("Please define the DB_URL environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;