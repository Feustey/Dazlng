import { Node, NetworkStats } from "@/app/types/network";

export const networkService = {
  async getNodes(): Promise<Node[]> {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching nodes:", error);
      throw error;
    }
  },

  async getNodeDetails(nodeId: string): Promise<Node> {
    try {
      const response = await fetch(`/api/nodes/${nodeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching node details:", error);
      throw error;
    }
  },

  async getNodeChannels(nodeId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/nodes/${nodeId}/channels`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching node channels:", error);
      throw error;
    }
  },

  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const response = await fetch("/api/network/stats");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching network stats:", error);
      throw error;
    }
  },
};
