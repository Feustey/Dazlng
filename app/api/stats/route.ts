import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { dynamic, runtime, errorResponse, successResponse } from "../config";

export { dynamic, runtime };

export async function GET() {
  try {
    console.log("Début de la requête GET /api/stats");

    // Récupération des statistiques
    const stats = await prisma.history.findMany({
      orderBy: {
        date: "desc",
      },
      take: 1,
    });

    if (!stats || stats.length === 0) {
      return errorResponse("Aucune statistique disponible", 404);
    }

    // Retourner les données directement depuis le modèle History
    const currentStats = stats[0];
    return successResponse({
      id: currentStats.id,
      date: currentStats.date,
      price: currentStats.price,
      volume: currentStats.volume,
      marketCap: currentStats.marketCap,
      createdAt: currentStats.createdAt,
      updatedAt: currentStats.updatedAt,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return errorResponse(
      "Erreur lors de la récupération des statistiques",
      503
    );
  }
}
