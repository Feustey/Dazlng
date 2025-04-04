import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { WebLNProvider } from "@webbtc/webln-types";

export class NWCConnector {
  private connectionString: string;
  private webln: WebLNProvider | null = null;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect() {
    try {
      const signer = new NDKNip07Signer();
      // Extraire le pubkey et le secret de la chaîne de connexion
      const url = new URL(this.connectionString);
      const pubkey = url.pathname.slice(2); // Enlever le '//'
      const secret = url.searchParams.get("secret");

      if (!secret) {
        throw new Error("Secret manquant dans la chaîne de connexion NWC");
      }

      // TODO: Implémenter la logique de connexion NWC
      console.log("Connexion NWC établie avec le pubkey:", pubkey);

      return true;
    } catch (error) {
      console.error("Erreur lors de la connexion NWC:", error);
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    try {
      if (!this.webln) {
        throw new Error("Non connecté à NWC");
      }
      const response = await this.webln.getBalance();
      return response.balance || 0;
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
      throw error;
    }
  }

  async makePayment(invoice: string): Promise<void> {
    try {
      if (!this.webln) {
        throw new Error("Non connecté à NWC");
      }
      await this.webln.sendPayment(invoice);
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      throw error;
    }
  }

  async createInvoice(amount: number, description: string): Promise<string> {
    try {
      if (!this.webln) {
        throw new Error("Non connecté à NWC");
      }
      const response = await this.webln.makeInvoice({
        amount,
        defaultDescription: description,
      });
      return response.paymentRequest;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }
  }
}
