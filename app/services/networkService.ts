import { NetworkStats } from "@/types/network";

interface TopNode {
  publicKey: string;
  alias: string;
  capacity: number;
  channels: number;
}

interface NetworkMovement {
  date: string;
  value: number;
}

interface SearchResult {
  publicKey: string;
  alias: string;
  capacity: number;
  channels: number;
  country?: string;
}

export const networkService = {
  async getNetworkStats(): Promise<NetworkStats> {
    const res = await fetch("/api/network/stats");
    if (!res.ok) {
      throw new Error("HTTP error!");
    }
    return res.json();
  },

  async getTopNodes(period: string): Promise<TopNode[]> {
    const res = await fetch(`/api/network/top-nodes?period=${period}`);
    if (!res.ok) {
      throw new Error("HTTP error!");
    }
    return res.json();
  },

  async getNetworkMovements(period: string): Promise<NetworkMovement[]> {
    const res = await fetch(`/api/network/movements?period=${period}`);
    if (!res.ok) {
      throw new Error("HTTP error!");
    }
    return res.json();
  },

  async searchNodes(query: string): Promise<SearchResult[]> {
    const res = await fetch(`/api/network/search?q=${query}`);
    if (!res.ok) {
      throw new Error("HTTP error!");
    }
    return res.json();
  },
};
