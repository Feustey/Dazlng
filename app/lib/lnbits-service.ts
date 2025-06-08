interface LNbitsInvoiceParams {
  amount: number; // en satoshis
  memo: string;
  expiry?: number; // en secondes, défaut 3600 (1h)
}

interface LNbitsInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  expiresAt: string;
  amount: number;
}

interface LNbitsPaymentStatus {
  paid: boolean;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  amount?: number;
  fee?: number;
  preimage?: string;
}

interface LNbitsConfig {
  endpoint: string;
  apiKey: string;
  walletId?: string;
  timeout: number;
  retries: number;
}

class LNbitsError extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message);
    this.name = 'LNbitsError';
  }
}

export class LNbitsService {
  private config: LNbitsConfig;

  constructor(config?: Partial<LNbitsConfig>) {
    this.config = {
      endpoint: config?.endpoint || process.env.LNBITS_ENDPOINT || 'https://legend.lnbits.com', // Fallback vers instance publique
      apiKey: config?.apiKey || process.env.LNBITS_INVOICE_KEY || process.env.LNBITS_API_KEY || '',
      walletId: config?.walletId || process.env.LNBITS_WALLET_ID,
      timeout: config?.timeout || 30000, // 30 secondes
      retries: config?.retries || 3
    };

    if (!this.config.apiKey) {
      console.warn('LNbitsService - Aucune clé API fournie, service désactivé');
      throw new LNbitsError('LNbits API key is required');
    }

    console.log('LNbitsService initialized:', {
      endpoint: this.config.endpoint,
      hasApiKey: !!this.config.apiKey,
      apiKeyPrefix: this.config.apiKey ? this.config.apiKey.substring(0, 8) + '...' : 'missing'
    });
  }

  /**
   * Génère une facture Lightning via l'API LNbits
   */
  async generateInvoice(params: LNbitsInvoiceParams): Promise<LNbitsInvoice> {
    console.log('LNbitsService - Début génération facture:', { 
      amount: params.amount, 
      memo: params.memo,
      endpoint: this.config.endpoint
    });

    // Validation des paramètres
    this.validateInvoiceParams(params);

    // Utiliser l'endpoint simplifié de dazno.de
    const payload = {
      amount: params.amount, // En sats pour l'endpoint dazno.de
      memo: this.sanitizeMemo(params.memo),
      expiry: params.expiry || 3600,
      webhook: this.getWebhookUrl()
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        console.log(`LNbitsService - Tentative ${attempt}/${this.config.retries}`, {
          endpoint: `${this.config.endpoint}/wallet/invoice`,
          amount: payload.amount,
          memo: payload.memo
        });
        
        // Essayer d'abord l'endpoint simplifié dazno.de
        let response = await this.makeRequest('/wallet/invoice', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // Si l'endpoint simplifié échoue, essayer l'API LNbits native
        if (!response.ok) {
          console.log('LNbitsService - Endpoint simplifié échoué, essai API native LNbits');
          const nativePayload = {
            out: false,
            amount: params.amount * 1000, // millisats pour l'API native
            memo: this.sanitizeMemo(params.memo),
            expiry: params.expiry || 3600,
            webhook: this.getWebhookUrl()
          };
          
          response = await this.makeRequest('/api/v1/payments', {
            method: 'POST',
            body: JSON.stringify(nativePayload)
          });
        }

        const data = await response.json();

        if (!response.ok) {
          throw new LNbitsError(
            data.detail || `HTTP ${response.status}: ${response.statusText}`,
            'HTTP_ERROR',
            response.status
          );
        }

        // Validation de la réponse
        this.validateInvoiceResponse(data);

        const invoice: LNbitsInvoice = {
          id: data.payment_hash,
          paymentRequest: data.payment_request,
          paymentHash: data.payment_hash,
          expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
          amount: params.amount
        };

        // Validation BOLT11
        if (!this.isValidBolt11(invoice.paymentRequest)) {
          throw new LNbitsError('Invoice BOLT11 invalide reçue de LNbits', 'INVALID_BOLT11');
        }

        console.log('LNbitsService - Facture créée avec succès:', {
          paymentHash: invoice.paymentHash,
          amount: invoice.amount,
          expiresAt: invoice.expiresAt
        });

        return invoice;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`LNbitsService - Erreur tentative ${attempt}:`, {
          message: lastError.message,
          code: (lastError as LNbitsError).code,
          statusCode: (lastError as LNbitsError).statusCode
        });

        if (attempt < this.config.retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff
          console.log(`LNbitsService - Attente ${delay}ms avant nouvelle tentative`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    const finalError = new LNbitsError(
      `Échec de génération de facture après ${this.config.retries} tentatives: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED'
    );
    console.error('LNbitsService - Échec final:', finalError.message);
    throw finalError;
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPayment(paymentHash: string): Promise<LNbitsPaymentStatus> {
    console.log('LNbitsService - Vérification paiement:', paymentHash);

    try {
      const response = await this.makeRequest(`/api/v1/payments/${paymentHash}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new LNbitsError('Paiement non trouvé', 'PAYMENT_NOT_FOUND', 404);
        }
        throw new LNbitsError(`HTTP ${response.status}: ${response.statusText}`, 'HTTP_ERROR', response.status);
      }

      const data = await response.json();

      return {
        paid: Boolean(data.paid),
        status: data.paid ? 'paid' : 'pending',
        amount: data.amount ? data.amount / 1000 : undefined, // Convertir millisats en sats
        fee: data.fee ? data.fee / 1000 : undefined,
        preimage: data.preimage
      };

    } catch (error) {
      console.error('LNbitsService - Erreur vérification paiement:', error);
      throw error instanceof LNbitsError ? error : new LNbitsError(String(error));
    }
  }

  /**
   * Teste la connectivité avec l'API LNbits
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Essayer d'abord l'endpoint simplifié
      let response = await this.makeRequest('/wallet/balance', {
        method: 'GET'
      });

      if (response.ok) {
        console.log('LNbitsService - Health check OK via endpoint simplifié');
        return true;
      }

      // Fallback vers l'API native
      response = await this.makeRequest('/api/v1/wallet', {
        method: 'GET'
      });

      const isHealthy = response.ok;
      console.log('LNbitsService - Health check:', isHealthy ? 'OK' : 'FAILED', 'via API native');
      return isHealthy;
    } catch (error) {
      console.error('LNbitsService - Health check failed:', error);
      return false;
    }
  }

  /**
   * Effectue une requête HTTP vers l'API LNbits
   */
  private async makeRequest(path: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.endpoint}${path}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'X-Api-Key': this.config.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'DazNode/1.0'
      },
      signal: AbortSignal.timeout(this.config.timeout)
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    return fetch(url, mergedOptions);
  }

  /**
   * Valide les paramètres d'entrée pour la génération de facture
   */
  private validateInvoiceParams(params: LNbitsInvoiceParams): void {
    if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
      throw new LNbitsError('Montant invalide: doit être un nombre positif');
    }

    if (params.amount > 1000000) { // Limite de sécurité: 1M sats
      throw new LNbitsError('Montant trop élevé: maximum 1,000,000 sats');
    }

    if (!params.memo || typeof params.memo !== 'string' || params.memo.trim().length === 0) {
      throw new LNbitsError('Memo invalide: description requise');
    }

    if (params.memo.length > 500) {
      throw new LNbitsError('Memo trop long: maximum 500 caractères');
    }

    if (params.expiry && (params.expiry < 60 || params.expiry > 86400)) {
      throw new LNbitsError('Expiry invalide: doit être entre 60 secondes et 24 heures');
    }
  }

  /**
   * Valide la réponse de l'API LNbits
   */
  private validateInvoiceResponse(data: unknown): void {
    if (!data || typeof data !== 'object') {
      throw new LNbitsError('Réponse invalide: données manquantes');
    }

    const response = data as { payment_hash?: string; payment_request?: string };

    if (!response.payment_hash || typeof response.payment_hash !== 'string') {
      throw new LNbitsError('Réponse invalide: payment_hash manquant');
    }

    if (!response.payment_request || typeof response.payment_request !== 'string') {
      throw new LNbitsError('Réponse invalide: payment_request manquant');
    }

    if (!response.payment_request.toLowerCase().startsWith('ln')) {
      throw new LNbitsError('Réponse invalide: payment_request n\'est pas une facture Lightning');
    }
  }

  /**
   * Sanitise le memo pour éviter les caractères problématiques
   */
  private sanitizeMemo(memo: string): string {
    return memo
      .normalize('NFKD')
      .replace(/[^\x00-\x7F]/g, '') // Supprime les caractères non-ASCII
      .trim()
      .substring(0, 500) || 'DazNode Payment'; // Fallback si vide après sanitisation
  }

  /**
   * Valide une facture BOLT11
   */
  private isValidBolt11(bolt11: string): boolean {
    if (!bolt11 || typeof bolt11 !== 'string') {
      return false;
    }

    // Vérification basique du format BOLT11
    const bolt11Regex = /^ln[a-zA-Z0-9]{1,20}[02-9ac-hj-np-z]+$/;
    return bolt11Regex.test(bolt11.toLowerCase()) && bolt11.length >= 100;
  }

  /**
   * Génère l'URL de webhook pour les notifications de paiement
   */
  private getWebhookUrl(): string | undefined {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
    if (!baseUrl) return undefined;
    
    return `${baseUrl}/api/webhook/lnbits-payment`;
  }
}

export { LNbitsError, type LNbitsInvoice, type LNbitsPaymentStatus, type LNbitsInvoiceParams }; 