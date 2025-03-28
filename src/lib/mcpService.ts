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

class McpService {
  private baseUrl: string;
  private pubkey: string;

  constructor() {
    this.baseUrl = process.env.MCP_API_URL || 'https://mcp-c544a464bb52.herokuapp.com';
    this.pubkey = process.env.NODE_PUBKEY || "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
  }

  async getPeersOfPeers(pubkey: string): Promise<PeersOfPeersResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/peers-of-peers/${pubkey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pairs des pairs:', error);
      throw error;
    }
  }

  async getAllNodes(): Promise<McpNode[]> {
    try {
      const response = await fetch(`${this.baseUrl}/nodes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des nœuds:', error);
      throw error;
    }
  }

  async getCurrentStats(): Promise<McpNode> {
    try {
      const response = await fetch(`${this.baseUrl}/nodes/${this.pubkey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async getHistoricalData(): Promise<McpNode[]> {
    try {
      const response = await fetch(`${this.baseUrl}/nodes/${this.pubkey}/history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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