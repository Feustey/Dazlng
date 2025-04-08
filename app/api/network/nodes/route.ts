import { NextResponse } from "next/server";

// Données fictives pour la démonstration
const mockNodes = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  name: `Node ${i + 1}`,
  channels: Math.floor(Math.random() * 100) + 10,
  capacity: Math.floor(Math.random() * 1000000) + 50000,
  pubkey: `pubkey_${i + 1}`,
  lastSeen: new Date().toISOString(),
  uptime: Math.random() * 100,
}));

export async function GET() {
  try {
    // Ici vous pourriez implémenter la vraie logique pour récupérer les nœuds
    // Par exemple, requête à une base de données ou appel à un service externe

    return NextResponse.json(mockNodes);
  } catch (error) {
    console.error("Error fetching network nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch network nodes" },
      { status: 500 }
    );
  }
}
