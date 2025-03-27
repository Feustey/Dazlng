export interface NodeStats {
  total_capacity: number;
  active_channel_count: number;
  avg_fee_rate_ppm: number;
  last_update: string;
}

export interface HistoricalData {
  timestamp: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

export async function getCurrentStats(): Promise<NodeStats> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch current stats');
  }
  return response.json();
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  const response = await fetch('/api/historical');
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  return response.json();
}