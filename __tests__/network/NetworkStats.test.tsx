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

    expect(await screen.findByText("(12,000 actifs)")).toBeInTheDocument();
    expect(await screen.findByText("(60,000 actifs)")).toBeInTheDocument();
  });

  it("affiche la capacité moyenne par canal", async () => {
    render(<NetworkStats />);

    expect(await screen.findByText("Moyenne: 0.0 BTC")).toBeInTheDocument();
  });

  it("gère les erreurs de chargement", async () => {
    (getNetworkStats as jest.Mock).mockRejectedValue(
      new Error("Erreur de chargement")
    );

    render(<NetworkStats />);

    // Vérifie que le composant gère l'erreur gracieusement
    expect(await screen.findAllByText("N/A")).toHaveLength(2);
  });
});
