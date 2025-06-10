// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

let initialized = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);
  if (initialized) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "SamStack-Ed Blog",
    });
    console.log("Connected to MongoDB");
    initialized = true;
  } catch (error) {
    console.log("Error connecting to mongoDB", error);
  }
};
