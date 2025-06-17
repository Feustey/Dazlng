import axios from 'axios';

interface LNBitsConfig {
  apiKey: string;
  baseUrl: string;
}

interface CreateInvoiceParams {
  amount: number;
  description: string;
  expiry?: number;
  metadata?: Record<string, any>;
}

interface LNBitsInvoice {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
  lnurl_response: string;
  created_at: string;
  expires_at: string;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

interface InvoiceStatus {
  status: 'pending' | 'settled' | 'cancelled' | 'expired';
  settledAt?: string;
  amount?: number;
}

interface WalletInfo {
  balance: number;
  name: string;
  id: string;
}

export class LNBitsService {
  private config: LNBitsConfig;
  private axiosInstance;

  constructor(config: LNBitsConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'X-Api-Key': this.config.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Crée une nouvelle facture Lightning
   */
  async createInvoice(params: CreateInvoiceParams): Promise<LNBitsInvoice> {
    try {
      console.log('📄 LNBitsService - Génération facture:', {
        amount: params.amount,
        description: params.description?.substring(0, 50),
        expiry: params.expiry
      });

      // Validation
      if (!params.amount || params.amount <= 0) {
        throw new Error('Montant invalide: doit être supérieur à 0');
      }

      if (params.amount > 1000000) {
        throw new Error('Montant trop élevé: maximum 1,000,000 sats');
      }

      if (!params.description?.trim()) {
        throw new Error('Description requise');
      }

      if (params.description.length > 500) {
        throw new Error('Description trop longue: maximum 500 caractères');
      }

      const response = await this.axiosInstance.post('/api/v1/payments', {
        out: false,
        amount: params.amount,
        memo: params.description,
        expiry: params.expiry || 3600,
        unit: 'sat',
        webhook: params.metadata?.webhook,
        internal: false,
        unhashed_description: params.description
      });

      const invoice = response.data;

      console.log('✅ LNBitsService - Facture créée:', {
        id: invoice.checking_id,
        amount: invoice.amount,
        hash: invoice.payment_hash?.substring(0, 20) + '...'
      });

      return {
        payment_hash: invoice.payment_hash,
        payment_request: invoice.payment_request,
        checking_id: invoice.checking_id,
        lnurl_response: invoice.lnurl_response,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
        amount: invoice.amount,
        description: params.description,
        metadata: params.metadata
      };

    } catch (error) {
      console.error('❌ LNBitsService - Erreur génération facture:', error);
      throw new Error(`Erreur génération facture: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      console.log('🔍 LNBitsService - Vérification statut:', paymentHash?.substring(0, 20) + '...');

      const response = await this.axiosInstance.get(`/api/v1/payments/${paymentHash}`);
      const invoice = response.data;

      let status: 'pending' | 'settled' | 'cancelled' | 'expired' = 'pending';

      if (invoice.paid) {
        status = 'settled';
      } else if (invoice.expired) {
        status = 'expired';
      }

      console.log('✅ LNBitsService - Statut vérifié:', status);

      return {
        status,
        settledAt: invoice.paid_at,
        amount: invoice.amount
      };

    } catch (error) {
      console.error('❌ LNBitsService - Erreur vérification facture:', error);
      throw new Error(`Erreur vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Obtient les informations du wallet
   */
  async getWalletInfo(): Promise<WalletInfo> {
    try {
      console.log('🔍 LNBitsService - Récupération info wallet...');

      const response = await this.axiosInstance.get('/api/v1/wallet');
      const wallet = response.data;

      console.log('✅ LNBitsService - Wallet info récupéré:', {
        balance: wallet.balance,
        name: wallet.name
      });

      return {
        balance: wallet.balance,
        name: wallet.name,
        id: wallet.id
      };

    } catch (error) {
      console.error('❌ LNBitsService - Erreur récupération wallet:', error);
      throw new Error(`Erreur récupération wallet: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

export function createLNBitsService(): LNBitsService {
  const config: LNBitsConfig = {
    apiKey: process.env.LNBITS_API_KEY || '',
    baseUrl: process.env.LNBITS_API_URL || 'https://api.dazno.de/lnbits'
  };

  return new LNBitsService(config);
} 