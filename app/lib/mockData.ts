import { NetworkStats } from "../services/network.service";

export const mockNetworkStats: NetworkStats = {
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

export const mockNetworkSummary = {
  ...mockNetworkStats,
  version: "1.0.0",
};

export const mockHistoricalData = {
  nodes: [
    { date: "2024-01-01", value: 14000 },
    { date: "2024-02-01", value: 14500 },
    { date: "2024-03-01", value: 15000 },
  ],
  channels: [
    { date: "2024-01-01", value: 80000 },
    { date: "2024-02-01", value: 82500 },
    { date: "2024-03-01", value: 85000 },
  ],
  capacity: [
    { date: "2024-01-01", value: 4500000000 },
    { date: "2024-02-01", value: 4750000000 },
    { date: "2024-03-01", value: 5000000000 },
  ],
};

// Données fictives de centralités pour le développement
export const mockCentralities = {
  betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  last_update: new Date().toISOString(),
};
