import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Données fictives pour les statistiques réseau
const mockNetworkStats = {
  nodes_count: 12500,
  channels_count: 35800,
  capacity: "1250000000000", // en sats
  avg_channel_size: "3500000", // en sats
  avg_channels_per_node: 5.72,
  top_nodes: [
    {
      alias: "ACINQ",
      pubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      capacity: "125000000",
      channels: 100,
    },
    {
      alias: "Bitfinex",
      pubkey:
        "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
      capacity: "110000000",
      channels: 85,
    },
    {
      alias: "River Financial",
      pubkey:
        "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
      capacity: "95000000",
      channels: 78,
    },
  ],
  timestamp: new Date().toISOString(),
};

// Service MCP simulé
const mcpService = {
  getCurrentStats: async () => {
    // Retourne des données simulées
    return { ...mockNetworkStats, timestamp: new Date().toISOString() };
  },
};

// Activer le mode développement pour utiliser les données fictives
const devMode = process.env.DEV_MODE === "true";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (devMode) {
    // Utiliser les données fictives en mode développement
    return res.status(200).json(mockNetworkStats);
  }

  try {
    const stats = await mcpService.getCurrentStats();
    if (!stats) {
      return res.status(404).json({ message: "Stats not found" });
    }
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching current stats:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
