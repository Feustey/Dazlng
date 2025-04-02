import { NextResponse } from "next/server";
import mcpService from "../../../lib/mcpService";
import { mockHistoricalData } from "../../../lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // Tentez d'abord d'obtenir les données réelles
    const data = await mcpService.getHistoricalData();
    console.log(
      "API stats/historical route: données historiques récupérées avec succès"
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données historiques:",
      error
    );

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API stats/historical route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockHistoricalData);
    }

    // Sinon, retournez une erreur
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération des données historiques",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
