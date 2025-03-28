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

  constructor() {
    this.baseUrl = process.env.MCP_API_URL || 'https://mcp-c544a464bb52.herokuapp.com';
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
}

const mcpService = new McpService();
export default mcpService; 