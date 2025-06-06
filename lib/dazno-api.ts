// Client API pour les services DazNode externes
export interface NodeInfo {
  pubkey: string;
  alias?: string;
  
  // Métriques de base SparkSeer
  capacity?: number;
  channels?: number;
  active_channels?: number;
  inactive_channels?: number;
  
  // Métriques de centralité et connectivité
  betweenness_centrality?: number;
  closeness_centrality?: number;
  eigenvector_centrality?: number;
  
  // Métriques de frais et routing
  base_fee_median?: number;
  fee_rate_median?: number;
  htlc_minimum_msat?: number;
  htlc_maximum_msat?: number;
  
  // Métriques de performance
  routed_payments_7d?: number;
  routing_revenue_7d?: number;
  forwarding_efficiency?: number;
  uptime_percentage?: number;
  
  // Métriques réseau
  network_rank?: number;
  total_network_nodes?: number;
  peer_count?: number;
  
  // Données historiques
  capacity_history?: number[];
  routing_history?: number[];
  
  // Scores calculés
  health_score?: number;
  liquidity_score?: number;
  connectivity_score?: number;
}

export interface DaznoRecommendation {
  id: string;
  type: string; // SparkSeer recommendation type
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  
  // Détails SparkSeer
  estimated_gain_sats?: number;
  estimated_timeframe?: string;
  confidence_score?: number;
  
  // Contexte de la recommandation
  category: 'channel_management' | 'fee_optimization' | 'liquidity' | 'routing' | 'connectivity';
  action_type: 'open_channel' | 'close_channel' | 'adjust_fees' | 'rebalance' | 'other';
  
  // Données additionnelles SparkSeer
  target_pubkey?: string;
  target_alias?: string;
  suggested_amount?: number;
  current_value?: number;
  suggested_value?: number;
  
  // Availability
  free: boolean;
  requires_premium?: boolean;
}

export interface PriorityAction {
  id: string;
  action: string;
  priority: number;
  estimated_impact: number;
  reasoning: string;
  
  // Données OpenAI enrichies
  timeline?: string;
  complexity?: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  expected_outcome?: string;
  confidence?: number;
  
  // Contexte spécifique
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
  cost_estimate?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_DAZNO_API_URL || 'https://api.dazno.de';

class DaznoApiClient {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[DaznoAPI] Request failed:', endpoint, error);
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string; services?: any }> {
    return this.makeRequest('/health');
  }

  async getNodeInfo(pubkey: string): Promise<NodeInfo> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error('Invalid pubkey format');
    }
    return this.makeRequest(`/api/v1/node/${pubkey}/info`);
  }

  async getRecommendations(pubkey: string): Promise<DaznoRecommendation[]> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error('Invalid pubkey format');
    }
    return this.makeRequest(`/api/v1/node/${pubkey}/recommendations`);
  }

  async getPriorityActions(pubkey: string, actions?: string[]): Promise<PriorityAction[]> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error('Invalid pubkey format');
    }
    
    const response = await this.makeRequest<any[]>(`/api/v1/node/${pubkey}/priorities`, {
      method: 'POST',
      body: JSON.stringify({ actions: actions || [] }),
    });
    
    // Ajouter un ID si manquant dans la réponse de l'API
    return response.map((action: any, index: number) => ({
      id: action.id || `action-${index}`,
      ...action
    }));
  }
}

// Instance singleton de l'API client
export const daznoApi = new DaznoApiClient();

// Fonctions utilitaires pour l'intégration
export function isValidLightningPubkey(pubkey: string): boolean {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

export function mapDaznoRecommendationToLocal(rec: DaznoRecommendation): {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  isFree: boolean;
  estimatedGain: number;
  timeToImplement: string;
  category: 'liquidity' | 'routing' | 'efficiency' | 'security';
} {
  return {
    id: rec.id,
    title: rec.title,
    description: rec.description,
    impact: rec.impact,
    difficulty: rec.difficulty,
    isFree: rec.free,
    estimatedGain: rec.estimated_gain_sats || 0,
    timeToImplement: rec.difficulty === 'easy' ? '5 minutes' : 
                     rec.difficulty === 'medium' ? '15 minutes' : 
                     '30+ minutes',
    category: rec.category as 'liquidity' | 'routing' | 'efficiency' | 'security'
  };
}

export function mapNodeInfoToStats(nodeInfo: NodeInfo): {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number;
  rankInNetwork: number;
  totalNodes: number;
} {
  return {
    monthlyRevenue: (nodeInfo.routing_revenue_7d || 0) * 4.3, // Estimation mensuelle
    totalCapacity: nodeInfo.capacity || 0,
    activeChannels: nodeInfo.active_channels || nodeInfo.channels || 0,
    uptime: nodeInfo.uptime_percentage || 0,
    healthScore: nodeInfo.health_score || 0,
    routingEfficiency: nodeInfo.forwarding_efficiency || 0,
    revenueGrowth: 0, // À calculer depuis l'historique
    rankInNetwork: nodeInfo.network_rank || 0,
    totalNodes: nodeInfo.total_network_nodes || 0
  };
}

// Hook pour vérifier la disponibilité de l'API
export async function checkApiHealth(): Promise<boolean> {
  try {
    await daznoApi.checkHealth();
    return true;
  } catch {
    return false;
  }
} 