import mongoose from "mongoose";

/**
 * Fonction pour initialiser la connexion à la base de données MongoDB
 * Cette fonction doit être appelée côté serveur uniquement
 */
export async function connectToDatabase() {
  // Vérifier si on est côté serveur
  if (typeof window !== "undefined") {
    console.warn("Tentative d'appel à connectToDatabase côté client");
    return;
  }

  try {
    // Si déjà connecté, ne rien faire
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // Vérifier la présence de l'URI de connexion
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    // Établir la connexion
    await mongoose.connect(MONGODB_URI);

    // L'initialisation des modèles est gérée par le système de modèles (pattern singleton)
    console.log("MongoDB connecté avec succès");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

/**
 * Fonction utilitaire pour vérifier si on est connecté à MongoDB
 * @returns booléen indiquant si la connexion est active
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectToDatabase;
