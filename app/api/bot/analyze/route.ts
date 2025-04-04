import { NextResponse } from "next/server";
import mcpService from "@/app/lib/mcpService";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    const nodePubkey = process.env.NODE_PUBKEY;

    if (!nodePubkey) {
      throw new Error(
        "NODE_PUBKEY non défini dans les variables d'environnement"
      );
    }

    // Récupérer toutes les données nécessaires
    const [nodeInfo, networkMetrics, peersOfPeers, recommendations] =
      await Promise.all([
        mcpService.getNodeInfo(nodePubkey),
        mcpService.getNetworkSummary(),
        mcpService.getPeersOfPeers(nodePubkey),
        mcpService.analyzeQuestion(question, nodePubkey),
      ]);

    return NextResponse.json({
      status: "success",
      nodeInfo,
      networkMetrics,
      peersOfPeers,
      recommendations,
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de la question" },
      { status: 500 }
    );
  }
}
