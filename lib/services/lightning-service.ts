// Import dynamique du module lightning
const lightning = require('lightning');
const { decodePaymentRequest, getWalletInfo, getChannels } = lightning;
import { Invoice, InvoiceStatus, CreateInvoiceParams } from '@/types/lightning';
import { createDazNodeLightningService } from './daznode-lightning-service';
import { createLightningClient } from './lightning-client'

interface LightningConfig {
  cert: string;          // Base64 encoded tls.cert
  macaroon: string;      // Base64 encoded admin.macaroon  
  socket: string;        // IP:Port du nœud (ex: '127.0.0.1:10009')
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
  private daznodeService;

  constructor() {
    this.daznodeService = createDazNodeLightningService();
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      const invoice = await this.daznodeService.generateInvoice({
        amount: params.amount,
        description: params.description,
        expiry: params.expiry || 3600
      });

      return {
        id: invoice.id,
        paymentRequest: invoice.paymentRequest,
        paymentHash: invoice.paymentHash,
        amount: params.amount,
        description: params.description,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
        status: 'pending'
      };
    } catch (error) {
      console.error('Erreur génération facture:', error);
      throw error;
    }
  }

  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const status = await this.daznodeService.checkInvoiceStatus(paymentHash);
      return status;
    } catch (error) {
      console.error('Erreur vérification facture:', error);
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
      await this.daznodeService.watchInvoice({
        paymentHash: params.paymentHash,
        onPaid: params.onPaid,
        onExpired: params.onExpired,
        onError: params.onError
      });
    } catch (error) {
      console.error('Erreur surveillance facture:', error);
      throw error;
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
        lnd: this.daznodeService.lnd,
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
        getWalletInfo({ lnd: this.daznodeService.lnd }),
        getChannels({ lnd: this.daznodeService.lnd })
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
      const health = await this.healthCheck();
      return health.isOnline ? health.nodeInfo || null : null;
    } catch (error) {
      console.error('❌ LightningService - Erreur récupération info nœud:', error);
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

  return new LightningService();
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