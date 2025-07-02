import { LightningService, CreateInvoiceParams, Invoice } from '@/types/lightning';
import { validateData, createInvoiceSchema } from '@/lib/validations/lightning';
import { PaymentLogger } from '@/lib/services/payment-logger';
import jwt from 'jsonwebtoken';

type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';

// Type pour la réponse de statut
interface InvoiceStatusResponse {
  status: PaymentStatus;
  amount: number;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}

// Classe d'erreur personnalisée pour Lightning
export class LightningError extends Error {
  constructor(message: string, public code: string, public details?: unknown) {
    super(message);
    this.name = 'LightningError';
  }
}

export class LightningServiceImpl implements LightningService {
  private client: any;
  private provider: string;
  private paymentLogger: PaymentLogger;
  private jwtEnabled: boolean;
  private jwtSecret: string;
  private jwtTenant: string;

  constructor() {
    this.provider = 'lnd';
    this.client = null;
    this.paymentLogger = new PaymentLogger();
    this.jwtEnabled = process.env.LIGHTNING_JWT_ENABLED === 'true';
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtTenant = process.env.LIGHTNING_JWT_TENANT || 'daznode-lightning';
    
    if (this.jwtEnabled && !this.jwtSecret) {
      console.warn('⚠️  JWT activé mais JWT_SECRET non configuré');
    }
  }

  private async validateJWT(token: string): Promise<boolean> {
    if (!this.jwtEnabled) return true;
    
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return decoded && decoded.tenant_id === this.jwtTenant;
    } catch (error) {
      console.error('❌ Erreur validation JWT:', error);
      return false;
    }
  }

  private async getJWTToken(): Promise<string | null> {
    const tokenKey = `JWT_TOKEN_${this.jwtTenant.toUpperCase().replace('-', '_')}`;
    return process.env[tokenKey] || null;
  }

  async initialize(): Promise<void> {
    try {
      // Validation des variables d'environnement requises
      const requiredEnvVars = ['LND_TLS_CERT', 'LND_ADMIN_MACAROON', 'LND_SOCKET'];
      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          throw new LightningError(
            `Variable d'environnement manquante: ${envVar}`,
            'MISSING_ENV_VAR',
            { envVar }
          );
        }
      }

      const config = {
        lnd_host: process.env.LND_SOCKET || 'localhost:10009',
        lnd_tls_cert: process.env.LND_TLS_CERT || '',
        lnd_macaroon: process.env.LND_ADMIN_MACAROON || ''
      };

      // Import dynamique pour éviter les problèmes de types
      const lightning = await import('lightning') as any;
      this.client = await lightning.authenticatedLndGrpc(config);
      console.log('✅ LightningService: Client initialisé avec succès');
    } catch (error) {
      console.error('❌ LightningService: Erreur d\'initialisation:', error);
      throw new LightningError(
        'Erreur d\'initialisation du client Lightning',
        'INITIALIZATION_FAILED',
        error
      );
    }
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    const startTime = Date.now();
    
    try {
      // Validation JWT si activé
      if (this.jwtEnabled) {
        const token = await this.getJWTToken();
        if (!token || !(await this.validateJWT(token))) {
          throw new Error('JWT invalide ou manquant pour les opérations Lightning');
        }
      }

      // Validation des paramètres avec Zod (sans expiry car pas dans le schéma)
      const validation = validateData(createInvoiceSchema, {
        amount: params.amount,
        description: params.description,
        metadata: params.metadata
      });
      if (!validation.success) {
        throw new LightningError(
          `Validation des paramètres échouée: ${validation.error.message}`,
          'VALIDATION_ERROR',
          validation.error.format()
        );
      }

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

      const result: Invoice = {
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

      // Logging du paiement
      await this.paymentLogger.logPayment({
        payment_hash: result.paymentHash,
        amount: result.amount,
        description: result.description,
        status: 'pending',
        metadata: { 
          ...metadata,
          jwt_authenticated: this.jwtEnabled,
          tenant: this.jwtTenant
        }
      });

      // Métriques de performance
      const duration = Date.now() - startTime;
      console.log(`✅ LightningService: Facture créée en ${duration}ms`, {
        amount,
        paymentHash: result.paymentHash,
        duration
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ LightningService: Erreur génération facture:', error);
      
      // Logging de l'erreur
      if (error instanceof LightningError) {
        throw error;
      }
      
      throw new LightningError(
        'Erreur lors de la génération de la facture',
        'INVOICE_CREATION_FAILED',
        { error: error instanceof Error ? error.message : 'Erreur inconnue', duration }
      );
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatusResponse> {
    const startTime = Date.now();
    
    try {
      // Validation JWT si activé
      if (this.jwtEnabled) {
        const token = await this.getJWTToken();
        if (!token || !(await this.validateJWT(token))) {
          throw new Error('JWT invalide ou manquant pour les opérations Lightning');
        }
      }

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

      const result: InvoiceStatusResponse = {
        status,
        amount: invoice.tokens,
        settledAt: invoice.confirmed_at,
        metadata: invoice.metadata
      };

      // Mise à jour du statut dans les logs
      await this.paymentLogger.updatePaymentStatus(paymentHash, result.status);

      const duration = Date.now() - startTime;
      console.log(`✅ LightningService: Statut vérifié en ${duration}ms`, {
        paymentHash,
        status,
        duration
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ LightningService: Erreur vérification statut:', error);
      
      throw new LightningError(
        'Erreur lors de la vérification du statut',
        'STATUS_CHECK_FAILED',
        { error: error instanceof Error ? error.message : 'Erreur inconnue', duration }
      );
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
    timeout?: number;
    checkInterval?: number;
  }): Promise<void> {
    const { 
      paymentHash, 
      onPaid, 
      onExpired, 
      onError,
      timeout = 5 * 60 * 1000, // 5 minutes par défaut
      checkInterval = 2000 // 2 secondes par défaut
    } = params;
    
    try {
      const interval = setInterval(async () => {
        try {
          const status = await this.checkInvoiceStatus(paymentHash);
          
          if (status.status === 'settled') {
            clearInterval(interval);
            await onPaid();
          } else if (status.status === 'expired' || status.status === 'failed') {
            clearInterval(interval);
            onExpired();
          }
        } catch (error) {
          clearInterval(interval);
          onError(error as Error);
        }
      }, checkInterval);

      // Timeout configurable
      setTimeout(() => {
        clearInterval(interval);
        onExpired();
      }, timeout);
    } catch (error) {
      onError(error as Error);
    }
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    const startTime = Date.now();
    
    try {
      // Validation JWT si activé
      if (this.jwtEnabled) {
        const token = await this.getJWTToken();
        if (!token || !(await this.validateJWT(token))) {
          throw new Error('JWT invalide ou manquant pour les opérations Lightning');
        }
      }

      if (!this.client) {
        await this.initialize();
      }

      await this.client.getWalletInfo({});
      
      const duration = Date.now() - startTime;
      console.log(`✅ LightningService: Health check réussi en ${duration}ms`);
      
      return { isOnline: true, provider: this.provider || 'lnd' };
    } catch (error) {
      const duration = Date.now() - startTime;
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
        throw new LightningError(
          'Erreur lors de la fermeture du client',
          'CLOSE_FAILED',
          error
        );
      }
    }
  }

  async createInvoice(params: { amount: number; description: string }): Promise<{ payment_hash: string }> {
    try {
      const invoice = await this.generateInvoice({
        amount: params.amount,
        description: params.description
      });
      return { payment_hash: invoice.paymentHash };
    } catch (error) {
      console.error('❌ LightningService: Erreur création facture:', error);
      throw error;
    }
  }

  async checkPayment(paymentHash: string): Promise<boolean> {
    try {
      const status = await this.checkInvoiceStatus(paymentHash);
      return status.status === 'settled';
    } catch (error) {
      console.error('❌ LightningService: Erreur vérification paiement:', error);
      throw error;
    }
  }

  // Méthode pour vérifier si JWT est activé
  isJWTEnabled(): boolean {
    return this.jwtEnabled;
  }

  // Méthode pour obtenir le tenant JWT
  getJWTTenant(): string {
    return this.jwtTenant;
  }

  // Méthode pour générer un nouveau token JWT
  generateJWTToken(permissions: string[] = ['read', 'write']): string {
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET non configuré');
    }

    const payload = {
      iss: 'dazno.de',
      aud: 'daznode',
      sub: this.jwtTenant,
      tenant_id: this.jwtTenant,
      permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
    };

    return jwt.sign(payload, this.jwtSecret);
  }
}

// Fonction factory pour créer le service
export function createLightningService(): LightningService {
  return new LightningServiceImpl();
} 