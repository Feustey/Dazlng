import { McpNode, NodeInfo, Peer, PeersOfPeersResponse, OptimizeNodeResponse } from '@/types/node';

const API_URL = process.env.NEXT_PUBLIC_MCP_API_URL || 'https://mcp-c544a464bb52.herokuapp.com';

export const mcpService = {
  async optimize(nodeData: McpNode) {
    try {
      const response = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'optimisation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur MCP Service:', error);
      throw error;
    }
  },

  async getStatus() {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur MCP Service:', error);
      throw error;
    }
  },

  async getRecommendations(nodeData: McpNode) {
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des recommandations');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur MCP Service:', error);
      throw error;
    }
  }
};

class McpService {
  private baseUrl: string;
  private pubkey: string;
  private maxRetries: number = 5;
  private initialRetryDelay: number = 1000;

  constructor() {
    this.baseUrl = process.env.MCP_API_URL || 'https://mcp-c544a464bb52.herokuapp.com';
    this.pubkey = process.env.NODE_PUBKEY || "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
  }

  private async fetchWithRetry(url: string, retries: number = this.maxRetries): Promise<Response> {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error(`Service temporairement indisponible (503)`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        const delay = this.initialRetryDelay * Math.pow(2, this.maxRetries - retries);
        console.log(`Service temporairement indisponible. Nouvelle tentative dans ${delay/1000} secondes... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, retries - 1);
      }
      
      if (error instanceof Error) {
        throw new Error(`Impossible de se connecter à l'API MCP après ${this.maxRetries} tentatives: ${error.message}`);
      }
      throw error;
    }
  }

  async getNodeInfo(pubkey: string): Promise<NodeInfo> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes/${pubkey}`);
      const data = await response.json();
      
      return {
        alias: data.alias,
        capacity: data.capacity,
        channelCount: data.channel_count,
        avgCapacity: data.capacity ? Math.floor(data.capacity / (data.channel_count || 1)) : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du nœud:', error);
      throw error;
    }
  }

  async optimizeNode(pubkey: string): Promise<OptimizeNodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize-node`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pubkey }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'optimisation du nœud:', error);
      throw error;
    }
  }

  async getPeersOfPeers(pubkey: string): Promise<PeersOfPeersResponse> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/peers-of-peers/${pubkey}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pairs des pairs:', error);
      return {
        pubkey: pubkey,
        peers: [],
        peers_of_peers: [],
        total: 0
      };
    }
  }

  async getAllNodes(): Promise<McpNode[]> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des nœuds:', error);
      return [];
    }
  }

  async getCurrentStats(): Promise<McpNode> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes/${this.pubkey}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        pubkey: this.pubkey,
        alias: "DazLng Node (Fallback)",
        capacity: 0,
        channel_count: 0,
        last_update: new Date().toISOString(),
      };
    }
  }

  async getHistoricalData(): Promise<McpNode[]> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes/${this.pubkey}/history`);
      const data = await response.json();
      return data.slice(0, 30); // Limite aux 30 derniers jours
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
      return [];
    }
  }
}

const mcpServiceInstance = new McpService();
export default mcpServiceInstance; 