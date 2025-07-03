import { createLightningService } from './lightning-service';
import { PaymentLogger } from './payment-logger';
import type { 
  Invoice, 
  CreateInvoiceParams, 
  InvoiceStatus 
} from '@/types/lightning';

// Configuration du wallet DazNode
interface DazNodeWalletConfig {
  walletSecret?: string;
  walletPublicKey?: string;
  appPublicKey?: string;
  relayUrl?: string;
}

// Service wallet DazNode
export class DazNodeWalletService {
  private config: DazNodeWalletConfig;
  private lightningService: any;
  private paymentLogger: PaymentLogger;

  constructor(config: DazNodeWalletConfig = {}) {
    this.config = {
      walletSecret: process.env.DAZNODE_WALLET_SECRET,
      walletPublicKey: 'de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30',
      appPublicKey: '69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697',
      relayUrl: 'wss://relay.getalby.com/v1',
      ...config
    };

    this.lightningService = createLightningService();
    this.paymentLogger = new PaymentLogger();
  }

  /**
   * Génère une facture Lightning
   */
  async createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      // Utiliser le service Lightning standard
      const invoice = await this.lightningService.createInvoice(params);
      
      // Logger le paiement
      await this.paymentLogger.logPayment({
        payment_hash: invoice.paymentHash,
        payment_request: invoice.paymentRequest,
        amount: invoice.amount,
        description: params.description,
        metadata: params.metadata || {}
      });

      return invoice;
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur création facture:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoice(paymentHash: string): Promise<Invoice> {
    try {
      const invoice = await this.lightningService.checkInvoice(paymentHash);
      
      // Mettre à jour le statut dans les logs
      await this.paymentLogger.updatePaymentStatus(paymentHash, invoice.status as unknown as 'pending' | 'settled' | 'failed' | 'expired');

      return invoice;
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur vérification facture:', error);
      throw error;
    }
  }

  /**
   * Surveille une facture
   */
  async watchInvoice(paymentHash: string, config?: { timeout?: number; interval?: number }): Promise<Invoice> {
    try {
      const invoice = await this.lightningService.watchInvoice(paymentHash, config);
      return invoice;
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur surveillance facture:', error);
      throw error;
    }
  }

  /**
   * Vérifie la santé du wallet
   */
  async healthCheck(): Promise<{ isOnline: boolean; provider: string; nodeInfo?: any }> {
    try {
      const health = await this.lightningService.healthCheck();
      
      return {
        isOnline: health.isOnline,
        provider: 'daznode',
        nodeInfo: health.nodeInfo ? {
          publicKey: this.config.walletPublicKey,
          alias: 'DazNode Wallet',
          channels: health.nodeInfo.channels,
          blockHeight: health.nodeInfo.blockHeight
        } : undefined
      };
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur health check:', error);
      return {
        isOnline: false,
        provider: 'daznode'
      };
    }
  }

  /**
   * Obtient le solde du wallet
   */
  async getBalance(): Promise<{ balance: number; currency: string }> {
    try {
      // Simulation du solde pour le moment
      return {
        balance: 0,
        currency: 'sats'
      };
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur récupération solde:', error);
      return {
        balance: 0,
        currency: 'sats'
      };
    }
  }

  /**
   * Ferme les connexions
   */
  async close(): Promise<void> {
    try {
      await this.lightningService?.close?.();
    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur fermeture:', error);
    }
  }

  /**
   * Obtient la configuration du wallet
   */
  getConfig(): DazNodeWalletConfig {
    return { ...this.config };
  }
}

// Fonction de création du service
export function createDazNodeWalletService(config?: DazNodeWalletConfig): DazNodeWalletService {
  return new DazNodeWalletService(config);
}
