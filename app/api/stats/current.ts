import { NextResponse } from "next/server";
import mcpService from "@/lib/mcpService";
import { mockNetworkStats } from "@/lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // Tentez d'abord d'obtenir les données réelles
    const stats = await mcpService.getCurrentStats();
    console.log(
      "API stats/current route: statistiques actuelles récupérées avec succès"
    );
    return NextResponse.json(stats);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques actuelles:",
      error
    );

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API stats/current route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockNetworkStats);
    }

    // Sinon, retournez une erreur
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération des statistiques actuelles",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
