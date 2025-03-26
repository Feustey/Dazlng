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
  return response.json();
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  const response = await fetch('/api/history');
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  return response.json();
}