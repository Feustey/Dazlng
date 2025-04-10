import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dazlng";
const options = {};

let isConnected = false;

export async function connectToMongoose() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri, options);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getMongooseConnection() {
  if (!isConnected) {
    throw new Error("MongoDB not connected. Call connectToMongoose() first.");
  }
  return mongoose.connection;
}

export default mongoose;
