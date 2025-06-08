/**
 * Service API Umami pour récupérer les métriques de trafic
 * Documentation: https://umami.is/docs/api
 */

export interface UmamiWebsiteStats {
  pageviews: { value: number; change?: number };
  uniques: { value: number; change?: number };
  bounces: { value: number; change?: number };
  totaltime: { value: number; change?: number };
}

export interface UmamiPageView {
  x: string; // Page URL
  y: number; // Visits count
}

export interface UmamiMetrics {
  url: string;
  title?: string;
  referrer?: string;
  bounce?: number;
  views: number;
  visitors: number;
}

export interface UmamiEvent {
  x: string; // Event name
  y: number; // Count
}

export interface UmamiStatsResponse {
  // Stats globales
  pageviews: number;
  uniques: number;
  bounces: number;
  totaltime: number;
  bouncerate: number;
  avgDuration: number;
  
  // Évolution
  pageviewsChange?: number;
  uniquesChange?: number;
  
  // Top pages
  topPages: UmamiPageView[];
  
  // Sources de trafic
  referrers: UmamiMetrics[];
  
  // Événements personnalisés
  events: UmamiEvent[];
  
  // Métriques de temps
  avgSessionDuration: number;
  totalSessions: number;
}

class UmamiApiService {
  private readonly apiUrl: string;
  private readonly websiteId: string;
  private readonly apiToken: string;

  constructor() {
    this.apiUrl = process.env.UMAMI_API_URL || '';
    this.websiteId = process.env.UMAMI_WEBSITE_ID || '';
    this.apiToken = process.env.UMAMI_API_TOKEN || '';

    if (!this.apiUrl || !this.websiteId || !this.apiToken) {
      console.warn('⚠️  Variables d\'environnement Umami manquantes');
    }
  }

  /**
   * Vérifie si Umami est configuré
   */
  isConfigured(): boolean {
    return !!(this.apiUrl && this.websiteId && this.apiToken);
  }

  /**
   * Headers par défaut pour les requêtes API
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Effectue une requête vers l'API Umami
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('Service Umami non configuré');
    }

    const url = `${this.apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: 300 } // Cache 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Erreur API Umami: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur requête Umami:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques de base du site
   */
  async getWebsiteStats(
    startAt?: number, 
    endAt?: number
  ): Promise<UmamiWebsiteStats> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt.toString());
    if (endAt) params.append('endAt', endAt.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest<UmamiWebsiteStats>(`/websites/${this.websiteId}/stats${query}`);
  }

  /**
   * Récupère les métriques détaillées
   */
  async getDetailedMetrics(
    startAt?: number,
    endAt?: number
  ): Promise<UmamiMetrics[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt.toString());
    if (endAt) params.append('endAt', endAt.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest<UmamiMetrics[]>(`/websites/${this.websiteId}/metrics${query}`);
  }

  /**
   * Récupère les pages les plus visitées
   */
  async getPageViews(
    startAt?: number,
    endAt?: number,
    limit: number = 10
  ): Promise<UmamiPageView[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt.toString());
    if (endAt) params.append('endAt', endAt.toString());
    params.append('limit', limit.toString());
    
    const query = `?${params.toString()}`;
    const response = await this.makeRequest<{ data: UmamiPageView[] }>(`/websites/${this.websiteId}/pageviews${query}`);
    return response.data || [];
  }

  /**
   * Récupère les événements personnalisés
   */
  async getEvents(
    startAt?: number,
    endAt?: number,
    limit: number = 10
  ): Promise<UmamiEvent[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt.toString());
    if (endAt) params.append('endAt', endAt.toString());
    params.append('limit', limit.toString());
    
    const query = `?${params.toString()}`;
    const response = await this.makeRequest<{ data: UmamiEvent[] }>(`/websites/${this.websiteId}/events${query}`);
    return response.data || [];
  }

  /**
   * Récupère les sources de trafic (referrers)
   */
  async getReferrers(
    startAt?: number,
    endAt?: number,
    limit: number = 10
  ): Promise<UmamiMetrics[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt.toString());
    if (endAt) params.append('endAt', endAt.toString());
    params.append('limit', limit.toString());
    
    const query = `?${params.toString()}`;
    const response = await this.makeRequest<{ data: UmamiMetrics[] }>(`/websites/${this.websiteId}/referrers${query}`);
    return response.data || [];
  }

  /**
   * Calcule les métriques dérivées
   */
  private calculateDerivedMetrics(stats: UmamiWebsiteStats): {
    bouncerate: number;
    avgDuration: number;
  } {
    const bouncerate = stats.pageviews.value > 0 
      ? (stats.bounces.value / stats.pageviews.value) * 100 
      : 0;
    
    const avgDuration = stats.uniques.value > 0 
      ? stats.totaltime.value / stats.uniques.value 
      : 0;

    return { bouncerate, avgDuration };
  }

  /**
   * API principale - Récupère toutes les métriques Umami en une fois
   */
  async getCompleteStats(
    startAt?: number,
    endAt?: number
  ): Promise<UmamiStatsResponse> {
    try {
      // Récupération parallèle de toutes les données
      const [
        stats,
        topPages,
        referrers,
        events
      ] = await Promise.all([
        this.getWebsiteStats(startAt, endAt),
        this.getPageViews(startAt, endAt, 10).catch(() => []),
        this.getReferrers(startAt, endAt, 10).catch(() => []),
        this.getEvents(startAt, endAt, 10).catch(() => [])
      ]);

      // Calcul des métriques dérivées
      const derived = this.calculateDerivedMetrics(stats);

      return {
        pageviews: stats.pageviews.value,
        uniques: stats.uniques.value,
        bounces: stats.bounces.value,
        totaltime: stats.totaltime.value,
        bouncerate: derived.bouncerate,
        avgDuration: derived.avgDuration,
        pageviewsChange: stats.pageviews.change,
        uniquesChange: stats.uniques.change,
        topPages,
        referrers,
        events,
        avgSessionDuration: derived.avgDuration,
        totalSessions: stats.uniques.value
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des stats Umami:', error);
      
      // Retourner des données par défaut en cas d'erreur
      return {
        pageviews: 0,
        uniques: 0,
        bounces: 0,
        totaltime: 0,
        bouncerate: 0,
        avgDuration: 0,
        topPages: [],
        referrers: [],
        events: [],
        avgSessionDuration: 0,
        totalSessions: 0
      };
    }
  }

  /**
   * Métriques pour une période spécifique (utile pour les comparaisons)
   */
  async getStatsForPeriod(days: number = 30): Promise<UmamiStatsResponse> {
    const endAt = Date.now();
    const startAt = endAt - (days * 24 * 60 * 60 * 1000);
    
    return this.getCompleteStats(startAt, endAt);
  }

  /**
   * Métriques temps réel (dernières 24h)
   */
  async getRealTimeStats(): Promise<UmamiStatsResponse> {
    return this.getStatsForPeriod(1);
  }
}

// Export singleton
export const umamiApi = new UmamiApiService();
export default umamiApi; 