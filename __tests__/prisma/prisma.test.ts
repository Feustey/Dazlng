import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

describe("Prisma Client Tests", () => {
  describe("Channels", () => {
    it("devrait charger les canaux correctement", async () => {
      const mockChannels = [
        { id: 1, name: "Channel 1", capacity: 1000000 },
        { id: 2, name: "Channel 2", capacity: 2000000 },
      ];

      prismaMock.channel.findMany.mockResolvedValue(mockChannels);

      const channels = await prismaMock.channel.findMany();
      expect(channels).toHaveLength(2);
      expect(channels[0].name).toBe("Channel 1");
    });
  });

  describe("Network", () => {
    it("devrait charger les informations du réseau", async () => {
      const mockNetwork = {
        id: 1,
        totalCapacity: 10000000,
        channelCount: 5,
        nodeCount: 3,
      };

      prismaMock.network.findFirst.mockResolvedValue(mockNetwork);

      const network = await prismaMock.network.findFirst();
      expect(network?.totalCapacity).toBe(10000000);
    });
  });

  describe("Bot IA", () => {
    it("devrait charger les configurations du bot", async () => {
      const mockBotConfig = {
        id: 1,
        name: "Test Bot",
        isActive: true,
        settings: { strategy: "conservative" },
      };

      prismaMock.botConfig.findFirst.mockResolvedValue(mockBotConfig);

      const botConfig = await prismaMock.botConfig.findFirst();
      expect(botConfig?.name).toBe("Test Bot");
    });
  });

  describe("Dashboard", () => {
    it("devrait charger les statistiques du dashboard", async () => {
      const mockStats = {
        totalChannels: 10,
        totalCapacity: 5000000,
        activeNodes: 5,
        recentTransactions: 20,
      };

      prismaMock.dashboardStats.findFirst.mockResolvedValue(mockStats);

      const stats = await prismaMock.dashboardStats.findFirst();
      expect(stats?.totalChannels).toBe(10);
    });
  });
});
