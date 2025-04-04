"use server";

import { getNetworkSummary } from "@/app/services/network.service";
import { NextResponse } from "next/server";
import { mockNetworkSummary } from "@/app/lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    const summary = await getNetworkSummary();
    console.log(
      "API network-summary route: résumé réseau récupéré avec succès"
    );
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching network summary:", error);

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API network-summary route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockNetworkSummary);
    }

    // Sinon, retournez une erreur
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la récupération du résumé du réseau",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
