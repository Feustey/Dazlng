import { LightningService, CreateInvoiceParams, Invoice, InvoiceStatus } from '@/types/lightning';
import { logger } from '@/lib/logger';

export class DaznoApiOnlyService implements LightningService {
  private apiUrl: string;
  private apiKey: string;
  private provider: string = 'api.dazno.de';

  constructor() {
    this.apiUrl = process.env.DAZNODE_API_URL || 'https://api.dazno.de';
    this.apiKey = process.env.DAZNODE_API_KEY || '';
    
    if (!this.apiKey) {
      logger.warn('⚠️ DAZNODE_API_KEY non configurée');
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "dazno-api-only.daznoapionlydaznoapionlyconten": 'application/json',
      ...(options?.headers ? options.headers as Record<string, string> : {})
    };
    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }
    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok) {
      throw new Error(`Erreur API Dazno: ${response.status}`);
    }
    return response.json();
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    logger.info(' Génération facture via api.dazno.de', { amount: params.amount });
    
    const response = await this.request<Invoice>('/api/v1/lightning/invoices', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return response;
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    logger.info('🔍 Vérification statut via api.dazno.de', { paymentHash });
    
    const response = await this.request<InvoiceStatus>(`/api/v1/lightning/invoices/${paymentHash}/status`);
    
    return response;
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    try {
      await this.request('/api/v1/lightning/health');
      return { isOnline: true, provider: this.provider };
    } catch (error) {
      logger.error('❌ Health check api.dazno.de échoué:', error);
      return { isOnline: false, provider: this.provider };
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    logger.info('👀 Watch invoice via api.dazno.de', { paymentHash: params.paymentHash });
    
    const pollInterval = setInterval(async () => {
      try {
        const status = await this.checkInvoiceStatus(params.paymentHash);
        
        if (status.status === 'settled') {
          clearInterval(pollInterval);
          await params.onPaid();
        } else if (status.status === 'expired') {
          clearInterval(pollInterval);
          params.onExpired();
        }
      } catch (error) {
        clearInterval(pollInterval);
        params.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(pollInterval);
      params.onExpired();
    }, 3600000);
  }
}

export function createDaznoApiOnlyService(): DaznoApiOnlyService {
  return new DaznoApiOnlyService();
}