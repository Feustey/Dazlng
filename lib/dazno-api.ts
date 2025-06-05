// Client API pour les services DazNode externes
interface NodeInfo {
  pubkey: string;
  alias?: string;
  capacity?: number;
  channels?: number;
  uptime?: number;
  health_score?: number;
  efficiency?: number;
  rank?: number;
  network_size?: number;
}

interface DaznoRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  estimated_gain?: number;
  category: string;
  action_type: string;
  free: boolean;
}

interface PriorityAction {
  action: string;
  priority: number;
  estimated_impact: number;
  reasoning: string;
}

const API_BASE_URL = 'https://api.dazno.de';

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

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
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
    
    return this.makeRequest(`/api/v1/node/${pubkey}/priorities`, {
      method: 'POST',
      body: JSON.stringify({ actions: actions || [] }),
    });
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
    estimatedGain: rec.estimated_gain || 0,
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
    monthlyRevenue: 0, // À calculer depuis d'autres sources
    totalCapacity: nodeInfo.capacity || 0,
    activeChannels: nodeInfo.channels || 0,
    uptime: nodeInfo.uptime || 0,
    healthScore: nodeInfo.health_score || 0,
    routingEfficiency: nodeInfo.efficiency || 0,
    revenueGrowth: 0, // À calculer
    rankInNetwork: nodeInfo.rank || 0,
    totalNodes: nodeInfo.network_size || 0
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