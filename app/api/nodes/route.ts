"use server";

import { getAllNodes } from "@/app/services/network.service";
import { NextResponse } from "next/server";
import { mockNodes } from "../../lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // Tentez d'abord d'obtenir les données réelles
    const nodes = await getAllNodes();
    console.log(`API nodes route: ${nodes.length} nodes récupérés avec succès`);
    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Error fetching nodes:", error);

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API nodes route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockNodes);
    }

    // Sinon, retournez une erreur
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération des nœuds",
        error: error instanceof Error ? error.message : String(error),
        note: "Pour utiliser des données fictives en développement, définissez USE_MOCK_DATA=true",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
