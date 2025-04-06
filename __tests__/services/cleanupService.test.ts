import { CleanupService } from "../../app/lib/services/cleanupService";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    node: {
      deleteMany: jest.fn(),
    },
    peerOfPeer: {
      deleteMany: jest.fn(),
    },
    capacityHistory: {
      deleteMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe("CleanupService", () => {
  let cleanupService: CleanupService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanupService = new CleanupService();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe("cleanupNodes", () => {
    it("devrait nettoyer les nœuds plus vieux que NODE_RETENTION_DAYS", async () => {
      const mockDeleteMany = jest.fn().mockResolvedValue({ count: 5 });
      mockPrisma.node.deleteMany = mockDeleteMany;

      await cleanupService["cleanupNodes"]();

      expect(mockDeleteMany).toHaveBeenCalled();
      const whereClause = mockDeleteMany.mock.calls[0][0].where;
      expect(whereClause.createdAt.lt).toBeInstanceOf(Date);
    });

    it("devrait gérer les erreurs de nettoyage des nœuds", async () => {
      mockPrisma.node.deleteMany.mockRejectedValue(new Error("DB Error"));

      await expect(cleanupService["cleanupNodes"]()).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("cleanupPeersOfPeers", () => {
    it("devrait nettoyer les pairs plus vieux que PEER_RETENTION_DAYS", async () => {
      const mockDeleteMany = jest.fn().mockResolvedValue({ count: 3 });
      mockPrisma.peerOfPeer.deleteMany = mockDeleteMany;

      await cleanupService["cleanupPeersOfPeers"]();

      expect(mockDeleteMany).toHaveBeenCalled();
      const whereClause = mockDeleteMany.mock.calls[0][0].where;
      expect(whereClause.createdAt.lt).toBeInstanceOf(Date);
    });

    it("devrait gérer les erreurs de nettoyage des pairs", async () => {
      mockPrisma.peerOfPeer.deleteMany.mockRejectedValue(new Error("DB Error"));

      await expect(cleanupService["cleanupPeersOfPeers"]()).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("cleanupHistory", () => {
    it("devrait nettoyer l'historique plus vieux que HISTORY_RETENTION_DAYS", async () => {
      const mockDeleteMany = jest.fn().mockResolvedValue({ count: 10 });
      mockPrisma.capacityHistory.deleteMany = mockDeleteMany;

      await cleanupService["cleanupHistory"]();

      expect(mockDeleteMany).toHaveBeenCalled();
      const whereClause = mockDeleteMany.mock.calls[0][0].where;
      expect(whereClause.timestamp.lt).toBeInstanceOf(Date);
    });

    it("devrait gérer les erreurs de nettoyage de l'historique", async () => {
      mockPrisma.capacityHistory.deleteMany.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(cleanupService["cleanupHistory"]()).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("performCleanup", () => {
    it("devrait effectuer un nettoyage complet", async () => {
      const mockNodeDelete = jest.fn().mockResolvedValue({ count: 5 });
      const mockPeerDelete = jest.fn().mockResolvedValue({ count: 3 });
      const mockHistoryDelete = jest.fn().mockResolvedValue({ count: 10 });

      mockPrisma.node.deleteMany = mockNodeDelete;
      mockPrisma.peerOfPeer.deleteMany = mockPeerDelete;
      mockPrisma.capacityHistory.deleteMany = mockHistoryDelete;

      await cleanupService.performCleanup();

      expect(mockNodeDelete).toHaveBeenCalled();
      expect(mockPeerDelete).toHaveBeenCalled();
      expect(mockHistoryDelete).toHaveBeenCalled();
    });
  });

  describe("startPeriodicCleanup", () => {
    it("devrait démarrer le nettoyage périodique", () => {
      jest.useFakeTimers();
      cleanupService.startPeriodicCleanup(1);
      expect(setInterval).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("ne devrait pas démarrer un nouveau nettoyage si un est déjà actif", () => {
      cleanupService["cleanupInterval"] = setInterval(() => {}, 1000);
      cleanupService.startPeriodicCleanup();
      expect(setInterval).not.toHaveBeenCalled();
    });
  });

  describe("stopPeriodicCleanup", () => {
    it("devrait arrêter le nettoyage périodique", () => {
      const mockInterval = setInterval(() => {}, 1000);
      cleanupService["cleanupInterval"] = mockInterval;
      cleanupService.stopPeriodicCleanup();
      expect(clearInterval).toHaveBeenCalledWith(mockInterval);
      expect(cleanupService["cleanupInterval"]).toBeNull();
    });
  });
});
