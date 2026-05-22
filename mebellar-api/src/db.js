import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/m-mebellar";
  const dbName = process.env.MONGODB_DB_NAME || "m-mebellar";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName });
  console.log(`MongoDB: ${dbName}`);
}

export function dbState() {
  const s = mongoose.connection.readyState;
  const labels = ["disconnected", "connected", "connecting", "disconnecting"];
  return { ok: s === 1, state: labels[s] ?? "unknown", db: mongoose.connection.name };
}
