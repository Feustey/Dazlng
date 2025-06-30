import { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';
import { INVOICE_STATUS } from '@/types/lightning';

export class DazNodeLightningService {
  private apiUrl: string | null = null;
  private apiKey: string | null = null;
  private provider: string | null = null;

  constructor() {
    this.apiUrl = (process.env.DAZNODE_API_URL ?? "") || 'https://api.dazno.de';
    this.apiKey = (process.env.DAZNODE_API_KEY ?? "") || '';
    this.provider = 'daznode@getalby.com';

    if (!this.apiKey) {
      console.warn('⚠️ DAZNODE_API_KEY non configurée');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      const response = await this.request<{
        id: string;
        paymentRequest: string;
        paymentHash: string;
        amount: number;
        description: string;
      }>('/api/v1/lightning/invoice/create', {
        method: 'POST',
        body: JSON.stringify({
          amount: params.amount,
          description: params.description,
          expiry: params.expiry || 3600,
          metadata: params.metadata
        })
      });

      return {
        id: response.id,
        paymentRequest: response.paymentRequest,
        paymentHash: response.paymentHash,
        amount: params.amount,
        description: params.description,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
        status: INVOICE_STATUS.PENDING,
        metadata: params.metadata
      };
    } catch (error) {
      console.error('❌ DazNodeLightning - Erreur génération facture:', error);
      throw error;
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const response = await this.request<{
        status: InvoiceStatus,
        amount: number;
        settledAt?: string;
        metadata?: Record<string, any>;
      }>(`/api/v1/lightning/invoice/${paymentHash}/status`);
      
      return {
        status: response.status,
        amount: response.amount,
        settledAt: response.settledAt,
        metadata: response.metadata
      };
    } catch (error) {
      console.error('❌ DazNodeLightning - Erreur vérification facture:', error);
      throw error;
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    try {
      const checkInterval = setInterval(async () => {
        try {
          const status = await this.checkInvoiceStatus(params.paymentHash);
          
          if (status.status === INVOICE_STATUS.SETTLED) {
            clearInterval(checkInterval);
            await params.onPaid();
          } else if (status.status === INVOICE_STATUS.EXPIRED || status.status === INVOICE_STATUS.FAILED) {
            clearInterval(checkInterval);
            params.onExpired();
          }
        } catch (error) {
          clearInterval(checkInterval);
          params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
        }
      }, 2000);

      // Nettoyage après 1 heure
      setTimeout(() => {
        clearInterval(checkInterval);
        params.onExpired();
      }, 3600 * 1000);
    } catch (error) {
      params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    try {
      await this.request('/api/v1/lightning/health');
      return { isOnline: true, provider: this.provider };
    } catch (error) {
      return { isOnline: false, provider: this.provider };
    }
  }
}

export function createDazNodeLightningService(): DazNodeLightningService {
  return new DazNodeLightningService();
}
