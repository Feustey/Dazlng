import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection | null> | null;
}

interface GlobalWithMongoose extends Global {
  mongoose: MongooseCache | undefined;
}

declare const global: GlobalWithMongoose;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dazlng";

if (!MONGODB_URI) {
  throw new Error("La variable d'environnement MONGODB_URI est requise");
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<mongoose.Connection> {
  try {
    if (cached.conn) {
      console.log("Utilisation de la connexion MongoDB existante");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("Tentative de connexion à MongoDB...");
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose
        .connect(MONGODB_URI!, opts)
        .then((mongoose) => {
          console.log("Connexion à MongoDB établie avec succès");
          cached.conn = mongoose.connection;
          return mongoose.connection;
        })
        .catch((error) => {
          console.error("Erreur de connexion à MongoDB:", error);
          cached.promise = null;
          throw error;
        });
    }

    const connection = await cached.promise;
    if (!connection) {
      throw new Error("Impossible d'établir la connexion à MongoDB");
    }
    return connection;
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB:", error);
    throw error;
  }
}
