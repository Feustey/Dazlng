import { describe, it, expect, vi, beforeEach } from "vitest";
import { networkService } from "../../src/app/services/networkService";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("NetworkService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("getNetworkStats", () => {
    it("fetches network stats successfully", async () => {
      const mockStats = {
        totalNodes: 10000,
        totalChannels: 50000,
        totalCapacity: 1000000000,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats),
      });

      const stats = await networkService.getNetworkStats();
      expect(stats).toEqual(mockStats);
      expect(mockFetch).toHaveBeenCalledWith("/api/network/stats");
    });

    it("handles network stats fetch error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(networkService.getNetworkStats()).rejects.toThrow(
        "HTTP error!"
      );
    });
  });

  describe("getTopNodes", () => {
    it("fetches top nodes successfully", async () => {
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

      const nodes = await networkService.getTopNodes("daily");
      expect(nodes).toEqual(mockNodes);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/network/top-nodes?period=daily"
      );
    });

    it("handles top nodes fetch error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(networkService.getTopNodes("daily")).rejects.toThrow(
        "HTTP error!"
      );
    });
  });

  describe("getNetworkMovements", () => {
    it("fetches network movements successfully", async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovements),
      });

      const movements = await networkService.getNetworkMovements("daily");
      expect(movements).toEqual(mockMovements);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/network/movements?period=daily"
      );
    });

    it("handles network movements fetch error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(networkService.getNetworkMovements("daily")).rejects.toThrow(
        "HTTP error!"
      );
    });
  });

  describe("searchNodes", () => {
    it("searches nodes successfully", async () => {
      const mockNodes = [
        {
          rank: 1,
          name: "ACINQ",
          channels: 3421,
          capacity: 591.4,
          pubkey: "abc",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNodes),
      });

      const nodes = await networkService.searchNodes("ACINQ");
      expect(nodes).toEqual(mockNodes);
      expect(mockFetch).toHaveBeenCalledWith("/api/network/search?q=ACINQ");
    });

    it("handles search error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(networkService.searchNodes("ACINQ")).rejects.toThrow(
        "HTTP error!"
      );
    });
  });
});
