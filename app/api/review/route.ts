import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { prisma } from "@/app/lib/db";
import { dynamic, errorResponse, successResponse } from "@/app/api/config";

export const runtime = "edge";
export { dynamic };

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const sessionId = headersList.get("x-session-id");

    if (!sessionId) {
      return errorResponse("Non authentifié", 401);
    }

    await connectToDatabase();

    const session = await prisma.session.findFirst({
      where: {
        sessionId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return errorResponse("Session expirée", 401);
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

    return successResponse(mockData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return errorResponse("Erreur interne du serveur");
  }
}
