// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
    isConnected = true;
    return mongoose;
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
