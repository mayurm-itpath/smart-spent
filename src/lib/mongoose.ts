import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URL as string;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(dbURL).then((mongoose) => {
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
