import { McpNode } from '@/types/node';

interface Peer {
  pubkey: string;
  alias?: string;
  capacity?: number;
  channel_count?: number;
}

interface PeersOfPeersResponse {
  peers: Peer[];
  total: number;
}

interface OptimizeNodeResponse {
  recommendations: string[];
  status: string;
}

class McpService {
  private baseUrl: string;
  private pubkey: string;
  private maxRetries: number = 3;
  private retryDelay: number = 2000; // 2 secondes

  constructor() {
    this.baseUrl = process.env.MCP_API_URL || 'https://mcp-c544a464bb52.herokuapp.com';
    this.pubkey = process.env.NODE_PUBKEY || "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
  }

  private async fetchWithRetry(url: string, retries: number = this.maxRetries): Promise<Response> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`Tentative de reconnexion... (${this.maxRetries - retries + 1}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry(url, retries - 1);
      }
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
      throw error;
    }
  }

  async getAllNodes(): Promise<McpNode[]> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des nœuds:', error);
      throw error;
    }
  }

  async getCurrentStats(): Promise<McpNode> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes/${this.pubkey}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async getHistoricalData(): Promise<McpNode[]> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/nodes/${this.pubkey}/history`);
      const data = await response.json();
      return data.slice(0, 30); // Limite aux 30 derniers jours
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
      throw error;
    }
  }
}

const mcpService = new McpService();
export default mcpService; 