import { supabase } from "./supabase";

export async function initializeServer() {
  try {
    // Vérifier la connexion à Supabase
    const { data, error } = await supabase.from("config").select("*").limit(1);

    if (error) {
      throw error;
    }

    console.log("Serveur initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du serveur:", error);
    throw error;
  }
}
