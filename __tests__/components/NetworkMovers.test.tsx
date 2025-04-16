import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../utils/test-utils";
import NetworkMovers from "../../app/components/network/NetworkMovers";

// Mock fetch
global.fetch = jest.fn();

describe("NetworkMovers", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("affiche les mouvements du réseau", async () => {
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
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMovements),
    });

    render(<NetworkMovers />);

    await waitFor(() => {
      expect(screen.getByText("ACINQ")).toBeInTheDocument();
      expect(screen.getByText("+132.29 BTC")).toBeInTheDocument();
      expect(screen.getByText("+196")).toBeInTheDocument();
    });
  });

  it("gère les erreurs de chargement", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Erreur de chargement")
    );

    render(<NetworkMovers />);

    await waitFor(() => {
      expect(
        screen.getByText("Erreur de chargement des données")
      ).toBeInTheDocument();
    });
  });

  it("permet de changer la période", async () => {
    render(<NetworkMovers />);

    const periodSelect = screen.getByLabelText("Période");
    fireEvent.change(periodSelect, { target: { value: "weekly" } });

    expect(fetch).toHaveBeenCalledWith("/api/network/movements?period=weekly");
  });
});
