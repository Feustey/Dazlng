export interface NodeStats {
  pubkey: string;
  alias: string;
  color: string;
  platform: string;
  version: string;
  address: string;
  opened_channel_count: number;
  active_channel_count: number;
  closed_channel_count: number;
  pending_channel_count: number;
  total_capacity: number;
  avg_capacity: number;
  total_volume: number;
  total_fees: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  avg_fee_rate_ppm: number;
  total_peers: number;
  uptime: number;
  last_update: string;
}

export interface HistoricalData {
  timestamp: string;
  total_capacity: number;
  active_channels: number;
  total_volume: number;
  total_fees: number;
  total_peers: number;
}

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
const API_URL = "https://api.sparkseer.space/v1";

export async function getCurrentStats(): Promise<NodeStats> {
  const response = await fetch(`${API_URL}/node/current-stats/${PUBKEY}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SPARKSEER_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch node stats');
  }

  return response.json();
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  const response = await fetch(`${API_URL}/node/historical/${PUBKEY}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SPARKSEER_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }

  return response.json();
}