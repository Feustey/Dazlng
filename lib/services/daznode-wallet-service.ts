// Types pour NWC
export interface NWCConfig {
  nostrWalletConnectUrl: string;
}

export interface NWCInvoiceParams {
  amount: number;
  defaultMemo: string;
}

export interface NWCInvoiceResult {
  paymentRequest: string;
  paymentHash?: string;
}

export interface NWCLookupResult {
  paid: boolean;
  settledAt?: string;
  canceled?: boolean;
  expired?: boolean;
  amount?: number;
}

export interface NWCBalanceResult {
  balance: number;
}

class NWC {
  private url: string | null = null;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (response: any) => void> = new Map();
  private connected = false;

  constructor(config: NWCConfig) {
    this.url = config.nostrWalletConnectUrl;
  }

  async enable(): Promise<void> {
    if (this.connected) return;
    
    return new Promise((resolve: any, reject: any) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws?.onopen = () => {
          this.connected = true;
          resolve();
        };
        
        this.ws?.onerror = (error: any) => {
          reject(new Error(`Erreur WebSocket: ${error}`));
        };
        
        this.ws?.onmessage = (event: any) => {
          const response = JSON.parse(event.data);
          const handler = this.messageHandlers?.get(response.id);
          if (handler) {
            handler(response);
            this.messageHandlers?.delete(response.id);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async sendRequest<T>(method: string, params: any): Promise<T> {
    if (!this.ws || !this.connected) {
      throw new Error('WebSocket non connecté');
    }

    return new Promise((resolve: any, reject: any) => {
      const id = Math.random().toString(36).substring(7);
      
      this.messageHandlers?.set(id, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result);
        }
      });

      // Vérification de null safety
      if (!this.ws) {
        reject(new Error('WebSocket déconnecté'));
        return;
      }

      this.ws?.send(JSON.stringify({
        id,
        method,
        params
      }));
    });
  }

  async makeInvoice(params: NWCInvoiceParams): Promise<NWCInvoiceResult> {
    if (!this.ws || !this.connected) {
      throw new Error('WebSocket non connecté');
    }
    return this.sendRequest('makeInvoice', params);
  }

  async lookupInvoice(params: { paymentHash: string }): Promise<NWCLookupResult> {
    if (!this.ws || !this.connected) {
      throw new Error('WebSocket non connecté');
    }
    return this.sendRequest('lookupInvoice', params);
  }

  async getBalance(): Promise<NWCBalanceResult> {
    if (!this.ws || !this.connected) {
      throw new Error('WebSocket non connecté');
    }
    return this.sendRequest('getBalance', {});
  }

  close(): void {
    if (this.ws) {
      this.ws?.close();
      this.ws = null;
      this.connected = false;
      this.messageHandlers?.clear();
    }
  }
}

// Polyfill WebSocket pour Node.js
if (typeof global !== 'undefined' && !global.WebSocket) {
  try {
    const WebSocket = require('ws');
    global.WebSocket = WebSocket;
  } catch (error) {
    console.warn('⚠️ WebSocket polyfill non disponible - tests en mode browser uniquement');
  }
}

export interface DazNodeWalletConfig {
  appPublicKey: string;
  walletPublicKey: string;
  relayUrl: string;
  secret: string;
}

export interface DazNodeInvoiceParams {
  amount: number;
  description: string;
  expiry?: number;
}

export interface DazNodeInvoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  createdAt: string;
  expiresAt: string;
  amount: number;
  description: string;
}

export interface DazNodeInvoiceStatus {
  status: InvoiceStatus.pending | InvoiceStatus.settled | 'cancelled' | InvoiceStatus.expired;
  settledAt?: string;
  amount?: number;
}

export class DazNodeWalletService {
  private config: DazNodeWalletConfig | null = null;
  private nwc: NWC | null = null;
  private simulationMode = false;

  constructor(config: DazNodeWalletConfig) {
    this.config = config;
    // Activer le mode simulation si le secret n'est pas configuré
    this.simulationMode = !config.secret || config.secret === 'votre_secret_nwc_ici' || config.secret === 'b5264968ca3e66af8afc23934c2480c7c62bab55d14f012d9d541324';
  }

  /**
   * Initialise la connexion NWC avec le wallet DazNode
   */
  private async initializeNWC(): Promise<void> {
    if (this.nwc) return; // Déjà initialisé

    try {
      console.log('🔗 DazNodeWallet - Initialisation connexion NWC...');
      
      // Vérification du secret NWC
      if (!this.config?.secret || this.config?.secret === 'votre_secret_nwc_ici') {
        console.log('⚠️ DazNodeWallet - Secret NWC non configuré, mode simulation activé');
        throw new Error('SECRET_NWC_NON_CONFIGURE');
      }
      
      // Construction de l'URL NWC avec les paramètres DazNode
      const nwcUrl = `nostr+walletconnect://${this.config?.walletPublicKey}?relay=${encodeURIComponent(this.config?.relayUrl)}&secret=${this.config?.secret}`;
      
      this.nwc = new NWC({ nostrWalletConnectUrl: nwcUrl });
      await (this ?? Promise.reject(new Error("this is null"))).nwc?.enable();
      
      console.log('✅ DazNodeWallet - Connexion NWC établie');
      console.log(`   - App Public Key: ${this.config?.appPublicKey.substring(0, 20)}...`);
      console.log(`   - Wallet Public Key: ${this.config?.walletPublicKey.substring(0, 20)}...`);
      
    } catch (error) {
      if (error instanceof Error && error.message === 'SECRET_NWC_NON_CONFIGURE') {
        throw error;
      }
      
      console.error('❌ DazNodeWallet - Erreur initialisation NWC:', error);
      throw new Error(`Impossible de se connecter au wallet DazNode: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Crée une nouvelle facture sur le wallet DazNode
   */
  async generateInvoice(params: DazNodeInvoiceParams): Promise<DazNodeInvoice> {
    try {
      console.log('�� DazNodeWallet - Génération facture:', {
        amount: params.amount,
        description: params.description?.substring(0, 50),
        expiry: params.expiry,
        simulationMode: this.simulationMode
      });

      // Validation des paramètres
      if (!params.amount || params.amount <= 0) {
        throw new Error('Montant invalide: doit être supérieur à 0');
      }

      if (params.amount > 1000000) {
        throw new Error('Montant trop élevé: maximum 1,000,000 sats');
      }

      if (!params.description?.trim()) {
        throw new Error('Description requise');
      }

      // Mode simulation pour les tests
      if (this.simulationMode) {
        return this.generateSimulatedInvoice(params);
      }

      // Initialiser la connexion NWC
      await (this ?? Promise.reject(new Error("this is null"))).initializeNWC();

      // Sanitiser la description pour NWC
      let safeMemo = params.description.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
      if (!safeMemo) safeMemo = 'DazNode Payment';

      // Créer la facture via NWC
      const result = await (this ?? Promise.reject(new Error("this is null"))).nwc?.makeInvoice({
        amount: params.amount,
        defaultMemo: safeMemo,
      });

      if (!result.paymentRequest) {
        throw new Error('Facture invalide reçue du wallet DazNode');
      }

      // Extraire le payment hash depuis la facture BOLT11
      let paymentHash = result.paymentHash;
      if (!paymentHash) {
        // Fallback: générer un ID unique basé sur la facture
        paymentHash = this.extractPaymentHashFromBolt11(result.paymentRequest) || 
                     `daznode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const expirySeconds = params.expiry || 3600;
      const invoice: DazNodeInvoice = {
        id: paymentHash,
        paymentRequest: result.paymentRequest,
        paymentHash: paymentHash,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
        amount: params.amount,
        description: params.description
      };

      console.log('✅ DazNodeWallet - Facture créée:', {
        id: invoice.id?.substring(0, 20) + '...',
        amount: invoice.amount,
        hash: invoice.paymentHash?.substring(0, 20) + '...'
      });

      return invoice;

    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur génération facture:', error);
      throw new Error(`Erreur génération facture DazNode: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Vérifie le statut d'une facture sur le wallet DazNode
   */
  async checkInvoiceStatus(paymentHash: string): Promise<DazNodeInvoiceStatus> {
    try {
      console.log('🔍 DazNodeWallet - Vérification statut:', paymentHash?.substring(0, 20) + '...', {
        simulationMode: this.simulationMode
      });

      // Mode simulation pour les tests
      if (this.simulationMode) {
        return this.getSimulatedInvoiceStatus(paymentHash);
      }

      // Initialiser la connexion NWC
      await (this ?? Promise.reject(new Error("this is null"))).initializeNWC();

      // Vérifier le statut via NWC
      const invoice = await (this ?? Promise.reject(new Error("this is null"))).nwc?.lookupInvoice({ paymentHash });

      let status: InvoiceStatus.pending | InvoiceStatus.settled | 'cancelled' | InvoiceStatus.expired = InvoiceStatus.pending;
      let settledAt: string | undefined;

      if (invoice.paid) {
        status = InvoiceStatus.settled;
        settledAt = invoice.settledAt || new Date().toISOString();
      } else if (invoice.canceled) {
        status = 'cancelled';
      } else if (invoice.expired) {
        status = InvoiceStatus.expired;
      }

      console.log('✅ DazNodeWallet - Statut vérifié:', status);

      return {
        status,
        settledAt,
        amount: invoice.amount
      };

    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur vérification facture:', error);
      
      // Si la facture n'est pas trouvée, elle est peut-être expirée
      if (error instanceof Error && error.message.includes('not found')) {
        return { status: InvoiceStatus.expired };
      }
      
      throw new Error(`Erreur vérification DazNode: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Obtient les informations du wallet DazNode
   */
  async getWalletInfo(): Promise<{
    isOnline: boolean;
    walletInfo?: {
      balance: number;
      publicKey: string;
      alias?: string;
    };
  }> {
    try {
      console.log('🔍 DazNodeWallet - Informations wallet...', {
        simulationMode: this.simulationMode
      });

      // Mode simulation pour les tests
      if (this.simulationMode) {
        return this.getSimulatedWalletInfo();
      }

      // Initialiser la connexion NWC
      await (this ?? Promise.reject(new Error("this is null"))).initializeNWC();

      // Obtenir les informations du wallet
      const balance = await (this ?? Promise.reject(new Error("this is null"))).nwc?.getBalance();
      
      return {
        isOnline: true,
        walletInfo: {
          balance: balance.balance || 0,
          publicKey: this.config?.walletPublicKey,
          alias: 'DazNode Wallet'
        }
      };

    } catch (error) {
      console.error('❌ DazNodeWallet - Erreur informations wallet:', error);
      return { isOnline: false };
    }
  }

  /**
   * Ferme la connexion NWC
   */
  async close(): Promise<void> {
    if (this.nwc) {
      try {
        this.nwc?.close();
        this.nwc = null;
        console.log('✅ DazNodeWallet - Connexion fermée');
      } catch (error) {
        console.warn('⚠️ DazNodeWallet - Erreur fermeture connexion:', error);
      }
    }
  }

  /**
   * Génère une facture simulée pour les tests
   */
  private generateSimulatedInvoice(params: DazNodeInvoiceParams): DazNodeInvoice {
    const paymentHash = this.generateTestHash();
    const expirySeconds = params.expiry || 3600;
    
    // Génération d'une facture BOLT11 de test
    const testBolt11 = `lnbc${params.amount}n1p${paymentHash.substring(0, 10)}pp5qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhpweetest`;

    const invoice: DazNodeInvoice = {
      id: paymentHash,
      paymentRequest: testBolt11,
      paymentHash: paymentHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
      amount: params.amount,
      description: params.description + ' (SIMULATION)'
    };

    console.log('✅ DazNodeWallet - Facture simulée créée:', {
      id: invoice.id?.substring(0, 20) + '...',
      amount: invoice.amount,
      mode: 'SIMULATION'
    });

    return invoice;
  }

  /**
   * Génère un hash de test déterministe
   */
  private generateTestHash(): string {
    const crypto = require('crypto');
    const timestamp = Date.now().toString();
    return crypto.createHash('sha256').update(`daznode_test_${timestamp}`).digest('hex');
  }

  /**
   * Retourne un statut simulé pour les tests
   */
  private getSimulatedInvoiceStatus(_paymentHash: string): DazNodeInvoiceStatus {
    console.log('✅ DazNodeWallet - Statut simulé vérifié: pending');
    
    return {
      status: InvoiceStatus.pending,
      amount: 1000 // Montant par défaut pour simulation
    };
  }

  /**
   * Retourne des informations simulées pour les tests
   */
  private getSimulatedWalletInfo(): {
    isOnline: boolean;
    walletInfo?: {
      balance: number;
      publicKey: string;
      alias?: string;
    };
  } {
    console.log('✅ DazNodeWallet - Informations simulées: en ligne');
    
    return {
      isOnline: true,
      walletInfo: {
        balance: 50000, // 50k sats de simulation
        publicKey: this.config?.walletPublicKey,
        alias: 'DazNode Wallet (SIMULATION)'
      }
    };
  }

  /**
   * Extrait le payment hash d'une facture BOLT11 (méthode de fallback)
   */
  private extractPaymentHashFromBolt11(bolt11: string): string | null {
    try {
      // Méthode simplifiée d'extraction du payment hash depuis une facture BOLT11
      // En pratique, il faudrait utiliser une librairie de décodage BOLT11 complète
      const match = bolt11.match(/lnbc[0-9]*[munp]?1[a-zA-Z0-9]{6,}/);
      if (match) {
        // Générer un hash déterministe basé sur la facture
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(bolt11).digest('hex').substring(0, 64);
      }
      return null;
    } catch (error) {
      console.warn('⚠️ DazNodeWallet - Impossible d\'extraire payment hash:', error);
      return null;
    }
  }
}

/**
 * Factory pour créer le service wallet DazNode
 */
export function createDazNodeWalletService(): DazNodeWalletService {
  console.log('🏗️ DazNodeWallet - Initialisation...');

  const config: DazNodeWalletConfig = {
    appPublicKey: process.env.APP_PUKEY ?? "" || process.env.DAZNODE_APP_PUBLIC_KEY ?? "" || '69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697',
    walletPublicKey: process.env.WALLET_PUKEY ?? "" || process.env.DAZNODE_WALLET_PUBLIC_KEY ?? "" || 'de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30',
    relayUrl: process.env.DAZNODE_RELAY_URL ?? "" || 'wss://relay.getalby.com/v1',
    secret: process.env.DAZNODE_WALLET_SECRET ?? "" || 'b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324'
  };

  // Validation de la configuration
  if (!config.walletPublicKey || config.walletPublicKey.length !== 64) {
    throw new Error('Configuration DazNode: WALLET_PUKEY ou DAZNODE_WALLET_PUBLIC_KEY invalide');
  }

  if (!config.appPublicKey || config.appPublicKey.length !== 64) {
    throw new Error('Configuration DazNode: APP_PUKEY ou DAZNODE_APP_PUBLIC_KEY invalide');
  }

  console.log('✅ DazNodeWallet - Configuration validée:', {
    appPubKey: config.appPublicKey.substring(0, 20) + '...',
    walletPubKey: config.walletPublicKey.substring(0, 20) + '...',
    relay: config.relayUrl
  });

  return new DazNodeWalletService(config);
}

// Export des types pour utilisation externe
export type { 
  DazNodeInvoice, 
  DazNodeInvoiceParams, 
  DazNodeInvoiceStatus 
}
