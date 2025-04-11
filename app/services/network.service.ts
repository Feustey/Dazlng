import { supabase } from "@/utils/supabase";

export interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  activeNodes: number;
  activeChannels: number;
  networkGrowth: {
    nodes: number;
    channels: number;
    capacity: number;
  };
}

export async function getCurrentStats(): Promise<NetworkStats> {
  const db = await connectToDatabase();

  // Pour l'instant, retournons des données de démonstration
  return {
    totalNodes: 15000,
    totalChannels: 85000,
    totalCapacity: 5000000000,
    avgCapacityPerChannel: 58823,
    avgChannelsPerNode: 5.67,
    activeNodes: 12000,
    activeChannels: 75000,
    networkGrowth: {
      nodes: 150,
      channels: 850,
      capacity: 50000000,
    },
  };
}

export async function getNetworkStats() {
  try {
    const client = await clientPromise;
    const db = client.db("dazlng");
    const stats = await db.collection("network_stats").findOne({});
    return stats;
  } catch (error) {
    console.error("Error fetching network stats:", error);
    throw error;
  }
}
