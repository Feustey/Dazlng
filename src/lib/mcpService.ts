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

interface Node {
  pubkey: string;
  alias: string;
  total_capacity: number;
  avg_fee_rate_ppm: number;
  uptime: number;
  active_channels: number;
  total_peers: number;
  platform: string;
  version: string;
  total_fees: number;
  total_volume: number;
  opened_channel_count: number;
  color: string;
  address: string;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  timestamp: string;
}

interface HistoricalData {
  timestamp: string;
  total_fees: number;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  total_volume: number;
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

  async getAllNodes(): Promise<Node[]> {
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

  async getCurrentStats(): Promise<Node> {
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

  async getHistoricalData(): Promise<HistoricalData[]> {
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