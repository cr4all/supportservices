import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please set MONGODB_URI in .env for the web chat feature (MongoDB)."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};

if (globalThis.mongoose === undefined) {
  globalThis.mongoose = cached;
}

/**
 * Connect to MongoDB. Reuses the same connection in development (Next.js hot reload).
 */
export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = MONGODB_URI;
    if (!uri) throw new Error("Please set MONGODB_URI in .env for the web chat feature (MongoDB).");
    cached.promise = mongoose.connect(uri);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
