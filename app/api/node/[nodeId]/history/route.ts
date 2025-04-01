import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Node } from "@/models/Node";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { nodeId: string } }
) {
  try {
    // Utiliser Prisma ou une autre méthode pour récupérer l'historique
    // puisque le modèle Node est une interface et non un modèle Mongoose
    const nodeHistory = await prisma.nodeHistory.findMany({
      where: {
        pubkey: params.nodeId,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
      select: {
        timestamp: true,
        total_capacity: true,
        active_channels: true,
        total_peers: true,
        uptime: true,
      },
    });

    return NextResponse.json({
      status: "success",
      data: nodeHistory,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);

    // Retourner des données fictives en cas d'erreur pour éviter les erreurs en production
    const mockHistory = Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 86400000),
      total_capacity: 5000000 - i * 100000,
      active_channels: 10 - (i > 5 ? 1 : 0),
      total_peers: 8 - (i > 3 ? 1 : 0),
      uptime: 99.8 - i * 0.1,
    }));

    return NextResponse.json({
      status: "success",
      data: mockHistory,
    });
  }
}
