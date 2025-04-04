"use client";

/**
 * Données fictives pour le développement et les tests
 * À utiliser quand l'API MCP n'est pas disponible
 */

export const mockNodes = [
  {
    pubkey:
      "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b",
    alias: "ACINQ",
    capacity: 256000000000,
    channels: 2847,
    last_update: 1629482892,
  },
  {
    pubkey:
      "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
    alias: "BITFINEX",
    capacity: 198000000000,
    channels: 1248,
    last_update: 1629482892,
  },
  {
    pubkey:
      "03271338633d2d37b285dae4df40b413d8c6c164d3e44116b3ec030edc816cd280",
    alias: "Lightning Labs",
    capacity: 178000000000,
    channels: 1986,
    last_update: 1629482892,
  },
  {
    pubkey:
      "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226",
    alias: "Kraken",
    capacity: 156000000000,
    channels: 986,
    last_update: 1629482892,
  },
  {
    pubkey:
      "02d4531a2f2e6e5a9033d37d548cff4834a3898e74c3abe1985b493c42ebbd707d",
    alias: "Nodl",
    capacity: 124000000000,
    channels: 753,
    last_update: 1629482892,
  },
  {
    pubkey:
      "02c91d6aa51aa940608b497b6beebcb1aec05be3c47704b682b3889424679ca490",
    alias: "CoinGate",
    capacity: 112000000000,
    channels: 689,
    last_update: 1629482892,
  },
  {
    pubkey:
      "036b53093df5a932deac828cca6d663472dbc88322b05eec1d42b26ab9b16caa1c",
    alias: "OpenNode",
    capacity: 96000000000,
    channels: 542,
    last_update: 1629482892,
  },
  {
    pubkey:
      "027a31c958a3f8de159c1d97944a48ce3db2fdeaf5e5e8945034210abb5f5c7e1f",
    alias: "LN+",
    capacity: 82000000000,
    channels: 425,
    last_update: 1629482892,
  },
  {
    pubkey:
      "0242a4ae0c5bef18048fbecf995094b74bfb0f7391418d71ed394784373f41e4f3",
    alias: "LN Markets",
    capacity: 73000000000,
    channels: 387,
    last_update: 1629482892,
  },
  {
    pubkey:
      "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226",
    alias: "Bitrefill",
    capacity: 68000000000,
    channels: 356,
    last_update: 1629482892,
  },
];

// Données fictives pour les pairs d'un nœud
export const mockPeers = {
  peers_of_peers: [
    {
      pubkey:
        "036b53093df5a932deac828cca6d663472dbc88322b05eec1d42b26ab9b16caa1c",
      alias: "OpenNode",
      capacity: 96000000000,
      channels: 542,
    },
    {
      pubkey:
        "027a31c958a3f8de159c1d97944a48ce3db2fdeaf5e5e8945034210abb5f5c7e1f",
      alias: "LN+",
      capacity: 82000000000,
      channels: 425,
    },
    {
      pubkey:
        "0242a4ae0c5bef18048fbecf995094b74bfb0f7391418d71ed394784373f41e4f3",
      alias: "LN Markets",
      capacity: 73000000000,
      channels: 387,
    },
  ],
};

// Données fictives pour les statistiques actuelles du réseau
export const mockNetworkStats = {
  totalNodes: 15000,
  totalChannels: 75000,
  totalCapacity: 5000000000000, // 5000 BTC en sats
  avgCapacityPerChannel: 66666666, // ~0.66 BTC en sats
  avgChannelsPerNode: 5,
  timestamp: new Date().toISOString(),
};

// Données fictives pour les données historiques
export const mockHistoricalData = {
  dates: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse(),
  nodes: Array.from({ length: 30 }, () => 15000),
  channels: Array.from({ length: 30 }, () => 75000),
  capacity: Array.from({ length: 30 }, () => 5000),
};

// Données fictives pour le résumé du réseau
export const mockNetworkSummary = {
  totalNodes: 15000,
  totalChannels: 75000,
  totalCapacity: 5000000000000, // 5000 BTC en sats
  avgCapacityPerChannel: 66666666, // ~0.66 BTC en sats
  avgChannelsPerNode: 5,
  activeNodes: 14500,
  activeChannels: 72000,
  networkGrowth: {
    nodes: 150,
    channels: 750,
    capacity: 50000000000, // 50 BTC en sats
  },
  topNodes: [
    {
      pubkey:
        "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b",
      alias: "ACINQ",
      capacity: 256000000000,
      channels: 2847,
    },
    {
      pubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      alias: "BITFINEX",
      capacity: 198000000000,
      channels: 1248,
    },
    {
      pubkey:
        "03271338633d2d37b285dae4df40b413d8c6c164d3e44116b3ec030edc816cd280",
      alias: "Lightning Labs",
      capacity: 178000000000,
      channels: 1986,
    },
  ],
  timestamp: new Date().toISOString(),
};
