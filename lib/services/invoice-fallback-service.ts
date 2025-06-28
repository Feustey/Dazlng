/**
 * Service de fallback pour la génération de factures
 * Alternative si api.dazno.de n'est pas disponible
 */

import { Invoice, InvoiceStatus, CreateInvoiceParams, LightningService } from '@/types/lightning';

type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';
import { createDazNodeLightningService } from './daznode-lightning-service';
import { createLightningService } from './lightning-service';
import { logger } from '@/lib/logger';

export interface FallbackConfig {
  maxRetries: number;
  retryDelay: number;
  healthCheckInterval: number;
  enableLocalLnd: boolean;
  enableMockService: boolean;
}

export interface ServiceHealth {
  isOnline: boolean;
  provider: string;
  lastCheck: Date;
  latency?: number;
}

const DEFAULT_CONFIG: FallbackConfig = {
  maxRetries: parseInt(process.env.LIGHTNING_FALLBACK_MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.LIGHTNING_FALLBACK_RETRY_DELAY || '2000'),
  healthCheckInterval: parseInt(process.env.LIGHTNING_FALLBACK_HEALTH_CHECK_INTERVAL || '30000'),
  enableLocalLnd: process.env.LIGHTNING_FALLBACK_ENABLE_LOCAL_LND !== 'false',
  enableMockService: process.env.LIGHTNING_FALLBACK_ENABLE_MOCK === 'true' || process.env.NODE_ENV === 'development',
};

export class InvoiceFallbackService implements LightningService {
  private config: FallbackConfig;
  private services: LightningService[] = [];
  private serviceHealth: Map<string, ServiceHealth> = new Map();
  private healthCheckTimer?: NodeJS.Timeout;

  constructor(config?: Partial<FallbackConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeServices();
    this.startHealthCheck();
  }

  private initializeServices(): void {
    // Service principal: api.dazno.de
    this.services.push(createDazNodeLightningService());

    // Service de fallback: LND local
    if (this.config.enableLocalLnd) {
      this.services.push(createLightningService());
    }

    // Service mock pour les tests/développement
    if (this.config.enableMockService) {
      this.services.push(new MockLightningService());
    }

    logger.info(`InvoiceFallbackService: ${this.services.length} services initialisés`);
  }

  private async checkServiceHealth(service: LightningService, provider: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const health = await service.healthCheck();
      const latency = Date.now() - startTime;
      
      return {
        isOnline: health.isOnline,
        provider: health.provider || provider,
        lastCheck: new Date(),
        latency,
      };
    } catch (error) {
      logger.error(`Health check failed for ${provider}:`, error);
      return {
        isOnline: false,
        provider,
        lastCheck: new Date(),
      };
    }
  }

  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(async () => {
      for (let i = 0; i < this.services.length; i++) {
        const service = this.services[i];
        const provider = i === 0 ? 'dazno-api' : i === 1 ? 'local-lnd' : 'mock';
        const health = await this.checkServiceHealth(service, provider);
        this.serviceHealth.set(provider, health);
      }
    }, this.config.healthCheckInterval);
  }

  private async getHealthyService(): Promise<{ service: LightningService; provider: string } | null> {
    // Vérifier d'abord le service principal
    const daznoHealth = this.serviceHealth.get('dazno-api');
    if (daznoHealth?.isOnline) {
      return { service: this.services[0], provider: 'dazno-api' };
    }

    // Chercher un service de fallback disponible
    for (const [provider, health] of this.serviceHealth) {
      if (health.isOnline && provider !== 'dazno-api') {
        const serviceIndex = provider === 'local-lnd' ? 1 : 2;
        if (this.services[serviceIndex]) {
          return { service: this.services[serviceIndex], provider };
        }
      }
    }

    return null;
  }

  private async retryWithDelay<T>(
    operation: () => Promise<T>,
    retries: number = this.config.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        logger.warn(`Opération échouée, tentative ${this.config.maxRetries - retries + 1}/${this.config.maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.retryWithDelay(operation, retries - 1);
      }
      throw error;
    }
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    const operation = async (): Promise<Invoice> => {
      const healthyService = await this.getHealthyService();
      
      if (!healthyService) {
        throw new Error('Aucun service Lightning disponible');
      }

      logger.info(`Génération facture via ${healthyService.provider}`);
      return await healthyService.service.generateInvoice(params);
    };

    return this.retryWithDelay(operation);
  }

  async checkInvoiceStatus(paymentHash: string): Promise<any> {
    const operation = async () => {
      const healthyService = await this.getHealthyService();
      
      if (!healthyService) {
        throw new Error('Aucun service Lightning disponible');
      }

      return await healthyService.service.checkInvoiceStatus(paymentHash);
    };

    return this.retryWithDelay(operation);
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    const healthyService = await this.getHealthyService();
    
    if (!healthyService) {
      params.onError(new Error('Aucun service Lightning disponible'));
      return;
    }

    return healthyService.service.watchInvoice(params);
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    const healthyService = await this.getHealthyService();
    
    if (healthyService) {
      return {
        isOnline: true,
        provider: `fallback-${healthyService.provider}`,
      };
    }

    return {
      isOnline: false,
      provider: 'fallback-none',
    };
  }

  getServicesStatus(): Record<string, ServiceHealth> {
    return Object.fromEntries(this.serviceHealth);
  }

  async forceHealthCheck(): Promise<void> {
    for (let i = 0; i < this.services.length; i++) {
      const service = this.services[i];
      const provider = i === 0 ? 'dazno-api' : i === 1 ? 'local-lnd' : 'mock';
      const health = await this.checkServiceHealth(service, provider);
      this.serviceHealth.set(provider, health);
    }
  }

  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }
}

/**
 * Service mock pour les tests et le développement
 */
class MockLightningService implements LightningService {
  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    // Génération d'une facture mock
    const mockHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: mockHash,
      paymentRequest: `lnbc${params.amount}1pvjluez...mock`,
      paymentHash: mockHash,
      amount: params.amount,
      description: params.description,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (params.expiry || 3600) * 1000).toISOString(),
      status: 'pending' as PaymentStatus,
      metadata: { ...params.metadata, isMock: true },
    };
  }

  async checkInvoiceStatus(paymentHash: string): Promise<any> {
    // Simulation d'un statut aléatoire pour les tests
    const statuses: PaymentStatus[] = ['pending', 'settled', 'expired'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      amount: 1000,
      settledAt: randomStatus === 'settled' ? new Date().toISOString() : undefined,
      metadata: { isMock: true },
    };
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    // Simulation d'un paiement après 5 secondes pour les tests
    setTimeout(async () => {
      try {
        await params.onPaid();
      } catch (error) {
        params.onError(error instanceof Error ? error : new Error('Mock error'));
      }
    }, 5000);
  }

  async healthCheck(): Promise<{ isOnline: boolean; provider: string }> {
    return { isOnline: true, provider: 'mock-lightning' };
  }
}

// Factory function
export function createInvoiceFallbackService(config?: Partial<FallbackConfig>): InvoiceFallbackService {
  return new InvoiceFallbackService(config);
}