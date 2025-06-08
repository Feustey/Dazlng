import { LNbitsService } from './lnbits-service';

interface ProviderStatus {
  name: string;
  healthy: boolean;
  responseTime?: number;
  lastError?: string;
  lastCheck: string;
  uptime?: number;
}

interface InvoiceMetrics {
  invoiceId: string;
  provider: string;
  amount: number;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

interface ProviderMetrics {
  totalInvoices: number;
  successfulInvoices: number;
  failedInvoices: number;
  averageResponseTime: number;
  uptime: number;
  lastError?: string;
}

class MonitoringError extends Error {
  constructor(message: string, public provider?: string) {
    super(message);
    this.name = 'MonitoringError';
  }
}

export class LightningMonitor {
  private providers: Map<string, any> = new Map();
  private statusHistory: Map<string, ProviderStatus[]> = new Map();
  private metrics: Map<string, InvoiceMetrics[]> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeProviders();
    this.startHealthChecking();
  }

  /**
   * Initialise les providers Lightning disponibles
   */
  private initializeProviders(): void {
    // Provider LNbits
    try {
      const lnbitsService = new LNbitsService();
      this.providers.set('lnbits', lnbitsService);
      this.statusHistory.set('lnbits', []);
      this.metrics.set('lnbits', []);
      console.log('✅ LNbits provider initialisé');
    } catch (error) {
      console.warn('⚠️ Impossible d\'initialiser LNbits provider:', error instanceof Error ? error.message : error);
      // Ne pas faire échouer le monitoring si LNbits n'est pas disponible
    }

    // Provider NWC (toujours disponible comme fallback)
    this.providers.set('nwc-fallback', null);
    this.statusHistory.set('nwc-fallback', []);
    this.metrics.set('nwc-fallback', []);

    const initializedProviders = Array.from(this.providers.keys());
    console.log(`LightningMonitor - Providers initialisés: ${initializedProviders.join(', ')} (${initializedProviders.length} total)`);
    
    if (initializedProviders.length === 0) {
      console.error('❌ Aucun provider Lightning initialisé !');
    }
  }

  /**
   * Démarre la vérification périodique de la santé des providers
   */
  private startHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Vérification toutes les 30 secondes
    this.healthCheckInterval = setInterval(async () => {
      await this.checkAllProviders();
    }, 30000);

    // Vérification initiale
    this.checkAllProviders();
  }

  /**
   * Arrête le monitoring
   */
  public stopMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Vérifie la santé de tous les providers
   */
  async checkAllProviders(): Promise<ProviderStatus[]> {
    const statuses: ProviderStatus[] = [];

    for (const [name, provider] of this.providers) {
      try {
        const status = await this.checkProviderHealth(name, provider);
        statuses.push(status);
        this.updateStatusHistory(name, status);
      } catch (error) {
        console.error(`Erreur lors de la vérification du provider ${name}:`, error);
        const errorStatus: ProviderStatus = {
          name,
          healthy: false,
          lastError: error instanceof Error ? error.message : String(error),
          lastCheck: new Date().toISOString()
        };
        statuses.push(errorStatus);
        this.updateStatusHistory(name, errorStatus);
      }
    }

    return statuses;
  }

  /**
   * Vérifie la santé d'un provider spécifique
   */
  private async checkProviderHealth(name: string, provider: any): Promise<ProviderStatus> {
    const startTime = Date.now();
    
    try {
      let healthy = false;
      
      if (name === 'lnbits' && provider instanceof LNbitsService) {
        healthy = await provider.healthCheck();
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        name,
        healthy,
        responseTime,
        lastCheck: new Date().toISOString(),
        uptime: this.calculateUptime(name)
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        name,
        healthy: false,
        responseTime,
        lastError: error instanceof Error ? error.message : String(error),
        lastCheck: new Date().toISOString(),
        uptime: this.calculateUptime(name)
      };
    }
  }

  /**
   * Met à jour l'historique de statut d'un provider
   */
  private updateStatusHistory(providerName: string, status: ProviderStatus): void {
    const history = this.statusHistory.get(providerName) || [];
    history.push(status);
    
    // Garde seulement les 100 derniers statuts
    if (history.length > 100) {
      history.shift();
    }
    
    this.statusHistory.set(providerName, history);
  }

  /**
   * Calcule l'uptime d'un provider
   */
  private calculateUptime(providerName: string): number {
    const history = this.statusHistory.get(providerName) || [];
    if (history.length === 0) return 0;
    
    const healthyChecks = history.filter(status => status.healthy).length;
    return (healthyChecks / history.length) * 100;
  }

  /**
   * Enregistre les métriques d'une facture
   */
  async logInvoiceMetrics(
    invoiceId: string,
    provider: string,
    amount: number,
    duration: number,
    success: boolean,
    error?: string
  ): Promise<void> {
    const metrics: InvoiceMetrics = {
      invoiceId,
      provider,
      amount,
      duration,
      success,
      error,
      timestamp: new Date().toISOString()
    };

    const providerMetrics = this.metrics.get(provider) || [];
    providerMetrics.push(metrics);
    
    // Garde seulement les 1000 dernières métriques par provider
    if (providerMetrics.length > 1000) {
      providerMetrics.shift();
    }
    
    this.metrics.set(provider, providerMetrics);

    // Log pour debugging
    console.log('LightningMonitor - Métriques enregistrées:', {
      provider,
      success,
      duration: `${duration}ms`,
      amount: `${amount} sats`,
      error
    });

    // Alertes en cas de problème récurrent
    await this.checkForAlerts(provider);
  }

  /**
   * Vérifie s'il y a des alertes à déclencher
   */
  private async checkForAlerts(provider: string): Promise<void> {
    const metrics = this.metrics.get(provider) || [];
    if (metrics.length < 5) return; // Pas assez de données

    // Vérifie les 5 dernières tentatives
    const recentMetrics = metrics.slice(-5);
    const failureCount = recentMetrics.filter(m => !m.success).length;
    
    // Alerte si 4/5 dernières tentatives ont échoué
    if (failureCount >= 4) {
      console.error(`🚨 ALERTE - Provider ${provider}: ${failureCount}/5 échecs récents`);
      await this.sendAlert(provider, `${failureCount}/5 échecs récents détectés`);
    }

    // Vérifie le temps de réponse moyen
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
    if (avgResponseTime > 10000) { // Plus de 10 secondes
      console.warn(`⚠️ ATTENTION - Provider ${provider}: temps de réponse élevé (${avgResponseTime.toFixed(0)}ms)`);
    }
  }

  /**
   * Envoie une alerte (peut être étendu pour envoyer des emails, webhooks, etc.)
   */
  private async sendAlert(provider: string, message: string): Promise<void> {
    const alertData = {
      provider,
      message,
      timestamp: new Date().toISOString(),
      type: 'provider_failure'
    };

    // Log l'alerte
    console.error('🚨 LIGHTNING ALERT:', alertData);

    // Ici on pourrait ajouter:
    // - Envoi d'email via Resend
    // - Webhook vers Discord/Slack
    // - Notification push
    // - Sauvegarde en base de données

    try {
      // Exemple d'envoi d'email d'alerte
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'admin@dazno.de',
          subject: `🚨 Alerte Lightning - Provider ${provider}`,
          text: `Une alerte a été déclenchée pour le provider Lightning ${provider}:\n\n${message}\n\nTimestamp: ${alertData.timestamp}`
        })
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'alerte email:', error);
    }
  }

  /**
   * Retourne les métriques d'un provider
   */
  getProviderMetrics(provider: string): ProviderMetrics | null {
    const metrics = this.metrics.get(provider);
    if (!metrics || metrics.length === 0) return null;

    const totalInvoices = metrics.length;
    const successfulInvoices = metrics.filter(m => m.success).length;
    const failedInvoices = totalInvoices - successfulInvoices;
    const averageResponseTime = metrics.reduce((sum, m) => sum + m.duration, 0) / totalInvoices;
    const uptime = this.calculateUptime(provider);
    const lastFailure = metrics.filter(m => !m.success).pop();

    return {
      totalInvoices,
      successfulInvoices,
      failedInvoices,
      averageResponseTime: Math.round(averageResponseTime),
      uptime,
      lastError: lastFailure?.error
    };
  }

  /**
   * Retourne le statut actuel de tous les providers
   */
  getCurrentStatus(): Map<string, ProviderStatus> {
    const currentStatus = new Map<string, ProviderStatus>();
    
    for (const [name] of this.providers) {
      const history = this.statusHistory.get(name) || [];
      const lastStatus = history[history.length - 1];
      
      if (lastStatus) {
        currentStatus.set(name, lastStatus);
      }
    }
    
    return currentStatus;
  }

  /**
   * Retourne le meilleur provider disponible
   */
  getBestProvider(): string | null {
    const currentStatus = this.getCurrentStatus();
    
    // Priorise les providers en fonction de leur santé et performance
    const healthyProviders = Array.from(currentStatus.entries())
      .filter(([_, status]) => status.healthy)
      .sort((a, b) => {
        // Trie par uptime décroissant, puis par temps de réponse croissant
        const uptimeDiff = (b[1].uptime || 0) - (a[1].uptime || 0);
        if (uptimeDiff !== 0) return uptimeDiff;
        
        return (a[1].responseTime || Infinity) - (b[1].responseTime || Infinity);
      });

    return healthyProviders.length > 0 ? healthyProviders[0][0] : null;
  }

  /**
   * Retourne des statistiques globales
   */
  getOverallStats(): {
    totalProviders: number;
    healthyProviders: number;
    totalInvoices: number;
    successRate: number;
    averageResponseTime: number;
  } {
    const currentStatus = this.getCurrentStatus();
    const totalProviders = currentStatus.size;
    const healthyProviders = Array.from(currentStatus.values()).filter(s => s.healthy).length;
    
    let totalInvoices = 0;
    let successfulInvoices = 0;
    let totalResponseTime = 0;
    let responseCount = 0;

    for (const [provider] of this.providers) {
      const metrics = this.metrics.get(provider) || [];
      totalInvoices += metrics.length;
      successfulInvoices += metrics.filter(m => m.success).length;
      
      const responseTimes = metrics.map(m => m.duration);
      totalResponseTime += responseTimes.reduce((sum, time) => sum + time, 0);
      responseCount += responseTimes.length;
    }

    return {
      totalProviders,
      healthyProviders,
      totalInvoices,
      successRate: totalInvoices > 0 ? (successfulInvoices / totalInvoices) * 100 : 0,
      averageResponseTime: responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0
    };
  }
}

// Instance singleton pour l'application
export const lightningMonitor = new LightningMonitor();

export { type ProviderStatus, type InvoiceMetrics, type ProviderMetrics, MonitoringError }; 