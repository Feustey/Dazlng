import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import connectToDatabaseMongoose from "./mongoose-init";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Configuration Mongoose
mongoose.set("strictQuery", true);

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      const client = await clientPromise;
      return { client, db: client.db() };
    }

    // Utilisation de la connexion mongoose avec le pattern singleton
    await connectToDatabaseMongoose();

    const client = await clientPromise;
    console.log("Connected to MongoDB");
    return { client, db: client.db() };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

export async function closeDb() {
  await mongoose.connection.close();
  const client = await clientPromise;
  await client.close();
}

// Export clientPromise pour l'adapter NextAuth
export { clientPromise };

const database = {
  getDb,
  closeDb,
};

export default database;
