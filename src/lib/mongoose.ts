import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URL as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
