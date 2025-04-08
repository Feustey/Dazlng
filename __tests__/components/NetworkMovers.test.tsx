import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../utils/test-utils";
import NetworkMovers from "../../app/components/NetworkMovers";
import { networkService } from "../../app/services/networkService";

// Mock du service réseau
vi.mock("../../app/services/networkService", () => ({
  networkService: {
    getNetworkMovements: vi.fn(),
  },
}));

describe("NetworkMovers", () => {
  const mockMovements = [
    {
      id: "1",
      name: "ACINQ",
      capacity: "+132.29 BTC",
      capacityChange: "57.5%",
      channels: "+196",
      channelsChange: "42.9%",
      timestamp: "2024-03-14T12:00:00Z",
    },
    {
      id: "2",
      name: "Kraken",
      capacity: "-45.12 BTC",
      capacityChange: "-12.3%",
      channels: "-23",
      channelsChange: "-5.1%",
      timestamp: "2024-03-14T12:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (networkService.getNetworkMovements as jest.Mock).mockResolvedValue(
      mockMovements
    );
  });

  it("renders the component with title", () => {
    render(<NetworkMovers />);
    expect(screen.getByText("Mouvements du Réseau")).toBeInTheDocument();
  });

  it("displays tabs for different time periods", () => {
    render(<NetworkMovers />);
    expect(screen.getByText("Quotidien")).toBeInTheDocument();
    expect(screen.getByText("Hebdomadaire")).toBeInTheDocument();
    expect(screen.getByText("Mensuel")).toBeInTheDocument();
  });

  it("fetches and displays network movements", async () => {
    render(<NetworkMovers />);

    await waitFor(() => {
      expect(networkService.getNetworkMovements).toHaveBeenCalledWith("daily");
    });

    expect(screen.getByText("ACINQ")).toBeInTheDocument();
    expect(screen.getByText("+132.29 BTC")).toBeInTheDocument();
    expect(screen.getByText("+196")).toBeInTheDocument();
  });

  it("changes period when clicking on tabs", async () => {
    render(<NetworkMovers />);

    const weeklyTab = screen.getByText("Hebdomadaire");
    fireEvent.click(weeklyTab);

    await waitFor(() => {
      expect(networkService.getNetworkMovements).toHaveBeenCalledWith("weekly");
    });
  });

  it("displays loading state", () => {
    (networkService.getNetworkMovements as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<NetworkMovers />);
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("displays error state", async () => {
    (networkService.getNetworkMovements as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<NetworkMovers />);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur lors du chargement des données")
      ).toBeInTheDocument();
    });
  });

  it("displays capacity increases section", async () => {
    render(<NetworkMovers />);

    await waitFor(() => {
      expect(screen.getByText("Augmentations de Capacité")).toBeInTheDocument();
      expect(screen.getByText("ACINQ")).toBeInTheDocument();
      expect(screen.getByText("+57.5%")).toBeInTheDocument();
    });
  });

  it("displays capacity decreases section", async () => {
    render(<NetworkMovers />);

    await waitFor(() => {
      expect(screen.getByText("Diminutions de Capacité")).toBeInTheDocument();
      expect(screen.getByText("Kraken")).toBeInTheDocument();
      expect(screen.getByText("-12.3%")).toBeInTheDocument();
    });
  });
});
