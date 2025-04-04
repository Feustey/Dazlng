import { connectToDatabase } from "./mongodb";
import mongoose from "mongoose";

interface Node {
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_capacity: number;
  active_channel_count: number;
  total_peers: number;
  uptime: number;
}

interface PeerOfPeer {
  peerPubkey: string;
  alias: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

interface NodeStats {
  pubkey: string;
  alias: string;
  color: string;
  platform: string;
  version: string;
  address: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channels: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  betweenness_rank: number;
  eigenvector_rank: number;
  closeness_rank: number;
  weighted_betweenness_rank: number;
  weighted_closeness_rank: number;
  weighted_eigenvector_rank: number;
  last_update: string;
}

interface HistoricalData {
  timestamp: string;
  total_fees: number;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  total_volume: number;
}

interface CentralityData {
  betweenness: number;
  closeness: number;
  eigenvector: number;
}

interface NetworkSummaryData {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  timestamp: string;
}

interface OptimizationResult {
  status: string;
  message?: string;
  // ... autres détails
}

interface NodeInfo {
  // ... structure des informations du noeud (peut-être similaire à Node ou NodeStats ?)
  pubkey: string;
  alias: string;
  // ...
}

// Constante pour l'alias du nœud de secours
const FALLBACK_NODE_ALIAS = "feustey";

const mcpService = {
  async getAllNodes(): Promise<Node[]> {
    try {
      const response = await fetch(`${process.env.MCP_API_URL}/nodes`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des nœuds");
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Récupérer uniquement le nœud feustey
      const node = await db
        .model("Node")
        .findOne({ alias: FALLBACK_NODE_ALIAS });
      return node ? [node] : [];
    }
  },

  async getPeersOfPeers(
    nodePubkey: string
  ): Promise<{ peers_of_peers: PeerOfPeer[] }> {
    try {
      const response = await fetch(
        `${process.env.MCP_API_URL}/node/${nodePubkey}/peers`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des pairs");
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Récupérer les pairs du nœud feustey
      const peers = await db
        .model("PeerOfPeer")
        .find({ nodePubkey: process.env.NODE_PUBKEY });
      return { peers_of_peers: peers };
    }
  },

  async getCurrentStats(): Promise<NodeStats> {
    try {
      const nodePubkey = process.env.NODE_PUBKEY;
      if (!nodePubkey) {
        throw new Error(
          "NODE_PUBKEY non défini dans les variables d'environnement"
        );
      }

      const response = await fetch(
        `${process.env.MCP_API_URL}/node/${nodePubkey}/stats`
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des statistiques actuelles"
        );
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Récupérer les stats du nœud feustey
      const stats = await db
        .model("NodeStats")
        .findOne({ alias: FALLBACK_NODE_ALIAS })
        .sort({ timestamp: -1 });
      if (!stats) {
        throw new Error("Aucune donnée de secours disponible");
      }
      return stats;
    }
  },

  async getHistoricalData(): Promise<HistoricalData[]> {
    try {
      const nodePubkey = process.env.NODE_PUBKEY;
      if (!nodePubkey) {
        throw new Error(
          "NODE_PUBKEY non défini dans les variables d'environnement"
        );
      }

      const response = await fetch(
        `${process.env.MCP_API_URL}/node/${nodePubkey}/history`
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données historiques"
        );
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Récupérer l'historique du nœud feustey
      const history = await db
        .model("HistoricalData")
        .find({ alias: FALLBACK_NODE_ALIAS })
        .sort({ timestamp: -1 })
        .limit(30); // Limite aux 30 dernières entrées
      return history;
    }
  },

  async getCentralities(): Promise<CentralityData> {
    try {
      const nodePubkey = process.env.NODE_PUBKEY;
      if (!nodePubkey) {
        throw new Error("NODE_PUBKEY non défini");
      }
      const response = await fetch(
        `${process.env.MCP_API_URL}/node/${nodePubkey}/centralities`
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de centralité"
        );
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Récupérer les centralités du nœud feustey
      const centralities = await db
        .model("CentralityData")
        .findOne({ alias: FALLBACK_NODE_ALIAS })
        .sort({ timestamp: -1 });
      if (!centralities) {
        throw new Error("Aucune donnée de centralité de secours disponible");
      }
      return centralities;
    }
  },

  async getNetworkSummary(): Promise<NetworkSummaryData> {
    try {
      const response = await fetch(
        `${process.env.MCP_API_URL}/network/summary`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du résumé réseau");
      }
      return response.json();
    } catch (error) {
      console.warn(
        "MCP indisponible, utilisation des données de secours:",
        error
      );
      const db = await connectToDatabase();
      // Créer un résumé réseau basé sur les données du nœud feustey
      const nodeStats = await db
        .model("NodeStats")
        .findOne({ alias: FALLBACK_NODE_ALIAS })
        .sort({ timestamp: -1 });
      if (!nodeStats) {
        throw new Error("Aucune donnée de secours disponible");
      }

      // Créer un résumé réseau minimal basé sur les données du nœud
      return {
        totalNodes: 1,
        totalChannels: nodeStats.active_channels || 0,
        totalCapacity: nodeStats.total_capacity || 0,
        avgCapacityPerChannel: nodeStats.avg_capacity || 0,
        avgChannelsPerNode: nodeStats.active_channels || 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async optimizeNode(nodePubkey: string): Promise<OptimizationResult> {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/optimize`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors de l'optimisation du nœud");
    }
    return response.json();
  },

  async getNodeInfo(nodePubkey: string): Promise<NodeInfo> {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}`
    );
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des informations du nœud"
      );
    }
    return response.json();
  },

  async analyzeQuestion(
    question: string,
    nodePubkey: string
  ): Promise<string[]> {
    try {
      // Récupérer les données du nœud
      const nodeInfo = await this.getNodeInfo(nodePubkey);
      const networkMetrics = await this.getNetworkSummary();
      const peersOfPeers = await this.getPeersOfPeers(nodePubkey);

      // Analyser la question et générer des recommandations
      const recommendations: string[] = [];

      // Exemple d'analyse basée sur les mots-clés
      if (question.toLowerCase().includes("frais")) {
        if (nodeInfo.feeRates.average < 100) {
          recommendations.push(
            "Vos frais sont relativement bas. Vous pourriez les augmenter légèrement pour maximiser vos revenus."
          );
        } else if (nodeInfo.feeRates.average > 1000) {
          recommendations.push(
            "Vos frais sont élevés. Envisagez de les réduire pour attirer plus de trafic."
          );
        }
      }

      if (question.toLowerCase().includes("canaux")) {
        if (nodeInfo.channelStats.active < nodeInfo.channelStats.opened * 0.8) {
          recommendations.push(
            "Vous avez plusieurs canaux inactifs. Envisagez de les fermer ou de les réactiver."
          );
        }
        if (nodeInfo.channelStats.opened < 10) {
          recommendations.push(
            "Votre nombre de canaux est faible. Envisagez d'ouvrir plus de canaux pour augmenter votre présence sur le réseau."
          );
        }
      }

      if (question.toLowerCase().includes("capacité")) {
        const avgCapacity =
          nodeInfo.financialMetrics.totalCapacity /
          nodeInfo.channelStats.opened;
        if (avgCapacity < 1000000) {
          recommendations.push(
            "Votre capacité moyenne par canal est faible. Envisagez d'augmenter la taille de vos canaux."
          );
        }
      }

      if (question.toLowerCase().includes("réseau")) {
        if (nodeInfo.centralities?.betweenness < 0.1) {
          recommendations.push(
            "Votre centralité dans le réseau est faible. Envisagez de vous connecter à des nœuds plus centraux."
          );
        }
      }

      // Recommandations par défaut si aucune correspondance
      if (recommendations.length === 0) {
        recommendations.push("Basé sur l'analyse de votre nœud :");
        recommendations.push(
          `- Vous avez ${nodeInfo.channelStats.opened} canaux ouverts dont ${nodeInfo.channelStats.active} actifs`
        );
        recommendations.push(
          `- Votre capacité totale est de ${nodeInfo.financialMetrics.totalCapacity} sats`
        );
        recommendations.push(
          `- Vos frais moyens sont de ${nodeInfo.feeRates.average} ppm`
        );
      }

      return recommendations;
    } catch (error) {
      console.error("Erreur lors de l'analyse de la question:", error);
      throw error;
    }
  },
};

export default mcpService;
