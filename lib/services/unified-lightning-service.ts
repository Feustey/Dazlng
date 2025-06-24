import { createLightningService } from './lightning-service';
import type { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';

export enum InvoiceStatus {
  pending = "pending",
  settled = "settled",
  expired = "expired",
  failed = "failed"
}
import type { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';
import type { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';
import { createLNBitsService } from './lnbits-service';
import { PaymentLogger } from './payment-logger';
import { WatchInvoiceConfig } from '@/types/lightning';

export interface UnifiedInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface UnifiedInvoiceStatus {
  status: InvoiceStatus.pending | InvoiceStatus.settled | 'cancelled' | InvoiceStatus.expired;
  settledAt?: string;
  amount?: number;
}

export interface UnifiedWalletInfo {
  isOnline: boolean;
  provider: 'lnd' | 'lnbits';
  walletInfo?: {
    balance?: number;
    publicKey?: string;
    alias?: string;
    channels?: number;
    blockHeight?: number;
  };
}

interface ExtendedCreateInvoiceParams extends CreateInvoiceParams {
  metadata?: Record<string, any>;
}

export class UnifiedLightningService {
  private provider: 'lnd' | 'lnbits';
  private lightningService?: ReturnType<typeof createLightningService> | null;
  private lnbitsService?: ReturnType<typeof createLNBitsService> | null;
  private paymentLogger: PaymentLogger | null = null;
  private watchers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.provider = process.env.LIGHTNING_PROVIDER ?? "" === 'lnd' ? 'lnd' : 'lnbits';
    this.paymentLogger = new PaymentLogger();
    this.watchers = new Map();
    this.lightningService = null;
    this.lnbitsService = null;

    // Initialisation des services avec gestion d'erreur
    try {
      if (this.provider === 'lnd') {
        this.lightningService = createLightningService();
      } else {
        this.lnbitsService = createLNBitsService();
      }
    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur initialisation service:', error);
      // Ne pas throw l'erreur, utiliser le fallback
      this.lightningService = null;
      this.lnbitsService = null;
    }
  }

  /**
   * Génère une facture Lightning
   */
  async generateInvoice(params: ExtendedCreateInvoiceParams): Promise<Invoice> {
    try {
      const invoice = await (this ?? Promise.reject(new Error("this is null"))).provider === 'lnd'
        ? this.generateLNDInvoice(params)
        : this.generateLNBitsInvoice(params);

      // Logger la création de la facture
      if (params.metadata?.order_id) {
        await (this ?? Promise.reject(new Error("this is null"))).paymentLogger?.logPayment({
          order_id: params.metadata.order_id as string,
          order_ref: (params.metadata.order_ref as string) || '',
          payment_hash: invoice.paymentHash,
          payment_request: invoice.paymentRequest,
          amount: invoice.amount,
          status: InvoiceStatus.pending,
          metadata: params.metadata
        });
      }

      return invoice;
    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur génération facture:', error);
      throw error;
    }
  }

  /**
   * Surveille une facture avec renouvellement automatique
   */
  async watchInvoiceWithRenewal(
    invoice: Invoice,
    config: WatchInvoiceConfig = {}
  ): Promise<void> {
    const {
      checkInterval = 3000,
      maxAttempts = 120,
      autoRenew = true,
      onPaid,
      onExpired,
      onError,
      onRenewing,
      onRenewed
    } = config;

    let attempts = 0;
    let currentInvoice = invoice;

    // Nettoyer tout watcher existant
    this.clearWatcher(invoice.paymentHash);

    const watcher = setInterval(async () => {
      try {
        attempts++;

        // Vérifier si on a atteint le nombre max de tentatives
        if (attempts >= maxAttempts) {
          this.clearWatcher(currentInvoice.paymentHash);
          onExpired?.();
          return;
        }

        // Vérifier si la facture est expirée
        const expiresAt = new Date(currentInvoice.expiresAt).getTime();
        const now = Date.now();

        // Si la facture expire dans moins de 15 secondes et autoRenew est activé
        if (autoRenew && expiresAt - now < 15000) {
          onRenewing?.();

          // Générer une nouvelle facture
          const newInvoice = await (this ?? Promise.reject(new Error("this is null"))).generateInvoice({
            amount: currentInvoice.amount,
            description: currentInvoice.description,
            metadata: currentInvoice.metadata
          });

          // Mettre à jour la facture courante
          currentInvoice = newInvoice;
          onRenewed?.(newInvoice);

          // Réinitialiser le compteur de tentatives
          attempts = 0;
        }

        // Vérifier le statut
        const status = await (this ?? Promise.reject(new Error("this is null"))).checkInvoiceStatus(currentInvoice.paymentHash);

        if (status === InvoiceStatus.settled) {
          this.clearWatcher(currentInvoice.paymentHash);
          await onPaid?.();
        } else if (status === InvoiceStatus.expired) {
          this.clearWatcher(currentInvoice.paymentHash);
          onExpired?.();
        }

      } catch (error) {
        console.error('❌ UnifiedLightning - Erreur surveillance:', error);
        this.clearWatcher(currentInvoice.paymentHash);
        onError?.(error instanceof Error ? error : new Error('Erreur inconnue'));
      }
    }, checkInterval);

    this.watchers?.set(invoice.paymentHash, watcher);
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus['status']> {
    try {
      const status = await (this ?? Promise.reject(new Error("this is null"))).provider === 'lnd'
        ? this.checkLNDInvoice(paymentHash)
        : this.checkLNBitsInvoice(paymentHash);

      // Mettre à jour le log
      await (this ?? Promise.reject(new Error("this is null"))).paymentLogger?.updateStatus(paymentHash, status);

      return status;
    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur vérification:', error);
      throw error;
    }
  }

  /**
   * Nettoie un watcher
   */
  private clearWatcher(paymentHash: string): void {
    const watcher = this.watchers?.get(paymentHash);
    if (watcher) {
      clearInterval(watcher);
      this.watchers?.delete(paymentHash);
    }
  }

  /**
   * Génère une facture via LND
   */
  private async generateLNDInvoice(params: ExtendedCreateInvoiceParams): Promise<Invoice> {
    if (!this.lightningService) {
      throw new Error('Service LND non initialisé');
    }
    return this.lightningService?.generateInvoice(params);
  }

  /**
   * Génère une facture via LNBits
   */
  private async generateLNBitsInvoice(params: ExtendedCreateInvoiceParams): Promise<Invoice> {
    if (!this.lnbitsService) {
      throw new Error('Service LNBits non initialisé');
    }
    const invoice = await (this ?? Promise.reject(new Error("this is null"))).lnbitsService?.createInvoice(params);
    return {
      id: invoice.checking_id,
      paymentRequest: invoice.payment_request,
      paymentHash: invoice.payment_hash,
      createdAt: invoice.created_at,
      expiresAt: invoice.expires_at,
      amount: invoice.amount,
      description: invoice.description,
      status: {
        status: InvoiceStatus.pending,
        amount: invoice.amount,
        metadata: invoice.metadata || {}
      }
    };
  }

  /**
   * Vérifie une facture via LND
   */
  private async checkLNDInvoice(paymentHash: string): Promise<InvoiceStatus['status']> {
    if (!this.lightningService) {
      throw new Error('Service LND non initialisé');
    }
    const status = await (this ?? Promise.reject(new Error("this is null"))).lightningService?.checkInvoiceStatus(paymentHash);
    return status.status;
  }

  /**
   * Vérifie une facture via LNBits
   */
  private async checkLNBitsInvoice(paymentHash: string): Promise<InvoiceStatus['status']> {
    if (!this.lnbitsService) {
      throw new Error('Service LNBits non initialisé');
    }
    const status = await (this ?? Promise.reject(new Error("this is null"))).lnbitsService?.checkInvoiceStatus(paymentHash);
    return status.status;
  }

  /**
   * Obtient les informations du wallet/nœud
   */
  async getWalletInfo(): Promise<UnifiedWalletInfo> {
    try {
      console.log(`🔍 UnifiedLightning - Informations wallet via ${this.provider}`);

      if (this.provider === 'lnd' && this.lightningService) {
        const health = await (this ?? Promise.reject(new Error("this is null"))).lightningService?.healthCheck();
        
        return {
          isOnline: health.isOnline,
          provider: 'lnd',
          walletInfo: health.nodeInfo ? {
            publicKey: health.nodeInfo.publicKey,
            alias: health.nodeInfo.alias,
            channels: health.nodeInfo.channels,
            blockHeight: health.nodeInfo.blockHeight
          } : undefined
        };

      } else if (this.provider === 'lnbits' && this.lnbitsService) {
        const walletInfo = await (this ?? Promise.reject(new Error("this is null"))).lnbitsService?.getWalletInfo();
        
        return {
          isOnline: true,
          provider: 'lnbits',
          walletInfo: {
            balance: walletInfo.balance,
            alias: walletInfo.name
          }
        };
      }

      return { isOnline: false, provider: this.provider };

    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur récupération wallet:', error);
      return { isOnline: false, provider: this.provider };
    }
  }

  /**
   * Health check unifié
   */
  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    const walletInfo = await (this ?? Promise.reject(new Error("this is null"))).getWalletInfo();
    return {
      isOnline: walletInfo.isOnline,
      provider: this.provider
    };
  }

  /**
   * Ferme les connexions
   */
  async close(): Promise<void> {
    try {
      if (this.provider === 'lnd' && this.lightningService) {
        await (this ?? Promise.reject(new Error("this is null"))).lightningService?.close();
      }
      console.log('✅ UnifiedLightning - Connexions fermées');
    } catch (error) {
      console.warn('⚠️ UnifiedLightning - Erreur fermeture:', error);
    }
  }

  /**
   * Obtient le provider actuel
   */
  getProvider(): 'lnd' | 'lnbits' {
    return this.provider;
  }

  private mapLightningInvoice(invoice: Invoice): UnifiedInvoice {
    return {
      id: invoice.id,
      paymentRequest: invoice.paymentRequest,
      paymentHash: invoice.paymentHash || invoice.id,
      createdAt: invoice.createdAt,
      expiresAt: invoice.expiresAt,
      amount: invoice.amount,
      description: invoice.description,
      metadata: invoice.metadata
    };
  }

  private mapLightningStatus(status: InvoiceStatus): UnifiedInvoiceStatus {
    return {
      status: status.status,
      settledAt: status.settledAt,
      amount: status.amount
    };
  }
}

/**
 * Factory pour créer le service Lightning unifié
 */
export function createUnifiedLightningService(): UnifiedLightningService {
  console.log('🏗️ UnifiedLightning - Initialisation du service unifié...');
  return new UnifiedLightningService();
}

// Export des types
export type { 
  UnifiedInvoice, 
  UnifiedInvoiceStatus, 
  UnifiedWalletInfo 
}
