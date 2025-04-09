"use server";

import { getCurrentStats } from "../../../services/network.service";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { mockNetworkStats } from "../../../lib/mockData";

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    // En développement, utiliser les données simulées
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(mockNetworkStats);
    }

    const stats = await getCurrentStats();
    console.log(
      "API stats/current route: statistiques actuelles récupérées avec succès"
    );
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching current stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
