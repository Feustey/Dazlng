import { describe, expect, jest, test } from "@jest/globals";
import { supabase } from "../../app/lib/supabase";
import { cleanupExpiredSessions } from "../../app/services/cleanupService";

// Mock Supabase
jest.mock("../../app/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
  },
}));

describe("cleanupService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete expired sessions", async () => {
    // Arrange
    const mockNow = new Date();
    jest.spyOn(global, "Date").mockImplementation(() => mockNow);

    // Act
    await cleanupExpiredSessions();

    // Assert
    expect(supabase.from).toHaveBeenCalledWith("sessions");
    expect(supabase.delete).toHaveBeenCalled();
    expect(supabase.lt).toHaveBeenCalledWith("expires", mockNow.toISOString());
  });

  test("should handle errors gracefully", async () => {
    // Arrange
    const mockError = new Error("Database error");
    (supabase.from as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // Act & Assert
    await expect(cleanupExpiredSessions()).rejects.toThrow(mockError);
  });
});
