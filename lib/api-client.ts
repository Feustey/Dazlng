import { getAuthToken } from '../utils/auth';

type ApiError = {
  message: string;
  code?: string;
}

type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
  status: number;
}

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

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<any> {
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

  async getNetworkSummary(): Promise<import('./network-types').NetworkSummary> {
    return this.fetchWithAuth('/network/summary');
  }
  async getNodeStats(nodeId: string): Promise<any> {
    return this.fetchWithAuth(`/network/node/${nodeId}/stats`);
  }
  async getNodeHistory(nodeId: string): Promise<any> {
    return this.fetchWithAuth(`/network/node/${nodeId}/history`);
  }
  async getNetworkCentralities(): Promise<any> {
    return this.fetchWithAuth('/network/centralities');
  }
  async optimizeNode(nodeId: string): Promise<import('./network-types').OptimizationResult> {
    return this.fetchWithAuth(`/network/node/${nodeId}/optimize`, { method: 'POST' });
  }
}

export const mcpClient = new MCPApiClient();

export async function get<T>(_endpoint: string): Promise<ApiResponse<T>> {
  return { status: 501 };
}

export async function post<T>(_endpoint: string, _data: Record<string, unknown>): Promise<ApiResponse<T>> {
  return { status: 501 };
}

export async function handleRequest(): Promise<void> {
  // ... code existant
}

export async function handleError(_endpoint: string, _data: unknown): Promise<void> {
  // ... code existant
} 