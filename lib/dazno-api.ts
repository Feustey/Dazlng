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
  impact: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  priority: number;
  reasoning?: string;
  
  // Détails SparkSeer
  estimated_gain_sats?: number;
  estimated_timeframe?: string;
  confidence_score?: number;
  
  // Contexte de la recommandation
  category: "channel_management" | "fee_optimizatio\n | "liquidity" | "routing" | "connectivity" | "fees";
  action_type: "open_channel" | "close_channel" | "adjust_fees" | "rebalance" | "other";
  
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
  complexity?: "low" | "medium" | "high";
  prerequisites?: string[];
  expected_outcome?: string;
  confidence?: number;
  
  // Contexte spécifique
  category?: string;
  urgency?: "low" | "medium" | "high";
  cost_estimate?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_DAZNO_API_URL || "https://api.dazno.de";

class DaznoApiClient {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/jso\n,
          ...options?.headers},
        ...options});

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[DaznoAPI] Request failed:", endpoint, error);
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string; services?: any; error?: string }> {
    try {
      return await this.makeRequest("/health");
    } catch (error) {
      // Fallback pour le health check
      console.warn("[DaznoAPI] Health check failed, API may be unavailable:", error);
      return {
        status: "unavailable",
        timestamp: new Date().toISOString(),
        error: "API not available"
      };
    }
  }

  async getNodeInfo(pubkey: string): Promise<NodeInfo> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error("Invalid pubkey format");
    }
    
    try {
      return await this.makeRequest(`/api/v1/node/${pubkey}/info`);
    } catch (error) {
      console.warn("[DaznoAPI] Node info not available, using fallback data:", error);
      // Données de fallback basiques
      return {
        pubkey,
        alias: "Nœud inconnu",
        capacity: 0,
        channels: 0,
        active_channels: 0,
        inactive_channels: 0,
        health_score: 0,
        liquidity_score: 0,
        connectivity_score: 0,
        uptime_percentage: 0,
        routing_revenue_7d: 0,
        forwarding_efficiency: 0,
        network_rank: 0,
        total_network_nodes: 0
      };
    }
  }

  async getRecommendations(pubkey: string): Promise<DaznoRecommendation[]> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error("Invalid pubkey format");
    }
    
    try {
      return await this.makeRequest(`/api/v1/node/${pubkey}/recommendations`);
    } catch (error) {
      console.warn("[DaznoAPI] Recommendations not available, using fallback data:", error);
      // Données de fallback avec recommandations génériques
      return [
        {
          id: "fallback-1",
          type: "channel_optimizatio\n,
          title: "Optimiser la gestion des canaux",
          description: "Analysez vos canaux et optimisez leur configuratio\n,
          impact: "medium" as const,
          difficulty: "medium" as const,
          priority: 1,
          category: "channel_management" as const,
          action_type: "other" as const,
          free: true,
          estimated_gain_sats: 1000
        },
        {
          id: "fallback-2",
          type: "fee_adjustment",
          title: "Ajuster les frais de routing",
          description: "Optimisez vos frais pour maximiser les revenus",
          impact: "high" as const,
          difficulty: "easy" as const,
          priority: 2,
          category: "fee_optimizatio\n as const,
          action_type: "adjust_fees" as const,
          free: true,
          estimated_gain_sats: 2500
        },
        {
          id: "fallback-3",
          type: "liquidity_management",
          title: "Équilibrer la liquidité",
          description: "Équilibrez vos canaux pour améliorer l'efficacité de votre routing",
          impact: "medium" as const,
          difficulty: "hard" as const,
          priority: 3,
          category: "liquidity" as const,
          action_type: "rebalance" as const,
          free: false,
          requires_premium: true,
          estimated_gain_sats: 1500
        }
      ];
    }
  }

  async getPriorityActions(pubkey: string): Promise<PriorityAction[]> {
    if (!pubkey || pubkey.length !== 66) {
      throw new Error("Invalid pubkey format");
    }
    
    try {
      return await this.makeRequest(`/api/v1/node/${pubkey}/priorities`);
    } catch (error) {
      console.warn("[DaznoAPI] Priority actions not available, using fallback data:", error);
      // Données de fallback avec actions prioritaires génériques
      return [
        {
          id: "priority-1",
          action: "Optimiser la configuration des frais",
          priority: 1,
          estimated_impact: 20,
          reasoning: "Amélioration significative des revenus de routage",
          timeline: "1-2 semaines",
          complexity: "medium",
          category: "fees",
          urgency: "high"
        },
        {
          id: "priority-2",
          action: "Ouvrir de nouveaux canaux stratégiques",
          priority: 2,
          estimated_impact: 15,
          reasoning: "Amélioration de la connectivité et de la centralité",
          timeline: "2-4 semaines",
          complexity: "high",
          category: "connectivity",
          urgency: "medium"
        }
      ];
    }
  }
}

export const daznoApi = new DaznoApiClient();

// Fonctions utilitaires pour l'intégration
export function isValidLightningPubkey(pubkey: string): boolean {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

export function mapDaznoRecommendationToLocal(rec: DaznoRecommendation): {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  isFree: boolean;
  estimatedGain: number;
  timeToImplement: string;
  category: "liquidity" | "routing" | "efficiency" | "security";
} {
  return {
    id: rec.id,
    title: rec.title,
    description: rec.description,
    impact: rec.impact,
    difficulty: rec.difficulty,
    isFree: rec.free,
    estimatedGain: rec.estimated_gain_sats || 0,
    timeToImplement: rec.difficulty === "easy" ? "5 minutes" : 
                     rec.difficulty === "medium" ? "15 minutes" : 
                     "30+ minutes",
    category: rec.category as "liquidity" | "routing" | "efficiency" | "security"
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