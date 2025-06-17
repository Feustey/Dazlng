import { Invoice, InvoiceStatus, CreateInvoiceParams } from '@/types/lightning';

export class DazNodeLightningService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.DAZNODE_API_URL || 'https://api.dazno.de';
    this.apiKey = process.env.DAZNODE_API_KEY || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API DazNode: ${response.statusText}`);
    }

    return response.json();
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      const response = await this.request<Invoice>('/api/v1/lightning/invoice/create', {
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
        status: {
          status: 'pending',
          amount: params.amount,
          metadata: params.metadata
        }
      };
    } catch (error) {
      console.error('Erreur génération facture DazNode:', error);
      throw error;
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const response = await this.request<{ status: string, amount: number, settledAt?: string, metadata?: Record<string, unknown> }>(
        `/api/v1/lightning/invoice/${paymentHash}/status`
      );
      
      return {
        status: response.status as 'pending' | 'settled' | 'failed' | 'expired',
        amount: response.amount,
        settledAt: response.settledAt,
        metadata: response.metadata
      };
    } catch (error) {
      console.error('Erreur vérification facture DazNode:', error);
      throw error;
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => void;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    try {
      const checkStatus = async () => {
        const status = await this.checkInvoiceStatus(params.paymentHash);
        
        switch (status.status) {
          case 'settled':
            params.onPaid();
            break;
          case 'expired':
            params.onExpired();
            break;
          case 'failed':
            params.onError(new Error('Paiement échoué'));
            break;
          case 'pending':
            // Continuer à surveiller
            setTimeout(checkStatus, 5000);
            break;
        }
      };

      await checkStatus();
    } catch (error) {
      console.error('Erreur surveillance facture DazNode:', error);
      params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
  }
}

export function createDazNodeLightningService(): DazNodeLightningService {
  return new DazNodeLightningService();
}

// Export des types
export type { 
  Invoice, 
  InvoiceStatus, 
  CreateInvoiceParams 
}; 