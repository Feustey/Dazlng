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
  // ... autres métriques de résumé réseau
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

const mcpService = {
  async getAllNodes(): Promise<Node[]> {
    const response = await fetch(`${process.env.MCP_API_URL}/nodes`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des nœuds");
    }
    return response.json();
  },

  async getPeersOfPeers(
    nodePubkey: string
  ): Promise<{ peers_of_peers: PeerOfPeer[] }> {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/peers`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des pairs");
    }
    return response.json();
  },

  async getCurrentStats(): Promise<NodeStats> {
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
  },

  async getHistoricalData(): Promise<HistoricalData[]> {
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
      throw new Error("Erreur lors de la récupération des données historiques");
    }
    return response.json();
  },

  async getCentralities(): Promise<CentralityData> {
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
  },

  async getNetworkSummary(): Promise<NetworkSummaryData> {
    const response = await fetch(`${process.env.MCP_API_URL}/network/summary`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du résumé réseau");
    }
    return response.json();
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
};

export default mcpService;
