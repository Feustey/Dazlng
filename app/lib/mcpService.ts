import type {
  Node,
  NetworkSummary,
  NetworkStats,
  Centralities,
  NodeCentrality,
  CentralityNode,
  NetworkSummaryData,
  HistoricalData,
} from "../types/node";
import type {
  NodeStats,
  PeerOfPeer,
  CentralityData,
  OptimizationResult,
  NodeInfo,
} from "../types/mcpService";

// Types d'erreurs personnalisés
export class McpError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "McpError";
  }
}

export class NodeNotFoundError extends McpError {
  constructor(pubkey: string) {
    super(`Node with pubkey ${pubkey} not found`, "NODE_NOT_FOUND", 404);
  }
}

export class DatabaseError extends McpError {
  constructor(message: string, details?: any) {
    super(message, "DATABASE_ERROR", 500, details);
  }
}

export class OptimizationError extends McpError {
  constructor(message: string, details?: any) {
    super(message, "OPTIMIZATION_ERROR", 400, details);
  }
}

export class McpService {
  private static instance: McpService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  public static getInstance(): McpService {
    if (!McpService.instance) {
      McpService.instance = new McpService();
    }
    return McpService.instance;
  }

  async getAllNodes(): Promise<Node[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getAllNodes`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }
      const data = await response.json();
      return data.nodes;
    } catch (error) {
      console.error("Erreur lors de la récupération des nœuds:", error);
      throw error;
    }
  }

  async getPeersOfPeers(pubkey: string): Promise<PeerOfPeer[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getPeersOfPeers&pubkey=${pubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch peers");
      }
      const data = await response.json();
      return data.peers;
    } catch (error) {
      console.error("Erreur lors de la récupération des pairs:", error);
      throw error;
    }
  }

  async getCurrentStats(): Promise<NetworkStats> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getCurrentStats`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  }

  async getHistoricalData(): Promise<HistoricalData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getHistoricalData`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données historiques:",
        error
      );
      throw error;
    }
  }

  async getCentralities(): Promise<Centralities> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getCentralities`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch centralities");
      }
      const data = await response.json();
      return data.centralities;
    } catch (error) {
      console.error("Error fetching centralities:", error);
      throw error;
    }
  }

  async getNetworkSummary(): Promise<NetworkSummaryData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNetworkSummary`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch network summary");
      }
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du résumé du réseau:",
        error
      );
      throw error;
    }
  }

  async optimizeNode(nodePubkey: string): Promise<OptimizationResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=optimizeNode&pubkey=${nodePubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to optimize node");
      }
      const data = await response.json();
      return data.result;
    } catch (error: unknown) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new OptimizationError("Erreur lors de l'optimisation du nœud", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getNodeInfo(nodePubkey: string): Promise<NodeInfo> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNodeInfo&pubkey=${nodePubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch node info");
      }
      const data = await response.json();
      return data.info;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du nœud:",
        error
      );
      throw error;
    }
  }

  async analyzeQuestion(
    question: string,
    nodePubkey: string
  ): Promise<{
    answers: string[];
    confidence: number;
    relatedTopics: string[];
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=analyzeQuestion&question=${encodeURIComponent(question)}&pubkey=${nodePubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to analyze question");
      }
      const data = await response.json();
      return data.analysis;
    } catch (error: unknown) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        "Erreur lors de l'analyse de la question",
        "ANALYSIS_ERROR",
        500,
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }

  async getNodeCentrality(pubkey: string): Promise<NodeCentrality> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNodeCentrality&pubkey=${pubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch node centrality");
      }
      const data = await response.json();
      return data.centrality;
    } catch (error) {
      console.error("Error fetching node centrality:", error);
      throw error;
    }
  }

  async getNodeStats(pubkey: string): Promise<NodeStats> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNodeStats&pubkey=${pubkey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch node stats");
      }
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error("Error fetching node stats:", error);
      throw error;
    }
  }
}

export default McpService.getInstance();
