// Tests archivés liés aux fonctionnalités MCP déplacées
// Ces tests ne sont plus utilisés dans l'application principale

// NetworkStats.test.tsx
/* 
import { render, screen } from "@testing-library/react";
import { NetworkStats } from "@/components/network/NetworkStats";
import { getNetworkStats } from "@/services/network.service";

// Mock du service network
jest.mock("@/services/network.service", () => ({
  getNetworkStats: jest.fn(),
}));

describe("NetworkStats", () => {
  const mockStats = {
    totalNodes: 15000,
    totalChannels: 75000,
    totalCapacity: 1000000000,
    avgCapacityPerChannel: 50000,
    avgChannelsPerNode: 5,
    activeNodes: 12000,
    activeChannels: 60000,
    networkGrowth: {
      nodes: 150,
      channels: 750,
      capacity: 10000000,
    },
    capacityHistory: [],
    nodesByCountry: [],
    lastUpdate: new Date(),
  };

  beforeEach(() => {
    (getNetworkStats as jest.Mock).mockResolvedValue(mockStats);
  });

  it("affiche les statistiques correctement", async () => {
    render(<NetworkStats />);

    // Vérifie que les statistiques sont affichées
    expect(await screen.findByText("15,000")).toBeInTheDocument();
    expect(await screen.findByText("75,000")).toBeInTheDocument();
    expect(await screen.findByText("10.0 BTC")).toBeInTheDocument();
    expect(await screen.findByText("+150 nœuds")).toBeInTheDocument();
  });

  it("affiche les statistiques actives", async () => {
    render(<NetworkStats />);

    expect(await screen.findByText("12,000 actifs")).toBeInTheDocument();
    expect(await screen.findByText("60,000 actifs")).toBeInTheDocument();
  });

  it("affiche la capacité moyenne par canal", async () => {
    render(<NetworkStats />);

    expect(await screen.findByText("Moyenne: 0.0005 BTC")).toBeInTheDocument();
  });

  it("gère les erreurs de chargement", async () => {
    (getNetworkStats as jest.Mock).mockRejectedValue(
      new Error("Erreur de chargement")
    );

    render(<NetworkStats />);

    // Vérifie que le composant gère l'erreur gracieusement
    expect(await screen.findByText("N/A")).toBeInTheDocument();
  });
});
*/

// network.service.test.ts
/*
import {
  getNetworkStats,
  getHistoricalStats,
  getPeersOfPeers,
} from "@/services/network.service";
import { supabase } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

// Mock de Supabase
jest.mock("@/utils/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

// Type pour le mock de Supabase
type MockSupabase = {
  from: jest.Mock;
  select: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
  single: jest.Mock;
  eq: jest.Mock;
} & Partial<SupabaseClient>;

describe("Network Service", () => {
  const mockStats = {
    total_nodes: 15000,
    total_channels: 75000,
    total_capacity: 1000000000,
    avg_capacity_per_channel: 50000,
    avg_channels_per_node: 5,
    active_nodes: 12000,
    active_channels: 60000,
    nodes_growth: 150,
    channels_growth: 750,
    capacity_growth: 10000000,
    capacity_history: [],
    nodes_by_country: [],
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNetworkStats", () => {
    it("récupère les statistiques avec succès", async () => {
      const mockSupabase = supabase as unknown as MockSupabase;
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);
      mockSupabase.limit.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: mockStats,
        error: null,
      });

      const stats = await getNetworkStats();

      expect(stats).toEqual({
        totalNodes: mockStats.total_nodes,
        totalChannels: mockStats.total_channels,
        totalCapacity: mockStats.total_capacity,
        avgCapacityPerChannel: mockStats.avg_capacity_per_channel,
        avgChannelsPerNode: mockStats.avg_channels_per_node,
        activeNodes: mockStats.active_nodes,
        activeChannels: mockStats.active_channels,
        networkGrowth: {
          nodes: mockStats.nodes_growth,
          channels: mockStats.channels_growth,
          capacity: mockStats.capacity_growth,
        },
        capacityHistory: mockStats.capacity_history,
        nodesByCountry: mockStats.nodes_by_country,
        lastUpdate: new Date(mockStats.created_at),
      });
    });

    it("gère les erreurs de la base de données", async () => {
      const mockSupabase = supabase as unknown as MockSupabase;
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);
      mockSupabase.limit.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: new Error("Erreur de base de données"),
      });

      await expect(getNetworkStats()).rejects.toThrow(
        "Erreur de base de données"
      );
    });
  });

  describe("getHistoricalStats", () => {
    it("récupère l'historique avec succès", async () => {
      const mockHistory = [
        { ...mockStats, created_at: "2024-01-01" },
        { ...mockStats, created_at: "2024-01-02" },
      ];

      const mockSupabase = supabase as unknown as MockSupabase;
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.order.mockReturnValue(mockSupabase);
      mockSupabase.limit.mockResolvedValue({
        data: mockHistory,
        error: null,
      });

      const history = await getHistoricalStats(2);

      expect(history).toEqual(mockHistory);
      expect(mockSupabase.limit).toHaveBeenCalledWith(2);
    });
  });

  describe("getPeersOfPeers", () => {
    it("récupère les pairs d'un nœud avec succès", async () => {
      const mockPeers = [
        { node_id: "node1", peer_id: "peer1" },
        { node_id: "node1", peer_id: "peer2" },
      ];

      const mockSupabase = supabase as unknown as MockSupabase;
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockResolvedValue({
        data: mockPeers,
        error: null,
      });

      const peers = await getPeersOfPeers("node1");

      expect(peers).toEqual(mockPeers);
      expect(mockSupabase.eq).toHaveBeenCalledWith("node_id", "node1");
    });

    it("retourne un tableau vide en cas d'erreur", async () => {
      const mockSupabase = supabase as unknown as MockSupabase;
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockResolvedValue({
        data: null,
        error: new Error("Erreur de base de données"),
      });

      const peers = await getPeersOfPeers("node1");

      expect(peers).toEqual([]);
    });
  });
});
*/
