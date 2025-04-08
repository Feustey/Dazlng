import { NextResponse } from "next/server";

// Données fictives pour la démonstration
const mockStats = {
  totalNodes: 15784,
  totalChannels: 92435,
  totalCapacity: "5234.67 BTC",
  avgChannelSize: "0.0566 BTC",
  networkGrowth: {
    nodes: {
      daily: 12,
      weekly: 87,
      monthly: 342,
    },
    channels: {
      daily: 76,
      weekly: 513,
      monthly: 2154,
    },
    capacity: {
      daily: "18.54 BTC",
      weekly: "123.78 BTC",
      monthly: "487.32 BTC",
    },
  },
};

export async function GET() {
  try {
    // Ici vous pourriez implémenter la vraie logique pour récupérer les statistiques
    // Par exemple, requête à une base de données ou appel à un service externe

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Error fetching network stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch network stats" },
      { status: 500 }
    );
  }
}
