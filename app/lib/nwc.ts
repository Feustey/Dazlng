"use client";

import { NDKNip07Signer } from "@nostr-dev-kit/ndk";

interface WebLNBalance {
  balance: number;
}

interface WebLNInvoice {
  paymentRequest: string;
}

interface WebLNProvider {
  getBalance(): Promise<WebLNBalance>;
  sendPayment(paymentRequest: string): Promise<void>;
  makeInvoice(args: { amount: number; memo?: string }): Promise<WebLNInvoice>;
}

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

      if (typeof window !== "undefined" && "webln" in window) {
        this.webln = (window as any).webln as WebLNProvider;
        console.log("Connexion NWC établie avec le pubkey:", pubkey);
        return true;
      } else {
        throw new Error("WebLN non disponible dans le navigateur");
      }
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
      return response.balance;
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

  async createInvoice(amount: number, description?: string): Promise<string> {
    try {
      if (!this.webln) {
        throw new Error("Non connecté à NWC");
      }
      const response = await this.webln.makeInvoice({
        amount,
        memo: description || "",
      });
      return response.paymentRequest;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }
  }
}
