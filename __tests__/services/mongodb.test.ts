import { describe, it, expect, vi, beforeEach } from "vitest";
import { connectToDatabase } from "../../app/lib/mongodb";
import mongoose, { Connection } from "mongoose";

vi.mock("mongoose", () => ({
  connect: vi.fn(),
  connection: {
    readyState: 1,
  },
}));

describe("MongoDB Connection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.mongoose = { conn: null, promise: null };
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
  });

  describe("connectToDatabase", () => {
    it("devrait se connecter à la base de données avec succès", async () => {
      const mockConnection = {
        readyState: 1,
        collection: vi.fn(),
        model: vi.fn(),
        models: {},
        db: {},
      } as unknown as Connection;

      (mongoose.connect as jest.Mock).mockResolvedValue({
        connection: mockConnection,
      });

      const connection = await connectToDatabase();
      expect(connection).toBeDefined();
      expect(mongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/test",
        { bufferCommands: false }
      );
    });

    it("devrait réutiliser une connexion existante", async () => {
      const mockConnection = {
        readyState: 1,
        collection: vi.fn(),
        model: vi.fn(),
        models: {},
        db: {},
      } as unknown as Connection;

      global.mongoose.conn = mockConnection;

      const connection = await connectToDatabase();
      expect(connection).toBe(mockConnection);
      expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it("devrait réutiliser une promesse de connexion en cours", async () => {
      const mockConnection = {
        readyState: 1,
        collection: vi.fn(),
        model: vi.fn(),
        models: {},
        db: {},
      } as unknown as Connection;

      const mockPromise = Promise.resolve(mockConnection);
      global.mongoose.promise = mockPromise;

      const connection = await connectToDatabase();
      expect(connection).toBe(mockConnection);
      expect(mongoose.connect).not.toHaveBeenCalled();
    });

    it("devrait gérer les erreurs de connexion", async () => {
      (mongoose.connect as jest.Mock).mockRejectedValue(
        new Error("Connection failed")
      );

      await expect(connectToDatabase()).rejects.toThrow("Connection failed");
      expect(global.mongoose.promise).toBeNull();
    });

    it("devrait gérer l'absence de MONGODB_URI", async () => {
      process.env.MONGODB_URI = "";

      await expect(connectToDatabase()).rejects.toThrow(
        "La variable d'environnement MONGODB_URI est requise"
      );
    });
  });

  describe("État de la connexion", () => {
    it("devrait maintenir l'état de la connexion dans le cache global", async () => {
      const mockConnection = {
        readyState: 1,
        collection: vi.fn(),
        model: vi.fn(),
        models: {},
        db: {},
      } as unknown as Connection;

      (mongoose.connect as jest.Mock).mockResolvedValue({
        connection: mockConnection,
      });

      await connectToDatabase();
      expect(global.mongoose.conn).toBeDefined();
      expect(global.mongoose.promise).toBeDefined();
    });

    it("devrait réinitialiser la promesse en cas d'erreur", async () => {
      (mongoose.connect as jest.Mock).mockRejectedValue(
        new Error("Connection failed")
      );

      try {
        await connectToDatabase();
      } catch (error) {
        expect(global.mongoose.promise).toBeNull();
      }
    });
  });
});
