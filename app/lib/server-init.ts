import { connectToDatabase } from "./db";

export async function initializeServer() {
  try {
    await connectToDatabase();
    console.log("Serveur initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du serveur:", error);
    throw error;
  }
}
