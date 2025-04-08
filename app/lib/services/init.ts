import { QueryOptimizer } from "./queryOptimizer";

export async function initializeServices() {
  try {
    // Initialiser l'optimiseur de requêtes
    const queryOptimizer = QueryOptimizer.getInstance();
    // Le cache est initialisé automatiquement lors de la première utilisation

    console.log("Tous les services ont été initialisés avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation des services:", error);
    throw error;
  }
}

export function shutdownServices() {
  try {
    // Vider le cache des requêtes
    const queryOptimizer = QueryOptimizer.getInstance();
    queryOptimizer.clearCache();

    console.log("Tous les services ont été arrêtés avec succès");
  } catch (error) {
    console.error("Erreur lors de l'arrêt des services:", error);
    throw error;
  }
}
