import { toast } from "sonner";

/**
 * Types pour le traitement des sessions de paiement
 */
export interface CheckoutSessionData {
  id: string;
  amount: number;
  currency: string;
  productId?: string;
  paymentMethod: "lightning" | "btc" | "card";
  status: "created" | "pending" | "paid" | "expired" | "failed";
  customerEmail?: string;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface CreateCheckoutSessionRequest {
  amount: number;
  currency: string;
  productId?: string;
  paymentMethod: "lightning" | "btc" | "card";
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  status: string;
  message?: string;
  error?: string;
}

export interface PaymentDetails {
  sessionId: string;
  invoiceId?: string;
  paymentRequest?: string; // bolt11 pour Lightning
  paymentAddress?: string; // adresse BTC pour paiement on-chain
  amount: number;
  currency: string;
  expiresAt: string;
  status: string;
}

/**
 * Service de paiement pour le traitement des sessions
 */
const checkoutService = {
  /**
   * Créer une nouvelle session de paiement
   */
  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de création de session");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur de création de session de paiement:", error);
      toast.error("Erreur lors de la création de la session de paiement");
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une session de paiement
   */
  async getPaymentDetails(sessionId: string): Promise<PaymentDetails> {
    try {
      const response = await fetch(`/api/checkout/session/${sessionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur de récupération des détails de paiement"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur de récupération des détails de paiement:", error);
      toast.error("Erreur lors de la récupération des détails de paiement");
      throw error;
    }
  },

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(sessionId: string): Promise<{
    status: string;
    paid: boolean;
  }> {
    try {
      const response = await fetch(`/api/check-payment?sessionId=${sessionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur de vérification du paiement"
        );
      }

      const data = await response.json();
      return {
        status: data.status,
        paid: data.status === "paid",
      };
    } catch (error) {
      console.error("Erreur de vérification du statut de paiement:", error);
      return {
        status: "error",
        paid: false,
      };
    }
  },
};

export { checkoutService };
