import { NextResponse } from "next/server";

// Configuration de la revalidation
export const revalidate = 300; // Revalider toutes les 5 minutes

// Données fictives pour la démonstration
const mockStats = {
  totalNodes: 18934,
  totalChannels: 128475,
  totalCapacity: "5234.67 BTC",
  avgChannelSize: "0.0407 BTC",
  medianChannelSize: "0.0285 BTC",
  nodeGrowth: "+2.3%",
  channelGrowth: "+1.8%",
  capacityGrowth: "+3.1%",
};

export async function GET() {
  try {
    // Ici vous pourriez implémenter la vraie logique pour récupérer les statistiques
    // Par exemple, requête à une base de données ou appel à un service externe
    return NextResponse.json(mockStats, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching network stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch network stats" },
      { status: 500 }
    );
  }
}
