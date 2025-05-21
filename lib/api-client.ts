import { getAuthToken, AuthToken } from '../utils/auth';

class MCPApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.baseUrl = process.env.MCP_API_URL || 'https://api.mcp.dazlng.com';
  }

  private async ensureValidToken(): Promise<string> {
    if (!this.token || !this.tokenExpiry || new Date() > this.tokenExpiry) {
      const authToken = await getAuthToken();
      this.token = authToken.token;
      this.tokenExpiry = new Date(authToken.expires_at);
    }
    return this.token;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await this.ensureValidToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async getNetworkSummary() {
    return this.fetchWithAuth('/network/summary');
  }
  async getNodeStats(nodeId: string) {
    return this.fetchWithAuth(`/network/node/${nodeId}/stats`);
  }
  async getNodeHistory(nodeId: string) {
    return this.fetchWithAuth(`/network/node/${nodeId}/history`);
  }
  async getNetworkCentralities() {
    return this.fetchWithAuth('/network/centralities');
  }
  async optimizeNode(nodeId: string) {
    return this.fetchWithAuth(`/network/node/${nodeId}/optimize`, { method: 'POST' });
  }
}

export const mcpClient = new MCPApiClient(); 