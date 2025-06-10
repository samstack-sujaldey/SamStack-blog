import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment");
}

// 👇 Global declaration with correct types
/* eslint-disable no-var */
declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}
/* eslint-enable no-var */

// Reuse connection
const cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export const connect = async () => {
  if (cached.conn) {
    console.log("✅ Already connected to MongoDB");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "SamStack-Ed-Blog",
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  return cached.conn;
};
