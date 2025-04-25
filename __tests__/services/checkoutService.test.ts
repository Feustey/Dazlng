import { rest } from "msw";
import { server } from "../mocks/server";
import { checkoutService } from "@/services/checkoutService";
import type { CheckoutSessionData } from "@/services/checkoutService";

describe("Service de paiement", () => {
  describe("createSession", () => {
    it("devrait créer une session de paiement avec succès", async () => {
      const mockData: CheckoutSessionData = {
        userId: "123",
        amount: 1000,
      };

      const mockSession = { id: "session_123", ...mockData };

      server.use(
        rest.post("/api/checkout/session", async () => {
          return {
            json: () => mockSession,
          };
        })
      );

      const session = await checkoutService.createSession(mockData);
      expect(session).toEqual(mockSession);
    });

    it("devrait gérer les erreurs lors de la création de session", async () => {
      server.use(
        rest.post("/api/checkout/session", () => {
          return {
            status: 500,
          };
        })
      );

      await expect(
        checkoutService.createSession({
          userId: "123",
          amount: 1000,
        })
      ).rejects.toThrow("Failed to create checkout session");
    });
  });

  describe("getSession", () => {
    it("devrait récupérer une session existante", async () => {
      const mockSession = {
        id: "session_123",
        userId: "123",
        amount: 1000,
      };

      server.use(
        rest.get("/api/checkout/session/:sessionId", () => {
          return {
            json: () => mockSession,
          };
        })
      );

      const session = await checkoutService.getSession("session_123");
      expect(session).toEqual(mockSession);
    });

    it("devrait gérer les erreurs lors de la récupération de session", async () => {
      server.use(
        rest.get("/api/checkout/session/:sessionId", () => {
          return {
            status: 404,
          };
        })
      );

      await expect(checkoutService.getSession("invalid_id")).rejects.toThrow(
        "Failed to get checkout session"
      );
    });
  });

  describe("updateSession", () => {
    it("devrait mettre à jour une session existante", async () => {
      const updateData = {
        amount: 2000,
      };

      const mockUpdatedSession = {
        id: "session_123",
        userId: "123",
        ...updateData,
      };

      server.use(
        rest.patch("/api/checkout/session/:sessionId", () => {
          return {
            json: () => mockUpdatedSession,
          };
        })
      );

      const session = await checkoutService.updateSession(
        "session_123",
        updateData
      );
      expect(session).toEqual(mockUpdatedSession);
    });

    it("devrait gérer les erreurs lors de la mise à jour de session", async () => {
      server.use(
        rest.patch("/api/checkout/session/:sessionId", () => {
          return {
            status: 500,
          };
        })
      );

      await expect(
        checkoutService.updateSession("session_123", { amount: 2000 })
      ).rejects.toThrow("Failed to update checkout session");
    });
  });

  describe("processPayment", () => {
    it("devrait traiter le paiement avec succès", async () => {
      const mockSession = {
        id: "session_123",
        amount: 1000,
      };

      const mockInvoice = {
        payment_request: "lnbc...",
      };

      server.use(
        rest.get("/api/checkout/session/:sessionId", () => {
          return {
            json: () => mockSession,
          };
        }),
        rest.post("/api/alby/invoice", () => {
          return {
            json: () => mockInvoice,
          };
        }),
        rest.patch("/api/checkout/session/:sessionId", () => {
          return {
            json: () => ({
              ...mockSession,
              paymentInfo: { paymentUrl: mockInvoice.payment_request },
            }),
          };
        })
      );

      const result = await checkoutService.processPayment("session_123");
      expect(result).toEqual(mockInvoice);
    });

    it("devrait gérer les erreurs lors du traitement du paiement", async () => {
      server.use(
        rest.get("/api/checkout/session/:sessionId", () => {
          return {
            status: 500,
          };
        })
      );

      await expect(
        checkoutService.processPayment("session_123")
      ).rejects.toThrow("Failed to get checkout session");
    });
  });
});
