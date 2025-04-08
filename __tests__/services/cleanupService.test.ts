import { jest } from "@jest/globals";
import { CleanupService } from "../../lib/services/cleanupService";
import { connectToDatabase } from "../../app/lib/mongodb";
import mongoose from "mongoose";

// Mock MongoDB
jest.mock("../../app/lib/mongodb");

const mockCollection = {
  deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
};

const mockConnection = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

(connectToDatabase as jest.Mock).mockResolvedValue(mockConnection);

describe("CleanupService", () => {
  let cleanupService: CleanupService;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanupService = CleanupService.getInstance();
  });

  describe("performCleanup", () => {
    it("devrait supprimer les sessions expirées", async () => {
      await cleanupService.performCleanup();
      expect(connectToDatabase).toHaveBeenCalled();
      expect(mockConnection.collection).toHaveBeenCalledWith("sessions");
      expect(mockCollection.deleteMany).toHaveBeenCalledWith({
        expiresAt: {
          $lt: expect.any(Date),
        },
      });
    });
  });

  describe("cleanupOldData", () => {
    it("devrait nettoyer les données anciennes", async () => {
      const result = await cleanupService.cleanupOldData();
      expect(connectToDatabase).toHaveBeenCalled();
      expect(result).toEqual({
        sessionsDeleted: 1,
      });
    });

    it("devrait gérer les erreurs de nettoyage", async () => {
      mockCollection.deleteMany.mockRejectedValueOnce(new Error("DB Error"));
      await expect(cleanupService.cleanupOldData()).rejects.toThrow("DB Error");
    });
  });
});
