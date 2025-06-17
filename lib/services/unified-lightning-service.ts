import { createLightningService, LightningInvoice, CreateInvoiceParams, InvoiceStatus } from './lightning-service';
import { createLNBitsService } from './lnbits-service';
import { PaymentLogger } from './payment-logger';
import {
  WatchInvoiceConfig
} from '@/types/lightning';

interface UnifiedInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

interface UnifiedInvoiceStatus {
  status: 'pending' | 'settled' | 'cancelled' | 'expired';
  settledAt?: string;
  amount?: number;
}

interface UnifiedWalletInfo {
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
  private lightningService?: ReturnType<typeof createLightningService>;
  private lnbitsService?: ReturnType<typeof createLNBitsService>;
  private paymentLogger: PaymentLogger;
  private watchers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.provider = process.env.LIGHTNING_PROVIDER === 'lnd' ? 'lnd' : 'lnbits';
    this.paymentLogger = new PaymentLogger();
    this.watchers = new Map();

    // Initialisation des services
    try {
      if (this.provider === 'lnd') {
        this.lightningService = createLightningService();
      } else {
        this.lnbitsService = createLNBitsService();
      }
    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur initialisation service:', error);
      throw error;
    }
  }

  /**
   * Génère une facture Lightning
   */
  async generateInvoice(params: ExtendedCreateInvoiceParams): Promise<LightningInvoice> {
    try {
      const invoice = await this.provider === 'lnd'
        ? this.generateLNDInvoice(params)
        : this.generateLNBitsInvoice(params);

      // Logger la création de la facture
      if (params.metadata?.order_id) {
        await this.paymentLogger.logPayment({
          order_id: params.metadata.order_id,
          order_ref: params.metadata.order_ref || '',
          payment_hash: invoice.paymentHash,
          payment_request: invoice.paymentRequest,
          amount: invoice.amount,
          status: 'pending',
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
    invoice: LightningInvoice,
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
          const newInvoice = await this.generateInvoice({
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
        const status = await this.checkInvoiceStatus(currentInvoice.paymentHash);

        if (status === 'settled') {
          this.clearWatcher(currentInvoice.paymentHash);
          await onPaid?.();
        } else if (status === 'expired') {
          this.clearWatcher(currentInvoice.paymentHash);
          onExpired?.();
        }

      } catch (error) {
        console.error('❌ UnifiedLightning - Erreur surveillance:', error);
        this.clearWatcher(currentInvoice.paymentHash);
        onError?.(error instanceof Error ? error : new Error('Erreur inconnue'));
      }
    }, checkInterval);

    this.watchers.set(invoice.paymentHash, watcher);
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const status = await this.provider === 'lnd'
        ? this.checkLNDInvoice(paymentHash)
        : this.checkLNBitsInvoice(paymentHash);

      // Mettre à jour le log
      await this.paymentLogger.updateStatus(paymentHash, status);

      return status;
    } catch (error) {
      console.error('❌ UnifiedLightning - Erreur vérification:', error);
      throw error;
    }
  }

  /**
   * Nettoie un watcher
   */
  private clearWatcher(paymentHash: string) {
    const watcher = this.watchers.get(paymentHash);
    if (watcher) {
      clearInterval(watcher);
      this.watchers.delete(paymentHash);
    }
  }

  /**
   * Génère une facture via LND
   */
  private async generateLNDInvoice(params: ExtendedCreateInvoiceParams): Promise<LightningInvoice> {
    if (!this.lightningService) {
      throw new Error('Service LND non initialisé');
    }
    return this.lightningService.generateInvoice(params);
  }

  /**
   * Génère une facture via LNBits
   */
  private async generateLNBitsInvoice(params: ExtendedCreateInvoiceParams): Promise<LightningInvoice> {
    if (!this.lnbitsService) {
      throw new Error('Service LNBits non initialisé');
    }
    const invoice = await this.lnbitsService.createInvoice(params);
    return {
      id: invoice.checking_id,
      paymentRequest: invoice.payment_request,
      paymentHash: invoice.payment_hash,
      createdAt: invoice.created_at,
      expiresAt: invoice.expires_at,
      amount: invoice.amount,
      description: invoice.description
    };
  }

  /**
   * Vérifie une facture via LND
   */
  private async checkLNDInvoice(paymentHash: string): Promise<InvoiceStatus> {
    if (!this.lightningService) {
      throw new Error('Service LND non initialisé');
    }
    return this.lightningService.checkInvoiceStatus(paymentHash);
  }

  /**
   * Vérifie une facture via LNBits
   */
  private async checkLNBitsInvoice(paymentHash: string): Promise<InvoiceStatus> {
    if (!this.lnbitsService) {
      throw new Error('Service LNBits non initialisé');
    }
    return this.lnbitsService.checkInvoiceStatus(paymentHash);
  }

  /**
   * Obtient les informations du wallet/nœud
   */
  async getWalletInfo(): Promise<UnifiedWalletInfo> {
    try {
      console.log(`🔍 UnifiedLightning - Informations wallet via ${this.provider}`);

      if (this.provider === 'lnd' && this.lightningService) {
        const health = await this.lightningService.healthCheck();
        
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
        const walletInfo = await this.lnbitsService.getWalletInfo();
        
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
    const walletInfo = await this.getWalletInfo();
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
        await this.lightningService.close();
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

  private mapLightningInvoice(invoice: LightningInvoice): UnifiedInvoice {
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
}; 