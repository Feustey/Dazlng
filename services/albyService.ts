import { Client, auth } from "@getalby/sdk";
import { envVars } from "@/app/lib/env";
import { connectToMongoose } from "@/app/lib/mongoose";
import { ICheckoutSession } from "@/models/CheckoutSession";
import User, { IUser } from "@/models/User";
import crypto from "crypto";
import CheckoutSession from "@/models/CheckoutSession";

export class AlbyService {
  private client: Client;
  private static instance: AlbyService;

  private constructor() {
    const authClient = new auth.OAuth2User({
      client_id: process.env.NEXT_PUBLIC_ALBY_PUBLIC_KEY || "",
      client_secret: process.env.ALBY_SECRET || "",
      callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/alby`,
      scopes: ["invoices:read", "invoices:create"],
      user_agent: "DazLng/1.0.0",
    });
    this.client = new Client(authClient);
  }

  public static async getInstance(): Promise<AlbyService> {
    if (!AlbyService.instance) {
      await connectToMongoose();
      AlbyService.instance = new AlbyService();
    }
    return AlbyService.instance;
  }

  /**
   * Crée une nouvelle facture Lightning
   */
  async createInvoice(params: { amount: number; memo: string }) {
    try {
      const response = await this.client.createInvoice({
        amount: params.amount,
        description: params.memo,
      });
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }
  }

  /**
   * Crée un nouveau webhook
   */
  async createWebhook(params: {
    url: string;
    description: string;
    filterTypes: string[];
  }) {
    try {
      return await this.client.createWebhookEndpoint({
        url: params.url,
        description: params.description,
        filter_types: params.filterTypes,
      });
    } catch (error) {
      console.error("Erreur lors de la création du webhook:", error);
      throw error;
    }
  }

  /**
   * Récupère les clés Nostr de l'utilisateur
   */
  async getNostrKeys() {
    try {
      const accountInfo = await this.client.accountInformation({});
      return {
        pubkey: accountInfo.nostr_pubkey,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des clés Nostr:", error);
      throw error;
    }
  }

  /**
   * Vérifie la signature d'un webhook
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      // La vérification de la signature doit être implémentée selon les spécifications d'Alby
      // https://guides.getalby.com/alby-wallet-api/reference/webhooks
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(payload);
      const calculatedSignature = hmac.digest("hex");
      return calculatedSignature === signature;
    } catch (error) {
      console.error("Erreur lors de la vérification de la signature:", error);
      return false;
    }
  }

  /**
   * Envoie un paiement Lightning
   */
  async sendPayment(params: { invoice: string }) {
    try {
      return await this.client.sendPayment({
        invoice: params.invoice,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du paiement:", error);
      throw error;
    }
  }

  /**
   * Gère les webhooks de paiement
   */
  async handlePaymentWebhook(payload: any) {
    try {
      const { invoice, status, payment_hash } = payload;

      if (status === "paid") {
        // Rechercher la session de paiement correspondante
        const session = await CheckoutSession.findOne({
          paymentUrl: { $regex: payment_hash },
        });

        if (session) {
          // Mettre à jour le statut de la session
          session.status = "completed";
          await session.save();

          // Si c'est un abonnement, mettre à jour le statut de l'utilisateur
          const sessionData = session.toObject();
          if (sessionData.plan === "subscription") {
            await User.findByIdAndUpdate(session.userId, {
              $set: {
                subscriptionStatus: "active",
                subscriptionEndDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ), // 1 an
              },
            });
          }

          // Envoyer une notification (à implémenter selon vos besoins)
          await this.sendPaymentNotification(session);
        }
      }
    } catch (error) {
      console.error("Erreur lors du traitement du webhook:", error);
      throw error;
    }
  }

  /**
   * Envoie une notification de paiement
   */
  private async sendPaymentNotification(session: any) {
    try {
      // Implémenter l'envoi de notification selon vos besoins
      // Par exemple : email, push notification, etc.
      console.log(
        "Notification de paiement envoyée pour la session:",
        session._id
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
    }
  }

  /**
   * Supprime un webhook
   */
  async deleteWebhook(endpointId: string) {
    try {
      return await this.client.deleteWebhookEndpoint(endpointId);
    } catch (error) {
      console.error("Erreur lors de la suppression du webhook:", error);
      throw error;
    }
  }

  async checkInvoiceStatus(invoice: string) {
    try {
      const response = await this.client.getInvoice(invoice);
      return response.status;
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
      throw error;
    }
  }
}

// Exporter une instance par défaut
let albyServiceInstance: AlbyService | null = null;

export const getAlbyService = async () => {
  if (!albyServiceInstance) {
    albyServiceInstance = await AlbyService.getInstance();
  }
  return albyServiceInstance;
};
