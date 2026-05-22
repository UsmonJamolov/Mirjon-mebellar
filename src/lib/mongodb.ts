import mongoose from "mongoose";

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI .env.local faylida belgilang");
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/** MongoDB ulanish (admin panel) */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const dbName = process.env.MONGODB_DB_NAME || "mebellar";
    cached.promise = mongoose.connect(getUri(), { dbName });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function getDbName(): string {
  return process.env.MONGODB_DB_NAME || "mebellar";
}
