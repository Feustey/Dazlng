"use server";

import { getCurrentStats } from "@/app/services/network.service";
import { NextResponse } from "next/server";
import { mockNetworkStats } from "@/app/lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // Tentez d'abord d'obtenir les données réelles
    const stats = await getCurrentStats();
    console.log(
      "API stats/current route: statistiques actuelles récupérées avec succès"
    );
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching current stats:", error);

    // Si mode développement, retournez des données fictives
    if (USE_MOCK_DATA) {
      console.log(
        "API stats/current route: utilisation des données fictives (mode développement)"
      );
      return NextResponse.json(mockNetworkStats);
    }

    // Sinon, retournez une erreur
    return NextResponse.json(
      { error: "Failed to fetch current stats" },
      { status: 500 }
    );
  }
}
