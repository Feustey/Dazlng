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

// Statistiques actuelles du réseau
export const mockCurrentStats = {
  total_nodes: 12500,
  total_channels: 84000,
  total_capacity: 4800000000000,
  avg_capacity_per_channel: 57142857,
  avg_channels_per_node: 6.72,
  timestamp: new Date().toISOString(),
};

// Données historiques
export const mockHistoricalData = {
  dates: [
    "2023-01-01",
    "2023-02-01",
    "2023-03-01",
    "2023-04-01",
    "2023-05-01",
    "2023-06-01",
  ],
  nodes: [11000, 11200, 11500, 11800, 12000, 12500],
  channels: [70000, 72000, 75000, 78000, 81000, 84000],
  capacity: [
    4000000000000, 4100000000000, 4300000000000, 4500000000000, 4600000000000,
    4800000000000,
  ],
};

// Résumé du réseau
export const mockNetworkSummary = {
  total_nodes: 12500,
  active_nodes: 10200,
  total_channels: 84000,
  active_channels: 72000,
  total_capacity: 4800000000000,
  largest_node: {
    pubkey:
      "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b",
    alias: "ACINQ",
    channels: 2847,
  },
  timestamp: new Date().toISOString(),
};
