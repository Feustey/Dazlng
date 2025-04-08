import { NetworkNode, NetworkChannel, NetworkStats } from "../types/network";
import { mcpService } from "./mcpService";

export class NodeService {
  // Récupérer tous les nœuds
  async getNodes(): Promise<NetworkNode[]> {
    try {
      // Utiliser MCP pour récupérer les nœuds
      const nodes = await mcpService.getNodeInfo("all");

      // Transformer les données MCP en format attendu par notre interface
      return nodes.map((node: any) => ({
        publicKey: node.id,
        alias: node.name || "Unknown",
        color: node.color || "#000000",
        addresses: node.addresses || [],
        lastUpdate: new Date(node.timestamp),
        capacity: node.capacity || 0,
        channelCount: node.channels || 0,
        avgChannelSize: node.channels > 0 ? node.capacity / node.channels : 0,
        city: node.city,
        country: node.country,
        isp: node.isp,
        platform: node.platform || undefined,
      }));
    } catch (error) {
      console.error("Error fetching nodes from MCP:", error);
      throw error;
    }
  }

  // Récupérer les détails d'un nœud
  async getNodeDetails(pubkey: string): Promise<NetworkNode | null> {
    try {
      const node = await mcpService.getNodeInfo(pubkey);

      if (!node) return null;

      return {
        publicKey: node.id,
        alias: node.name || "Unknown",
        color: node.color || "#000000",
        addresses: node.addresses || [],
        lastUpdate: new Date(node.timestamp),
        capacity: node.capacity || 0,
        channelCount: node.channels || 0,
        avgChannelSize: node.channels > 0 ? node.capacity / node.channels : 0,
        city: node.city,
        country: node.country,
        isp: node.isp,
        platform: node.platform || undefined,
        betweennessRank: node.betweennessRank,
        eigenvectorRank: node.eigenvectorRank,
        closenessRank: node.closenessRank,
        avgFeeRate: node.avgFeeRate,
        uptime: node.uptime,
      };
    } catch (error) {
      console.error("Error fetching node details from MCP:", error);
      throw error;
    }
  }

  // Récupérer les canaux d'un nœud
  async getNodeChannels(nodeId: string): Promise<NetworkChannel[]> {
    try {
      const channels = await mcpService.getNodeChannels(nodeId);

      return channels.map((channel: any) => ({
        channelId: channel.id,
        node1Pub: channel.node1Id,
        node2Pub: channel.node2Id,
        capacity: channel.capacity || 0,
        lastUpdate: new Date(channel.timestamp),
        status: channel.status || "active",
      }));
    } catch (error) {
      console.error("Error fetching node channels from MCP:", error);
      throw error;
    }
  }

  // Récupérer les statistiques du réseau
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      // Utiliser MCP pour récupérer les statistiques du réseau
      const networkStats = await mcpService.getNodeStats("network");

      // Récupérer les nœuds pour les statistiques par pays
      const nodes = await this.getNodes();

      // Calculer les statistiques par pays
      const nodesByCountry = nodes.reduce(
        (acc: Record<string, number>, node) => {
          const country = node.country || "unknown";
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Récupérer l'historique des capacités
      const capacityHistory = await this.getCapacityHistory();

      return {
        totalNodes: networkStats.totalNodes || 0,
        totalChannels: networkStats.totalChannels || 0,
        totalCapacity: (networkStats.totalCapacity || 0).toString(),
        avgChannelSize: (networkStats.avgChannelSize || 0).toString(),
        avgCapacityPerChannel: networkStats.avgChannelSize || 0,
        avgChannelsPerNode:
          networkStats.totalChannels && networkStats.totalNodes
            ? networkStats.totalChannels / networkStats.totalNodes
            : 0,
        topNodes: nodes.slice(0, 10),
        recentChannels: nodes.slice(10, 20).map((node) => ({
          channelId: node.publicKey,
          node1Pub: "",
          node2Pub: node.publicKey,
          capacity: node.capacity,
          lastUpdate: node.lastUpdate,
          status: "active" as const,
        })),
        nodesByCountry,
        capacityHistory,
      };
    } catch (error) {
      console.error("Error fetching network stats from MCP:", error);
      throw error;
    }
  }

  // Récupérer l'historique des capacités
  async getCapacityHistory(): Promise<{ date: Date; value: number }[]> {
    try {
      // Utiliser MCP pour récupérer l'historique des capacités
      const history = await mcpService.getNodeStats("history");

      return history.map((item: any) => ({
        date: new Date(item.timestamp),
        value: item.capacity || 0,
      }));
    } catch (error) {
      console.error("Error fetching capacity history from MCP:", error);
      return [];
    }
  }

  // Fonction utilitaire pour calculer l'âge d'un nœud
  calculateAge(createdAt: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} jours`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} an${years > 1 ? "s" : ""}`;
    }
  }
}

export const nodeService = new NodeService();
