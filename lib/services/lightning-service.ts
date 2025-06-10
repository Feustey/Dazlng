import { authenticatedLndGrpc, createInvoice, decodePaymentRequest, getInvoice, getWalletInfo, getChannels } from 'lightning';

interface LightningConfig {
  cert: string;          // Base64 encoded tls.cert
  macaroon: string;      // Base64 encoded admin.macaroon  
  socket: string;        // IP:Port du nœud (ex: '127.0.0.1:10009')
}

interface CreateInvoiceParams {
  amount: number;        // Montant en satoshis
  description: string;   // Description de la facture
  expiry?: number;       // Expiration en secondes (défaut: 3600)
}

interface LightningInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
}

interface InvoiceStatus {
  status: 'pending' | 'settled' | 'cancelled' | 'expired';
  settledAt?: string;
  amount?: number;
}

interface NodeInfo {
  publicKey: string;
  alias: string;
  blockHeight: number;
  channels: number;
}

interface HealthCheck {
  isOnline: boolean;
  nodeInfo?: NodeInfo;
}

interface DecodedInvoice {
  amount: number;
  description: string;
  paymentHash: string;
  expiresAt: string;
  destination: string;
}

export class LightningService {
  private lnd: any;
  private config: LightningConfig;
  
  constructor(config: LightningConfig) {
    this.config = config;
    this.initializeLND();
  }

  private initializeLND(): void {
    try {
      const { lnd } = authenticatedLndGrpc({
        cert: this.config.cert,
        macaroon: this.config.macaroon,
        socket: this.config.socket,
      });
      
      this.lnd = lnd;
      console.log('✅ LightningService - Connexion LND établie');
    } catch (error) {
      console.error('❌ LightningService - Erreur connexion LND:', error);
      throw new Error(`Impossible de se connecter au nœud LND: ${error}`);
    }
  }

  /**
   * Crée une nouvelle facture Lightning
   */
  async generateInvoice(params: CreateInvoiceParams): Promise<LightningInvoice> {
    try {
      console.log('📄 LightningService - Génération facture:', {
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

      // Création de la facture via la librairie Lightning
      const expirySeconds = params.expiry || 3600;
      const invoice = await createInvoice({
        lnd: this.lnd,
        tokens: params.amount,
        description: params.description,
        expires_at: new Date(Date.now() + expirySeconds * 1000).toISOString()
      });

      const result: LightningInvoice = {
        id: invoice.id,
        paymentRequest: invoice.request,
        paymentHash: invoice.id, // Dans Lightning lib, l'ID est le payment hash
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
        amount: params.amount,
        description: params.description
      };

      console.log('✅ LightningService - Facture créée:', { 
        id: result.id, 
        amount: result.amount,
        hash: result.paymentHash?.substring(0, 20) + '...'
      });

      return result;

    } catch (error) {
      console.error('❌ LightningService - Erreur génération facture:', error);
      throw new Error(`Erreur génération facture: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      console.log('🔍 LightningService - Vérification statut:', paymentHash?.substring(0, 20) + '...');
      
      const invoice = await getInvoice({
        lnd: this.lnd,
        id: paymentHash
      });

      let status: 'pending' | 'settled' | 'cancelled' | 'expired' = 'pending';
      
      if (invoice.is_confirmed) {
        status = 'settled';
      } else if (invoice.is_canceled) {
        status = 'cancelled';
      } else if (new Date(invoice.expires_at) < new Date()) {
        status = 'expired';
      }

      console.log('✅ LightningService - Statut vérifié:', status);

      return {
        status,
        settledAt: invoice.confirmed_at,
        amount: invoice.tokens
      };

    } catch (error) {
      console.error('❌ LightningService - Erreur vérification facture:', error);
      throw new Error(`Erreur vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Décode une facture Lightning (BOLT11)
   */
  async decodeInvoice(paymentRequest: string): Promise<DecodedInvoice> {
    try {
      console.log('🔍 LightningService - Décodage facture BOLT11...');
      
      if (!paymentRequest?.toLowerCase().startsWith('ln')) {
        throw new Error('Format de facture invalide: doit commencer par "ln"');
      }

      const decoded = await decodePaymentRequest({
        lnd: this.lnd,
        request: paymentRequest
      });

      const result = {
        amount: decoded.tokens || 0,
        description: decoded.description || '',
        paymentHash: decoded.id,
        expiresAt: decoded.expires_at,
        destination: decoded.destination
      };

      console.log('✅ LightningService - Facture décodée:', {
        amount: result.amount,
        destination: result.destination?.substring(0, 20) + '...'
      });

      return result;

    } catch (error) {
      console.error('❌ LightningService - Erreur décodage facture:', error);
      throw new Error(`Erreur décodage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie la connectivité du nœud
   */
  async healthCheck(): Promise<HealthCheck> {
    try {
      console.log('🔍 LightningService - Health check...');
      
      const [walletInfo, channels] = await Promise.all([
        getWalletInfo({ lnd: this.lnd }),
        getChannels({ lnd: this.lnd })
      ]);

      const nodeInfo: NodeInfo = {
        publicKey: walletInfo.public_key,
        alias: walletInfo.alias,
        blockHeight: walletInfo.current_block_height,
        channels: channels.channels.length
      };

      console.log('✅ LightningService - Nœud en ligne:', {
        alias: nodeInfo.alias,
        channels: nodeInfo.channels,
        blockHeight: nodeInfo.blockHeight
      });

      return {
        isOnline: true,
        nodeInfo
      };

    } catch (error) {
      console.error('❌ LightningService - Health check failed:', error);
      return { isOnline: false };
    }
  }

  /**
   * Obtient les informations du nœud
   */
  async getNodeInfo(): Promise<NodeInfo | null> {
    try {
      const healthCheck = await this.healthCheck();
      return healthCheck.nodeInfo || null;
    } catch (error) {
      console.error('❌ LightningService - Erreur info nœud:', error);
      return null;
    }
  }
}

/**
 * Factory pour créer le service Lightning avec validation de config
 * Utilise le wallet DazNode par défaut si LND n'est pas configuré
 */
export function createLightningService(): LightningService {
  console.log('🏗️ LightningService - Initialisation...');
  
  // Vérifier si LND est configuré
  const hasLndConfig = process.env.LND_TLS_CERT && process.env.LND_ADMIN_MACAROON;
  
  if (!hasLndConfig) {
    console.log('⚠️ LightningService - Configuration LND non trouvée, utilisation du wallet DazNode');
    throw new Error('FALLBACK_TO_DAZNODE_WALLET');
  }
  
  const config: LightningConfig = {
    cert: process.env.LND_TLS_CERT!,
    macaroon: process.env.LND_ADMIN_MACAROON!,
    socket: process.env.LND_SOCKET || '127.0.0.1:10009'
  };

  // Validation de la config
  if (!config.cert) {
    throw new Error('Configuration LND manquante: LND_TLS_CERT requis');
  }
  
  if (!config.macaroon) {
    throw new Error('Configuration LND manquante: LND_ADMIN_MACAROON requis');
  }

  // Validation du format base64
  try {
    Buffer.from(config.cert, 'base64');
    Buffer.from(config.macaroon, 'base64');
  } catch (error) {
    throw new Error('Format base64 invalide pour cert ou macaroon');
  }

  // Validation du format socket
  const socketRegex = /^[\w.-]+:\d+$/;
  if (!socketRegex.test(config.socket)) {
    throw new Error('Format socket invalide: attendu host:port');
  }

  console.log('✅ LightningService - Configuration LND validée:', {
    socket: config.socket,
    certLength: config.cert.length,
    macaroonLength: config.macaroon.length
  });

  return new LightningService(config);
}

// Export des types pour utilisation externe
export type { 
  LightningInvoice, 
  CreateInvoiceParams, 
  InvoiceStatus, 
  NodeInfo, 
  HealthCheck,
  DecodedInvoice 
}; 