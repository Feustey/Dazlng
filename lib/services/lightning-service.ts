import { 
  Invoice, 
  InvoiceStatus, 
  CreateInvoiceParams, 
  LightningService as ILightningService 
} from '@/types/lightning';

export enum InvoiceStatus {
  pending = "pending",
  settled = "settled",
  expired = "expired",
  failed = "failed"
}
import { validateData } from '@/lib/validations/lightning';
import { createInvoiceSchema } from '@/lib/validations/lightning';

export class LightningService implements ILightningService {
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

  /**
   * Effectue une requête vers l'API DazNode
   */
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

  /**
   * Génère une nouvelle facture Lightning
   */
  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      // Validation des paramètres
      const validation = validateData(createInvoiceSchema, params);
      if (!validation.success) {
        throw new Error(`Paramètres invalides: ${validation.error.message}`);
      }

      // Appel API
      const response = await (this ?? Promise.reject(new Error("this is null"))).request<{
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

      // Construction de la réponse standardisée
      return {
        id: response.id,
        paymentRequest: response.paymentRequest,
        paymentHash: response.paymentHash,
        amount: params.amount,
        description: params.description,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
        status: InvoiceStatus.pending,
        metadata: params.metadata
      };
    } catch (error) {
      console.error('❌ LightningService - Erreur génération facture:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const response = await (this ?? Promise.reject(new Error("this is null"))).request<{
        status: InvoiceStatus.pending | InvoiceStatus.settled | InvoiceStatus.failed | InvoiceStatus.expired;
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
      console.error('❌ LightningService - Erreur vérification facture:', error);
      throw error;
    }
  }

  /**
   * Surveille une facture pour les changements de statut
   */
  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    try {
      const checkInterval = setInterval(async () => {
        try {
          const status = await (this ?? Promise.reject(new Error("this is null"))).checkInvoiceStatus(params.paymentHash);
          
          if (status.status === InvoiceStatus.settled) {
            clearInterval(checkInterval);
            await (params ?? Promise.reject(new Error("params is null"))).onPaid();
          } else if (status.status === InvoiceStatus.expired || status.status === InvoiceStatus.failed) {
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

  /**
   * Vérifie la santé du service
   */
  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    try {
      await (this ?? Promise.reject(new Error("this is null"))).request('/api/v1/lightning/health');
      return { isOnline: true, provider: this.provider };
    } catch (error) {
      console.error('❌ LightningService - Erreur health check:', error);
      return { isOnline: false, provider: this.provider };
    }
  }
}

/**
 * Factory pour créer le service Lightning
 */
export function createLightningService(): LightningService {
  return new LightningService();
}
