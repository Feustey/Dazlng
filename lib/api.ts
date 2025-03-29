export interface NodeStats {
  pubkey: string;
  alias: string;
  color: string;
  platform: string;
  version: string;
  address: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channels: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  betweenness_rank: number;
  eigenvector_rank: number;
  closeness_rank: number;
  weighted_betweenness_rank: number;
  weighted_closeness_rank: number;
  weighted_eigenvector_rank: number;
  last_update: string;
}

export interface HistoricalData {
  timestamp: string;
  total_fees: number;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  total_volume: number;
}

export async function getCurrentStats(): Promise<NodeStats> {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch current stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques actuelles:', error);
    throw error;
  }
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  try {
    const response = await fetch('/api/historical');
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error);
    throw error;
  }
}