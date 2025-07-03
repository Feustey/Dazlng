import { createLightningService } from './lightning-service';
import { PaymentLogger } from './payment-logger';
import type { 
  Invoice, 
  CreateInvoiceParams, 
  InvoiceStatus
} from '@/types/lightning';

// Enum local pour éviter les conflits
export enum UnifiedInvoiceStatus {
  PENDING = 'pending',
  SETTLED = 'settled',
  EXPIRED = 'expired',
  FAILED = 'failed'
}

// Types unifiés
export interface UnifiedInvoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  createdAt: string;
  expiresAt: string;
  settledAt?: string;
}

export interface UnifiedInvoiceStatusResponse {
  status: InvoiceStatus;
  amount: number;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}

export interface UnifiedWalletInfo {
  isOnline: boolean;
  provider: string;
  nodeInfo?: {
    publicKey: string;
    alias: string;
    channels: number;
    blockHeight: number;
  };
}

// Service Lightning unifié
export class UnifiedLightningService {
  private lightningService: any;
  private paymentLogger: PaymentLogger;
  private provider: string;

  constructor() {
    // Détecter le provider Lightning
    this.provider = process.env.LIGHTNING_PROVIDER ?? 'lnd';
    
    // Créer les services
    this.lightningService = createLightningService();
    this.paymentLogger = new PaymentLogger();
  }

  async createInvoice(params: CreateInvoiceParams): Promise<UnifiedInvoice> {
    try {
      // Créer la facture
      const invoice = await this.lightningService.createInvoice(params);
      
      // Logger le paiement
      await this.paymentLogger.logPayment({
        payment_hash: invoice.paymentHash,
        payment_request: invoice.paymentRequest,
        amount: invoice.amount,
        description: params.description,
        metadata: params.metadata || {}
      });

      return {
        id: invoice.id || `invoice_${Date.now()}`,
        paymentHash: invoice.paymentHash,
        paymentRequest: invoice.paymentRequest,
        amount: invoice.amount,
        description: invoice.description,
        status: invoice.status,
        createdAt: invoice.createdAt,
        expiresAt: invoice.expiresAt,
        settledAt: invoice.settledAt
      };
    } catch (error) {
      console.error('❌ UnifiedLightningService - Erreur création facture:', error);
      throw error;
    }
  }

  async checkInvoice(paymentHash: string): Promise<UnifiedInvoiceStatusResponse> {
    try {
      const invoice = await this.lightningService.checkInvoice(paymentHash);
      
      const status: UnifiedInvoiceStatusResponse = {
        status: invoice.status,
        amount: invoice.amount,
        settledAt: invoice.settledAt,
        metadata: {}
      };

      // Mettre à jour le statut dans les logs
      await this.paymentLogger.updatePaymentStatus(paymentHash, status.status as unknown as 'pending' | 'settled' | 'failed' | 'expired');

      return status;
    } catch (error) {
      console.error('❌ UnifiedLightningService - Erreur vérification facture:', error);
      throw error;
    }
  }

  async watchInvoice(paymentHash: string, config?: { timeout?: number; interval?: number }): Promise<UnifiedInvoiceStatusResponse> {
    try {
      const status = await this.lightningService.watchInvoice(paymentHash, config);
      
      return {
        status: status.status,
        amount: status.amount,
        settledAt: status.settledAt,
        metadata: {}
      };
    } catch (error) {
      console.error('❌ UnifiedLightningService - Erreur surveillance facture:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<UnifiedWalletInfo> {
    try {
      const health = await this.lightningService.healthCheck();
      
      return {
        isOnline: health.isOnline,
        provider: this.provider,
        nodeInfo: health.nodeInfo ? {
          publicKey: health.nodeInfo.publicKey,
          alias: health.nodeInfo.alias,
          channels: health.nodeInfo.channels,
          blockHeight: health.nodeInfo.blockHeight
        } : undefined
      };
    } catch (error) {
      console.error('❌ UnifiedLightningService - Erreur health check:', error);
      return {
        isOnline: false,
        provider: this.provider
      };
    }
  }

  async close(): Promise<void> {
    try {
      await this.lightningService?.close?.();
    } catch (error) {
      console.error('❌ UnifiedLightningService - Erreur fermeture:', error);
    }
  }

  // Méthodes utilitaires
  getProvider(): string {
    return this.provider;
  }

  isOnline(): Promise<boolean> {
    return this.healthCheck().then(health => health.isOnline);
  }

  // Alias pour compatibilité avec les scripts de test
  async generateInvoice(params: CreateInvoiceParams): Promise<UnifiedInvoice> {
    return this.createInvoice(params);
  }

  async checkInvoiceStatus(paymentHash: string): Promise<UnifiedInvoiceStatusResponse> {
    return this.checkInvoice(paymentHash);
  }

  async getWalletInfo(): Promise<UnifiedWalletInfo> {
    return this.healthCheck();
  }
}

// Fonction de création du service
export function createUnifiedLightningService(): UnifiedLightningService {
  return new UnifiedLightningService();
}
