export interface NodeStats {
  alias: string;
  pubkey: string;
  platform: string;
  version: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channel_count: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  last_update: string;
  color: string;
  address: string;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
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
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch current stats');
  }
  const data = await response.json();
  return data.current;
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  const data = await response.json();
  return data.historical.map((item: any) => ({
    timestamp: item.timestamp,
    total_fees: item.total_fees,
    total_capacity: item.total_capacity,
    active_channels: item.active_channel_count,
    total_peers: item.total_peers,
    total_volume: item.total_volume
  }));
}