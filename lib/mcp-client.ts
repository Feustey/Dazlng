import { headers } from 'next/headers';

export class MCPClient {
  private static instance: MCPClient;
  private readonly baseUrl: string;
  private readonly token: string;

  private constructor() {
    if (!process.env.MCP_API_URL) {
      throw new Error('MCP_API_URL is not defined');
    }
    if (!process.env.MCP_JWT_TOKEN) {
      throw new Error('MCP_JWT_TOKEN is not defined');
    }
    this.baseUrl = process.env.MCP_API_URL;
    this.token = process.env.MCP_JWT_TOKEN;
  }

  public static getInstance(): MCPClient {
    if (!MCPClient.instance) {
      MCPClient.instance = new MCPClient();
    }
    return MCPClient.instance;
  }

  private async fetchMCP(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      next: { 
        revalidate: 60 // Cache pendant 60 secondes
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Méthodes d'API
  async getNetworkSummary() {
    return this.fetchMCP('/network/summary');
  }

  async getNodeStats(nodeId: string) {
    return this.fetchMCP(`/network/node/${nodeId}/stats`);
  }

  async getNodeHistory(nodeId: string) {
    return this.fetchMCP(`/network/node/${nodeId}/history`);
  }

  async getNetworkCentralities() {
    return this.fetchMCP('/network/centralities');
  }

  async optimizeNode(nodeId: string) {
    return this.fetchMCP(`/network/node/${nodeId}/optimize`, {
      method: 'POST',
      next: { revalidate: 0 } // Ne pas mettre en cache les POST
    });
  }
} 