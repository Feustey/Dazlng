import { supabase } from "@/lib/supabase";

export async function getPeersOfPeers(nodeId: string) {
  const { data, error } = await supabase.rpc("get_peers_of_peers", {
    node_id: nodeId,
  });

  if (error) throw error;
  return data;
}

export async function getHistoricalStats(days: number = 30) {
  const { data, error } = await supabase.rpc("get_historical_stats", {
    days_back: days,
  });

  if (error) throw error;
  return data;
}

export async function getNodeStats(nodeId: string) {
  const { data, error } = await supabase.rpc("get_node_stats", {
    node_id: nodeId,
  });

  if (error) throw error;
  return data;
}

export async function getNetworkStats() {
  const { data, error } = await supabase
    .from("network_stats")
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
