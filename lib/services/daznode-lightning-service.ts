import { authenticatedLndGrpc, createInvoice, getInvoice, getWalletInfo } from 'lightning';

interface DazNodeLightningConfig {
  // Configuration pour daznode@getalby.com  
  cert: string;
  macaroon: string;
  socket: string;
}

interface DazNodeInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
}

interface InvoiceParams {
  amount: number;
  description: string;
  expiry?: number;
}

interface InvoiceStatus {
  status: 'pending' | 'settled' | 'cancelled' | 'expired';
  settledAt?: string;
  amount?: number;
}

export class DazNodeLightningService {
  private lnd: any;
  private config: DazNodeLightningConfig;

  constructor(config: DazNodeLightningConfig) {
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
      console.log('✅ DazNodeLightning - Connexion établie vers daznode@getalby.com');
    } catch (error) {
      console.error('❌ DazNodeLightning - Erreur connexion:', error);
      throw new Error(`Impossible de se connecter à daznode@getalby.com: ${error}`);
    }
  }

  /**
   * Génère une nouvelle facture Lightning via daznode@getalby.com
   */
  async generateInvoice(params: InvoiceParams): Promise<DazNodeInvoice> {
    try {
      console.log('📄 DazNodeLightning - Génération facture via daznode@getalby.com:', {
        amount: params.amount,
        description: params.description?.substring(0, 50)
      });

      // Validation des paramètres
      if (!params.amount || params.amount <= 0) {
        throw new Error('Montant invalide: doit être supérieur à 0');
      }

      if (!params.description?.trim()) {
        throw new Error('Description requise');
      }

      // Créer la facture via package lightning
      const invoice = await createInvoice({
        lnd: this.lnd,
        tokens: params.amount,
        description: params.description,
        expires_at: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString()
      });

      const result: DazNodeInvoice = {
        id: invoice.id,
        paymentRequest: invoice.request,
        paymentHash: invoice.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
        amount: params.amount,
        description: params.description
      };

      console.log('✅ DazNodeLightning - Facture créée:', {
        id: result.id?.substring(0, 20) + '...',
        amount: result.amount
      });

      return result;

    } catch (error) {
      console.error('❌ DazNodeLightning - Erreur génération facture:', error);
      throw new Error(`Erreur génération facture: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie le statut d'une facture
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      console.log('🔍 DazNodeLightning - Vérification statut:', paymentHash?.substring(0, 20) + '...');

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

      console.log('✅ DazNodeLightning - Statut vérifié:', status);

      return {
        status,
        settledAt: invoice.confirmed_at,
        amount: invoice.tokens
      };

    } catch (error) {
      console.error('❌ DazNodeLightning - Erreur vérification facture:', error);
      throw new Error(`Erreur vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie la connectivité du wallet daznode@getalby.com
   */
  async healthCheck(): Promise<{ isOnline: boolean; walletInfo?: any }> {
    try {
      console.log('🔍 DazNodeLightning - Health check daznode@getalby.com...');
      
      const walletInfo = await getWalletInfo({ lnd: this.lnd });

      console.log('✅ DazNodeLightning - daznode@getalby.com en ligne:', {
        alias: walletInfo.alias || 'DazNode',
        publicKey: walletInfo.public_key?.substring(0, 20) + '...'
      });

      return {
        isOnline: true,
        walletInfo: {
          publicKey: walletInfo.public_key,
          alias: walletInfo.alias || 'daznode@getalby.com',
          blockHeight: walletInfo.current_block_height
        }
      };

    } catch (error) {
      console.error('❌ DazNodeLightning - Health check failed:', error);
      return { isOnline: false };
    }
  }
}

/**
 * Factory pour créer le service DazNode Lightning avec configuration daznode@getalby.com
 */
export function createDazNodeLightningService(): DazNodeLightningService {
  console.log('🏗️ DazNodeLightning - Initialisation connexion daznode@getalby.com...');

  // Configuration pour daznode@getalby.com
  const config: DazNodeLightningConfig = {
    cert: process.env.DAZNODE_TLS_CERT || process.env.LND_TLS_CERT || '',
    macaroon: process.env.DAZNODE_ADMIN_MACAROON || process.env.LND_ADMIN_MACAROON || '',
    socket: process.env.DAZNODE_SOCKET || 'daznode.getalby.com:10009'
  };

  // Validation de la configuration
  if (!config.cert) {
    throw new Error('Configuration daznode@getalby.com manquante: DAZNODE_TLS_CERT requis');
  }
  
  if (!config.macaroon) {
    throw new Error('Configuration daznode@getalby.com manquante: DAZNODE_ADMIN_MACAROON requis');
  }

  // Validation du format base64
  try {
    Buffer.from(config.cert, 'base64');
    Buffer.from(config.macaroon, 'base64');
  } catch (error) {
    throw new Error('Format base64 invalide pour cert ou macaroon daznode@getalby.com');
  }

  console.log('✅ DazNodeLightning - Configuration daznode@getalby.com validée:', {
    socket: config.socket,
    certLength: config.cert.length,
    macaroonLength: config.macaroon.length
  });

  return new DazNodeLightningService(config);
}

// Export des types
export type { 
  DazNodeInvoice, 
  InvoiceParams, 
  InvoiceStatus 
}; 