import { createLightningService, LightningInvoice, CreateInvoiceParams, InvoiceStatus } from './lightning-service';
import { createDazNodeWalletService, DazNodeInvoice, DazNodeInvoiceParams, DazNodeInvoiceStatus } from './daznode-wallet-service';

interface UnifiedInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
}

interface UnifiedInvoiceStatus {
  status: 'pending' | 'settled' | 'cancelled' | 'expired';
  settledAt?: string;
  amount?: number;
}

interface UnifiedWalletInfo {
  isOnline: boolean;
  provider: 'lnd' | 'daznode';
  walletInfo?: {
    balance?: number;
    publicKey: string;
    alias: string;
    channels?: number;
    blockHeight?: number;
  };
}

export class UnifiedLightningService {
  private lightningService: any = null;
  private dazNodeService: any = null;
  private provider: 'lnd' | 'daznode' = 'daznode';

  constructor() {
    this.initializeProvider();
  }

  /**
   * Initialise le provider Lightning approprié
   */
  private initializeProvider(): void {
    try {
      // Essayer d'abord LND si configuré
      this.lightningService = createLightningService();
      this.provider = 'lnd';
      console.log('✅ UnifiedLightning - Utilisation du nœud LND');
    } catch (error) {
      if (error instanceof Error && error.message === 'FALLBACK_TO_DAZNODE_WALLET') {
        // Fallback vers le wallet DazNode
        this.dazNodeService = createDazNodeWalletService();
        this.provider = 'daznode';
        console.log('✅ UnifiedLightning - Utilisation du wallet DazNode');
      } else {
        // Erreur de configuration LND, utiliser DazNode
        console.warn('⚠️ UnifiedLightning - Erreur LND, fallback vers DazNode:', error);
        this.dazNodeService = createDazNodeWalletService();
        this.provider = 'daznode';
      }
    }
  }

  /**
   * Génère une facture Lightning
   */
  async generateInvoice(params: CreateInvoiceParams): Promise<UnifiedInvoice> {
    try {
      console.log(`📄 UnifiedLightning - Génération facture via ${this.provider}:`, {
        amount: params.amount,
        description: params.description?.substring(0, 50)
      });

      if (this.provider === 'lnd' && this.lightningService) {
        const invoice = await this.lightningService.generateInvoice(params);
        return this.mapLightningInvoice(invoice);
      } else if (this.provider === 'daznode' && this.dazNodeService) {
        const dazNodeParams: DazNodeInvoiceParams = {
          amount: params.amount,
          description: params.description,
          expiry: params.expiry
        };
        const invoice = await this.dazNodeService.generateInvoice(dazNodeParams);
        return this.mapDazNodeInvoice(invoice);
      }

      throw new Error('Aucun provider Lightning disponible');

    } catch (error) {
      console.error(`❌ UnifiedLightning - Erreur génération facture ${this.provider}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<UnifiedInvoiceStatus> {
    try {
      console.log(`🔍 UnifiedLightning - Vérification statut via ${this.provider}:`, 
        paymentHash?.substring(0, 20) + '...');

      if (this.provider === 'lnd' && this.lightningService) {
        const status = await this.lightningService.checkInvoiceStatus(paymentHash);
        return this.mapLightningStatus(status);
      } else if (this.provider === 'daznode' && this.dazNodeService) {
        const status = await this.dazNodeService.checkInvoiceStatus(paymentHash);
        return this.mapDazNodeStatus(status);
      }

      throw new Error('Aucun provider Lightning disponible');

    } catch (error) {
      console.error(`❌ UnifiedLightning - Erreur vérification statut ${this.provider}:`, error);
      throw error;
    }
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

      } else if (this.provider === 'daznode' && this.dazNodeService) {
        const walletInfo = await this.dazNodeService.getWalletInfo();
        
        return {
          isOnline: walletInfo.isOnline,
          provider: 'daznode',
          walletInfo: walletInfo.walletInfo ? {
            balance: walletInfo.walletInfo.balance,
            publicKey: walletInfo.walletInfo.publicKey,
            alias: walletInfo.walletInfo.alias || 'DazNode Wallet'
          } : undefined
        };
      }

      throw new Error('Aucun provider Lightning disponible');

    } catch (error) {
      console.error(`❌ UnifiedLightning - Erreur informations wallet ${this.provider}:`, error);
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
      if (this.provider === 'daznode' && this.dazNodeService) {
        await this.dazNodeService.close();
      }
      console.log('✅ UnifiedLightning - Connexions fermées');
    } catch (error) {
      console.warn('⚠️ UnifiedLightning - Erreur fermeture:', error);
    }
  }

  /**
   * Obtient le provider actuel
   */
  getProvider(): 'lnd' | 'daznode' {
    return this.provider;
  }

  // Méthodes de mapping privées
  private mapLightningInvoice(invoice: LightningInvoice): UnifiedInvoice {
    return {
      id: invoice.id,
      paymentRequest: invoice.paymentRequest,
      paymentHash: invoice.paymentHash,
      createdAt: invoice.createdAt,
      expiresAt: invoice.expiresAt,
      amount: invoice.amount,
      description: invoice.description
    };
  }

  private mapDazNodeInvoice(invoice: DazNodeInvoice): UnifiedInvoice {
    return {
      id: invoice.id,
      paymentRequest: invoice.paymentRequest,
      paymentHash: invoice.paymentHash,
      createdAt: invoice.createdAt,
      expiresAt: invoice.expiresAt,
      amount: invoice.amount,
      description: invoice.description
    };
  }

  private mapLightningStatus(status: InvoiceStatus): UnifiedInvoiceStatus {
    return {
      status: status.status,
      settledAt: status.settledAt,
      amount: status.amount
    };
  }

  private mapDazNodeStatus(status: DazNodeInvoiceStatus): UnifiedInvoiceStatus {
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