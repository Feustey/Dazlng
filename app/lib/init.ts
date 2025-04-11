import { supabase } from "./supabase";

export async function initializeApp() {
  try {
    // Vérifier la connexion à Supabase
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .single();

    if (error) {
      console.error("Erreur lors de la connexion à Supabase:", error);
      throw error;
    }

    console.log("Application initialisée avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
    return false;
  }
}

// Initialiser l'application au démarrage du serveur
if (typeof window === "undefined") {
  initializeApp().catch((error) => {
    console.error("Erreur fatale lors de l'initialisation:", error);
    process.exit(1);
  });
}
