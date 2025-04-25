import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "../../edge-config";

// Implémentation simulée du service MCP pour le déploiement
const mcpService = {
  getNodeInfo: (pubkey: string) => {
    return Promise.resolve({
      alias: "Daznode Sample",
      pubkey,
      capacity: 10000000,
      channels: 42,
      betweenness: 0.75,
      nodeRank: 15,
    });
  },
  getNetworkSummary: () => {
    return Promise.resolve({
      totalNodes: 16598,
      totalChannels: 72354,
      totalCapacity: "228042.5 BTC",
      avgChannelSize: "3.15 BTC",
    });
  },
  getPeersOfPeers: (pubkey: string) => {
    return Promise.resolve([
      { pubkey: "peer1", alias: "ACINQ", capacity: 5000000 },
      { pubkey: "peer2", alias: "Lightning Labs", capacity: 7500000 },
      { pubkey: "peer3", alias: "Bitfinex", capacity: 8000000 },
    ]);
  },
  analyzeQuestion: (question: string) => {
    return Promise.resolve({
      answer: `Réponse simulée à la question: "${question}"`,
      recommendations: [
        "Créer plus de canaux pour augmenter la connectivité",
        "Équilibrer les canaux existants",
        "Considérer l'ajout de liquidité aux canaux principaux",
      ],
    });
  },
};

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    const nodePubkey = process.env.NODE_PUBKEY || "default-pubkey-for-testing";

    // Récupérer toutes les données nécessaires
    const [nodeInfo, networkMetrics, peersOfPeers, recommendations] =
      await Promise.all([
        mcpService.getNodeInfo(nodePubkey),
        mcpService.getNetworkSummary(),
        mcpService.getPeersOfPeers(nodePubkey),
        mcpService.analyzeQuestion(question),
      ]);

    return successResponse({
      status: "success",
      nodeInfo,
      networkMetrics,
      peersOfPeers,
      recommendations,
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    return errorResponse("Erreur lors de l'analyse de la question");
  }
}
