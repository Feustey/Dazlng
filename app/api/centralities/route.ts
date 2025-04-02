import { NextResponse } from "next/server";
import mcpService from "../../lib/mcpService";

// Données fictives pour le développement
const mockCentralities = {
  betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  last_update: new Date().toISOString(),
};

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // Tentez d'abord d'obtenir les données réelles
    const centralites = await mcpService.getCentralities();
    console.log("API centralities route: centralités récupérées avec succès");
    return NextResponse.json(centralites);
  } catch (error) {
    console.error("Erreur lors de la récupération des centralités:", error);

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API centralities route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockCentralities);
    }

    // Sinon, retournez une erreur
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération des centralités du réseau",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
