import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";

export async function GET() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await connectToDatabase();

    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    // Données de démonstration pour le résumé du réseau
    const mockNetworkData = {
      totalNodes: 15000,
      totalChannels: 85000,
      totalCapacity: 5000000000,
      avgCapacityPerChannel: 58823,
      avgChannelsPerNode: 5.67,
      activeNodes: 12000,
      activeChannels: 75000,
      networkGrowth: {
        nodes: 150,
        channels: 850,
        capacity: 50000000,
      },
    };

    return NextResponse.json(mockNetworkData);
  } catch (error) {
    console.error("Erreur lors de la récupération du résumé du réseau:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
