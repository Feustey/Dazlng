import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/app/lib/db";
import { Session } from "@/app/lib/models/Session";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

export async function GET() {
  try {
    const sessionId = cookies().get("session_id")?.value;

    if (!sessionId) {
      return errorResponse("Non authentifié", 401);
    }

    await connectToDatabase();

    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return errorResponse("Session expirée", 401);
    }

    // Données historiques de démonstration
    const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      total_fees: 150000 - i * 1000,
      total_capacity: 15000000 - i * 100000,
      active_channels: 23 - Math.floor(i / 5),
      total_peers: 15 - Math.floor(i / 7),
      total_volume: 5000000 - i * 50000,
    }));

    return successResponse(mockHistoricalData);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données historiques:",
      error
    );
    return errorResponse("Erreur interne du serveur");
  }
}
