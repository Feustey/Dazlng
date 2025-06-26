import { LightningService, CreateInvoiceParams, Invoice, InvoiceStatus, PaymentStatus } from '@/types/lightning';
import { createAuthenticatedLndGrpc } from 'lightning';

// Type pour la réponse de statut
export interface InvoiceStatusResponse {
  status: PaymentStatus;
  amount: number;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}

export class LightningServiceImpl implements LightningService {
  private client: any;
  private provider: string;

  constructor() {
    this.provider = 'lnd';
    this.client = null;
  }

  async initialize(): Promise<void> {
    try {
      const config = {
        lnd_host: process.env.LND_SOCKET || 'localhost:10009',
        lnd_tls_cert: process.env.LND_TLS_CERT || '',
        lnd_macaroon: process.env.LND_ADMIN_MACAROON || ''
      };

      this.client = await createAuthenticatedLndGrpc(config);
      console.log('✅ LightningService: Client initialisé avec succès');
    } catch (error) {
      console.error('❌ LightningService: Erreur d\'initialisation:', error);
      throw error;
    }
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      if (!this.client) {
        await this.initialize();
      }

      const { amount, description, expiry = 3600, metadata = {} } = params;

      const invoice = await this.client.createInvoice({
        tokens: amount,
        description,
        expires_at: new Date(Date.now() + expiry * 1000).toISOString(),
        ...metadata
      });

      return {
        id: invoice.id,
        paymentRequest: invoice.request,
        paymentHash: invoice.id,
        amount: invoice.tokens,
        description: invoice.description,
        createdAt: invoice.created_at,
        expiresAt: invoice.expires_at,
        status: 'pending',
        metadata
      };
    } catch (error) {
      console.error('❌ LightningService: Erreur génération facture:', error);
      throw error;
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatusResponse> {
    try {
      if (!this.client) {
        await this.initialize();
      }

      const invoice = await this.client.getInvoice({ id: paymentHash });

      let status: PaymentStatus = 'pending';
      if (invoice.is_confirmed) {
        status = 'settled';
      } else if (invoice.is_canceled) {
        status = 'failed';
      } else if (new Date(invoice.expires_at) < new Date()) {
        status = 'expired';
      }

      return {
        status,
        amount: invoice.tokens,
        settledAt: invoice.confirmed_at,
        metadata: invoice.metadata
      };
    } catch (error) {
      console.error('❌ LightningService: Erreur vérification statut:', error);
      throw error;
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    const { paymentHash, onPaid, onExpired, onError } = params;
    
    try {
      const checkInterval = setInterval(async () => {
        try {
          const status = await this.checkInvoiceStatus(paymentHash);
          
          if (status.status === 'settled') {
            clearInterval(checkInterval);
            await onPaid();
          } else if (status.status === 'expired' || status.status === 'failed') {
            clearInterval(checkInterval);
            onExpired();
          }
        } catch (error) {
          clearInterval(checkInterval);
          onError(error as Error);
        }
      }, 2000);

      // Timeout après 5 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        onExpired();
      }, 5 * 60 * 1000);
    } catch (error) {
      onError(error as Error);
    }
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    try {
      if (!this.client) {
        await this.initialize();
      }

      await this.client.getWalletInfo({});
      return { isOnline: true, provider: this.provider || 'lnd' };
    } catch (error) {
      console.error('❌ LightningService: Erreur health check:', error);
      return { isOnline: false, provider: this.provider || 'lnd' };
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      try {
        await this.client.removeAllListeners();
        this.client = null;
        console.log('✅ LightningService: Client fermé');
      } catch (error) {
        console.error('❌ LightningService: Erreur fermeture client:', error);
      }
    }
  }
}

// Fonction factory pour créer le service
export function createLightningService(): LightningService {
  return new LightningServiceImpl();
}

// Export des types pour compatibilité
export {
  InvoiceStatus,
  type Invoice,
  type CreateInvoiceParams,
  type InvoiceStatusResponse
};
