"use client";

/**
 * Fonction pour effectuer une recherche de nœuds
 * @param query Terme de recherche
 * @returns Résultats de la recherche
 */
export async function searchNodes(query: string) {
  try {
    const response = await fetch(
      `/api/nodes/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    throw error;
  }
}
