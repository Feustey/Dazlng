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

interface AnalysisResult {
  confidence: number;
  category: string;
  keywords: string[];
  suggestedResponse: string;
  relatedTopics: string[];
}

export class McpService {
  private static instance: McpService;
  private baseUrl: string;
  private nodeInfo: NodeInfo | null = null;
  private lastUpdate: number = 0;
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MCP_API_URL || "";
  }

  public static getInstance(): McpService {
    if (!McpService.instance) {
      McpService.instance = new McpService();
    }
    return McpService.instance;
  }

  // Nouvelle méthode pour tester la connexion
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      return response.ok;
    } catch (error) {
      console.error("Erreur de connexion à MCP:", error);
      return false;
    }
  }

  async getAllNodes(): Promise<Node[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/nodes`);
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
      const response = await fetch(`${this.baseUrl}/api/peers/${pubkey}`);
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
      const response = await fetch(`${this.baseUrl}/api/stats`);
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
      const response = await fetch(`${this.baseUrl}/api/historical`);
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
      const response = await fetch(`${this.baseUrl}/api/centralities`);
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
      const response = await fetch(`${this.baseUrl}/api/stats`);
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
      const response = await fetch(`${this.baseUrl}/api/nodes/${nodePubkey}`);
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

  async analyzeQuestion(question: string): Promise<AnalysisResult> {
    await this.updateNodeInfo();

    // Dans une implémentation réelle, cela utiliserait un modèle de langage
    // pour analyser la question et générer une réponse appropriée

    // Pour le moment, retournons une réponse simulée
    return {
      confidence: 0.85,
      category: "technical",
      keywords: ["lightning", "network", "node"],
      suggestedResponse: "Voici une réponse détaillée à votre question...",
      relatedTopics: ["Lightning Network", "Nodes", "Channels"],
    };
  }

  async getNodeCentrality(pubkey: string): Promise<NodeCentrality> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/centralities/${pubkey}`
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
      const response = await fetch(`${this.baseUrl}/api/stats/${pubkey}`);
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

  // Nouveaux endpoints pour la visualisation du graphe réseau
  async getNetworkGraph(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNetworkGraph`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch network graph");
      }
      const data = await response.json();
      return data.graph;
    } catch (error) {
      console.error("Error fetching network graph:", error);
      throw error;
    }
  }

  async getNetworkTopology(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=getNetworkTopology`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch network topology");
      }
      const data = await response.json();
      return data.topology;
    } catch (error) {
      console.error("Error fetching network topology:", error);
      throw error;
    }
  }

  // Méthodes pour les prédictions et analyses avancées
  async predictNodeGrowth(
    pubkey: string,
    timeframe: "7d" | "30d" | "90d" = "30d"
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=predictNodeGrowth&pubkey=${pubkey}&timeframe=${timeframe}`
      );
      if (!response.ok) {
        throw new Error("Failed to predict node growth");
      }
      const data = await response.json();
      return data.prediction;
    } catch (error) {
      console.error("Error predicting node growth:", error);
      throw error;
    }
  }

  async predictNetworkTrends(
    timeframe: "7d" | "30d" | "90d" = "30d"
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=predictNetworkTrends&timeframe=${timeframe}`
      );
      if (!response.ok) {
        throw new Error("Failed to predict network trends");
      }
      const data = await response.json();
      return data.prediction;
    } catch (error) {
      console.error("Error predicting network trends:", error);
      throw error;
    }
  }

  async analyzeFeeMarket(): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=analyzeFeeMarket`
      );
      if (!response.ok) {
        throw new Error("Failed to analyze fee market");
      }
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error("Error analyzing fee market:", error);
      throw error;
    }
  }

  // Méthodes pour la simulation
  async simulateScenario(
    scenario:
      | "channel_failure"
      | "node_failure"
      | "fee_change"
      | "liquidity_change",
    params: any
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=simulateScenario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario,
            params,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to simulate scenario");
      }
      const data = await response.json();
      return data.simulation;
    } catch (error) {
      console.error("Error simulating scenario:", error);
      throw error;
    }
  }

  // Méthodes pour les alertes et le monitoring
  async getAlerts(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mcp?action=getAlerts`);
      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }
      const data = await response.json();
      return data.alerts;
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  }

  async subscribeToEvents(callback: (event: any) => void): Promise<() => void> {
    try {
      const eventSource = new EventSource(`${this.baseUrl}/api/mcp/events`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error("Error parsing event data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
      };

      // Retourne une fonction pour se désabonner
      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error("Error subscribing to events:", error);
      throw error;
    }
  }

  async configureAlert(alertConfig: any): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/mcp?action=configureAlert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(alertConfig),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to configure alert");
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error configuring alert:", error);
      throw error;
    }
  }

  /**
   * Met à jour les informations du nœud si nécessaire
   */
  private async updateNodeInfo(): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdate > this.UPDATE_INTERVAL) {
      try {
        // Dans une implémentation réelle, cela récupérerait les informations du nœud
        this.nodeInfo = {
          lastUpdate: now.toString(),
          pubkey: process.env.NODE_PUBKEY || "",
          alias: "DazNode",
          addresses: [],
          color: "#000000",
          features: {},
        };
        this.lastUpdate = now;
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des informations du nœud:",
          error
        );
      }
    }
  }

  /**
   * Génère une réponse à une question
   * @param question Question à laquelle répondre
   * @returns Réponse générée
   */
  async generateResponse(question: string): Promise<string> {
    const analysis = await this.analyzeQuestion(question);
    return analysis.suggestedResponse;
  }

  // Nouvelle méthode pour les recommandations
  async getRecommendations(nodePubkey: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/review/${nodePubkey}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      throw error;
    }
  }
}

export default McpService.getInstance();
