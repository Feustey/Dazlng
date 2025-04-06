import { connectToDatabase } from "./db";

export async function initializeServer() {
  try {
    await connectToDatabase();
    console.log("Serveur initialisé avec succès");
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error("Une erreur inconnue s'est produite");
    console.error("Erreur lors de l'initialisation du serveur:", error);
    throw error;
  }
}
