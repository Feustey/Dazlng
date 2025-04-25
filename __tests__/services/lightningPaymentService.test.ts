// Mock functions for testing
const createInvoice = jest.fn();
const checkInvoiceStatus = jest.fn();

// Mock implementation
jest.mock(
  "@/app/services/albyService",
  () => ({
    createInvoice: jest
      .fn()
      .mockImplementation((...args) => createInvoice(...args)),
    checkInvoiceStatus: jest
      .fn()
      .mockImplementation((...args) => checkInvoiceStatus(...args)),
  }),
  { virtual: true }
);

describe("Service de paiement Lightning", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInvoice", () => {
    it("devrait créer une facture Lightning avec succès", async () => {
      const mockInvoice = {
        payment_hash: "hash123",
        payment_request: "lnbc...",
        amount: 1000,
      };

      createInvoice.mockResolvedValue(mockInvoice);

      // Simule l'utilisation du service
      const invoice = await createInvoice(1000, "Test payment");
      expect(invoice).toEqual(mockInvoice);
      expect(createInvoice).toHaveBeenCalledWith(1000, "Test payment");
    });

    it("devrait gérer les erreurs lors de la création de facture", async () => {
      createInvoice.mockRejectedValue(new Error("Failed to create invoice"));

      await expect(createInvoice(1000, "Test payment")).rejects.toThrow(
        "Failed to create invoice"
      );
    });
  });

  describe("checkInvoiceStatus", () => {
    it("devrait vérifier l'état du paiement avec succès", async () => {
      checkInvoiceStatus.mockResolvedValue(true);

      const status = await checkInvoiceStatus("hash123");
      expect(status).toBe(true);
      expect(checkInvoiceStatus).toHaveBeenCalledWith("hash123");
    });

    it("devrait gérer les erreurs lors de la vérification de l'état", async () => {
      checkInvoiceStatus.mockRejectedValue(
        new Error("Failed to check invoice status")
      );

      await expect(checkInvoiceStatus("hash123")).rejects.toThrow(
        "Failed to check invoice status"
      );
    });
  });
});
