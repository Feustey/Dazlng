import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@utils/test-utils";
import BigPlayers from "../../app/components/network/BigPlayers";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("BigPlayers", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("affiche les grands acteurs du réseau", async () => {
    const mockNodes = [
      {
        rank: 1,
        name: "ACINQ",
        channels: 3421,
        capacity: 591.4,
        pubkey: "abc",
      },
      {
        rank: 2,
        name: "Kraken",
        channels: 1173,
        capacity: 264.4,
        pubkey: "def",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockNodes),
    });

    render(<BigPlayers />);

    await waitFor(() => {
      expect(screen.getByText("ACINQ")).toBeInTheDocument();
      expect(screen.getByText("Kraken")).toBeInTheDocument();
      expect(screen.getByText("3,421")).toBeInTheDocument();
      expect(screen.getByText("591.4 BTC")).toBeInTheDocument();
    });
  });

  it("gère les erreurs de chargement", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Erreur de chargement"));

    render(<BigPlayers />);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur de chargement des données")
      ).toBeInTheDocument();
    });
  });

  it("permet de changer la période", async () => {
    render(<BigPlayers />);

    const periodSelect = screen.getByLabelText("Période");
    fireEvent.change(periodSelect, { target: { value: "weekly" } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/network/top-nodes?period=weekly")
    );
  });
});
