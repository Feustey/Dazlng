import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const sessionId = headersList.get("x-session-id");

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

    // Données de démonstration pour le tableau de bord
    const mockData = {
      channelStats: {
        opened: 25,
        active: 23,
        closed: 2,
      },
      financialMetrics: {
        totalCapacity: 15000000,
        totalFees: 150000,
        averageFee: 6500,
      },
      networkMetrics: {
        uptime: 99.9,
        peers: 15,
        channels: 25,
      },
      centralities: {
        betweenness: 0.75,
        closeness: 0.82,
        eigenvector: 0.68,
      },
      feeRates: {
        average: 6500,
        min: 1000,
        max: 10000,
      },
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
