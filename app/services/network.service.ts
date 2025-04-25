import { supabase } from "@/utils/supabase";

export async function getNetworkStats() {
  const { data, error } = await supabase
    .from("network_stats")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  const {
    total_nodes,
    total_channels,
    total_capacity,
    avg_capacity_per_channel,
    avg_channels_per_node,
    active_nodes,
    active_channels,
    nodes_growth,
    channels_growth,
    capacity_growth,
    capacity_history,
    nodes_by_country,
    created_at,
  } = data;
  return {
    totalNodes: total_nodes,
    totalChannels: total_channels,
    totalCapacity: total_capacity,
    avgCapacityPerChannel: avg_capacity_per_channel,
    avgChannelsPerNode: avg_channels_per_node,
    activeNodes: active_nodes,
    activeChannels: active_channels,
    networkGrowth: {
      nodes: nodes_growth,
      channels: channels_growth,
      capacity: capacity_growth,
    },
    capacityHistory: capacity_history,
    nodesByCountry: nodes_by_country,
    lastUpdate: new Date(created_at),
  };
}

export async function getHistoricalStats(limitCount: number) {
  const { data, error } = await supabase
    .from("network_stats")
    .select("*")
    .order("timestamp", { ascending: true })
    .limit(limitCount);
  if (error) throw error;
  return data;
}

export async function getPeersOfPeers(nodeId: string) {
  const { data, error } = await supabase
    .from("network_peers")
    .select("*")
    .eq("node_id", nodeId);
  if (error || !data) {
    return [];
  }
  return data;
}
