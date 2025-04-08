import { connectToDatabase } from "../../app/lib/mongodb";
import mongoose from "mongoose";

jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({
    connection: {
      collection: jest.fn().mockReturnValue({
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    },
  }),
}));

describe("MongoDB Connection Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devrait se connecter à MongoDB avec succès", async () => {
    const connection = await connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(connection).toBeDefined();
  });

  it("devrait réutiliser la connexion existante", async () => {
    const connection1 = await connectToDatabase();
    const connection2 = await connectToDatabase();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(connection1).toBe(connection2);
  });

  it("devrait gérer les erreurs de connexion", async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Connection error")
    );
    await expect(connectToDatabase()).rejects.toThrow("Connection error");
  });
});
