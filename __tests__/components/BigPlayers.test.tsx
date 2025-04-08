import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../utils/test-utils";
import BigPlayers from "../../app/components/BigPlayers";
import { networkService } from "../../app/services/networkService";

// Mock du service réseau
vi.mock("../../app/services/networkService", () => ({
  networkService: {
    getTopNodes: vi.fn(),
  },
}));

describe("BigPlayers", () => {
  const mockNodes = [
    { rank: 1, name: "ACINQ", channels: 3421, capacity: 591.4, pubkey: "abc" },
    { rank: 2, name: "Kraken", channels: 1173, capacity: 264.4, pubkey: "def" },
    {
      rank: 3,
      name: "Bitfinex",
      channels: 987,
      capacity: 198.2,
      pubkey: "ghi",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (networkService.getTopNodes as jest.Mock).mockResolvedValue(mockNodes);
  });

  it("renders the component with title", () => {
    render(<BigPlayers />);
    expect(screen.getByText("Big Players")).toBeInTheDocument();
  });

  it("displays tabs for different time periods", () => {
    render(<BigPlayers />);
    expect(screen.getByText("Quotidien")).toBeInTheDocument();
    expect(screen.getByText("Hebdomadaire")).toBeInTheDocument();
  });

  it("fetches and displays top nodes", async () => {
    render(<BigPlayers />);

    await waitFor(() => {
      expect(networkService.getTopNodes).toHaveBeenCalledWith("daily");
    });

    expect(screen.getByText("ACINQ")).toBeInTheDocument();
    expect(screen.getByText("3421")).toBeInTheDocument();
    expect(screen.getByText("591.4 BTC")).toBeInTheDocument();
  });

  it("changes period when clicking on tabs", async () => {
    render(<BigPlayers />);

    const weeklyTab = screen.getByText("Hebdomadaire");
    fireEvent.click(weeklyTab);

    await waitFor(() => {
      expect(networkService.getTopNodes).toHaveBeenCalledWith("weekly");
    });
  });

  it("displays loading state", () => {
    (networkService.getTopNodes as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<BigPlayers />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("displays error state", async () => {
    (networkService.getTopNodes as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<BigPlayers />);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors du chargement des données")
      ).toBeInTheDocument();
    });
  });

  it("displays nodes in correct order", async () => {
    render(<BigPlayers />);

    await waitFor(() => {
      const nodes = screen.getAllByTestId("player-row");
      expect(nodes).toHaveLength(3);
      expect(nodes[0]).toHaveTextContent("ACINQ");
      expect(nodes[1]).toHaveTextContent("Kraken");
      expect(nodes[2]).toHaveTextContent("Bitfinex");
    });
  });

  it("displays node metrics correctly", async () => {
    render(<BigPlayers />);

    await waitFor(() => {
      const firstNode = screen
        .getByText("ACINQ")
        .closest("[data-testid='player-row']");
      expect(firstNode).toHaveTextContent("3421");
      expect(firstNode).toHaveTextContent("591.4 BTC");
    });
  });
});
