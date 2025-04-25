// app/lib/mockData.ts
// Fichier de données fictives pour les tests et le développement

// Données fictives pour les statistiques réseau
export const mockNetworkStats = {
  nodes_count: 12500,
  channels_count: 35800,
  capacity: "1250000000000", // en sats
  avg_channel_size: "3500000", // en sats
  avg_channels_per_node: 5.72,
  top_nodes: [
    {
      alias: "ACINQ",
      pubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      capacity: "125000000",
      channels: 100,
    },
    {
      alias: "Bitfinex",
      pubkey:
        "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
      capacity: "110000000",
      channels: 85,
    },
    {
      alias: "River Financial",
      pubkey:
        "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
      capacity: "95000000",
      channels: 78,
    },
  ],
  timestamp: new Date().toISOString(),
};

// Données fictives pour les nœuds
export const mockNodes = [
  {
    pubkey:
      "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
    alias: "ACINQ",
    color: "#ff9900",
    last_update: 1650000000,
    addresses: ["127.0.0.1:9735"],
    features: {},
  },
  {
    pubkey:
      "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
    alias: "Bitfinex",
    color: "#3399ff",
    last_update: 1650100000,
    addresses: ["127.0.0.1:9736"],
    features: {},
  },
  {
    pubkey:
      "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
    alias: "River Financial",
    color: "#33cc33",
    last_update: 1650200000,
    addresses: ["127.0.0.1:9737"],
    features: {},
  },
];

// Données fictives pour les commandes
export const mockOrders = [
  {
    id: "ord_123456",
    user_id: "usr_789012",
    product_id: "prod_345678",
    amount: 150000,
    currency: "sat",
    status: "completed",
    created_at: "2023-05-15T14:30:00Z",
    updated_at: "2023-05-15T14:35:00Z",
  },
  {
    id: "ord_234567",
    user_id: "usr_789012",
    product_id: "prod_456789",
    amount: 250000,
    currency: "sat",
    status: "pending",
    created_at: "2023-05-16T10:15:00Z",
    updated_at: "2023-05-16T10:15:00Z",
  },
];

// Données fictives pour les utilisateurs
export const mockUsers = [
  {
    id: "usr_789012",
    email: "user@example.com",
    name: "John Doe",
    created_at: "2023-01-10T08:00:00Z",
    updated_at: "2023-04-20T15:45:00Z",
  },
  {
    id: "usr_890123",
    email: "jane@example.com",
    name: "Jane Smith",
    created_at: "2023-02-15T09:30:00Z",
    updated_at: "2023-04-25T11:20:00Z",
  },
];

// Données fictives pour les produits
export const mockProducts = [
  {
    id: "prod_345678",
    name: "DazNode Basic",
    description: "Nœud Lightning de base pour débutants",
    price: 150000,
    currency: "sat",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "prod_456789",
    name: "DazNode Pro",
    description: "Nœud Lightning professionnel avec fonctionnalités avancées",
    price: 250000,
    currency: "sat",
    created_at: "2023-01-01T00:00:00Z",
  },
];
