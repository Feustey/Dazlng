/**
 * Client API MCP-Light pour DazNode
 * Gère l'authentification JWT et tous les appels Lightning Network
 * Intégration avec SparkSeer + OpenAI pour l'analyse de nœuds Lightning
 */
export interface MCPLightCredentials {
  jwt_token: string;
  expires_at: string;
  token_type: string;
}

export interface NodeStats {
  alias: string;
  capacity: number;
  channel_count: number;
  centrality_rank?: number;
  htlc_success_rate?: number;
  uptime_percentage?: number;
  peer_count?: number;
  routing_revenue_7d?: number;
  forwarding_efficiency?: number;
}

export interface MCPNodeInfo {
  pubkey: string;
  current_stats: NodeStats;
  historical_data?: any;
  network_position?: any;
  performance_metrics?: any;
}

export interface SparkSeerRecommendation {
  type: string;
  priority: 'low' | 'medium' | 'high';
  reasoning?: string;
  expected_benefit?: string;
  action_type?: string;
  target_pubkey?: string;
  suggested_amount?: number;
  confidence_score?: number;
}

export interface PriorityAction {
  priority: number;
  action: string;
  timeline: string;
  expected_impact: string;
  difficulty: 'low' | 'medium' | 'high';
  category?: string;
  urgency?: 'low' | 'medium' | 'high';
  cost_estimate?: number;
}

export interface MCPRecommendationsResponse {
  pubkey: string;
  timestamp: string;
  recommendations: SparkSeerRecommendation[];
  sparkseer_version?: string;
}

export interface MCPPrioritiesResponse {
  pubkey: string;
  timestamp: string;
  priority_actions: PriorityAction[];
  openai_analysis: string;
  context: string;
  goals: string[];
}

export interface NodeAnalysisResult {
  pubkey: string;
  timestamp: string;
  nodeInfo: MCPNodeInfo;
  recommendations: MCPRecommendationsResponse;
  priorities: MCPPrioritiesResponse;
  summary: NodeSummary;
}

export interface NodeSummary {
  node_alias: string;
  capacity_btc: string;
  capacity_sats: string;
  channel_count: number;
  centrality_rank: string;
  recommendations_count: number;
  priority_actions_count: number;
  health_score: number;
  next_actions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

// Nouvelles interfaces pour les endpoints RAG
export interface RAGDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface RAGQuery {
  query: string;
  context?: string;
  limit?: number;
}

export interface RAGEmbedding {
  text: string;
  embedding: number[];
}

// Nouvelles interfaces pour les endpoints Simulation
export interface SimulationProfile {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface SimulationResult {
  success: boolean;
  data: Record<string, any>;
  metrics: Record<string, number>;
}

// Nouvelles interfaces pour les endpoints LNBits
export interface LNBitsPayment {
  payment_hash: string;
  bolt11: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface LNBitsWallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface LNBitsChannel {
  id: string;
  remote_pubkey: string;
  capacity: number;
  local_balance: number;
  remote_balance: number;
}

class MCPLightAPI {
  private baseURL: string;
  private credentials: MCPLightCredentials | null = null;
  private initialized = false;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DAZNO_API_URL || 'https://api.dazno.de';
  }

  /**
   * Initialise l'API en récupérant les credentials JWT
   * À appeler une seule fois au démarrage de l'app
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      console.log('🔄 Initialisation MCP-Light API...');
      
      const response = await fetch(`${this.baseURL}/auth/credentials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.credentials = await response.json();
      this.initialized = true;
      
      console.log('✅ MCP-Light API initialisée avec succès');
      console.log('🔑 JWT Token valide jusqu\'à:', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString());
      
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation MCP-Light API:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Effectue une requête authentifiée à l'API avec fallback
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        console.warn('⚠️ API MCP-Light indisponible, utilisation du mode fallback');
        throw new Error('API_UNAVAILABLE');
      }
    }

    if (!this.credentials) {
      throw new Error('Aucun credential disponible');
    }

    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.credentials.jwt_token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  /**
   * Vérifie l'état de santé de l'API
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; services?: any }> {
    return this.makeRequest<{ status: string; timestamp: string; services?: any }>('/health');
  }

  /**
   * Récupère les informations complètes d'un nœud Lightning
   * @param pubkey - Clé publique du nœud (66 caractères hex)
   */
  async getNodeInfo(pubkey: string): Promise<MCPNodeInfo> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide: doit faire 66 caractères hexadécimaux');
    }
    
    return this.makeRequest<MCPNodeInfo>(`/api/v1/node/${pubkey}/info`);
  }

  /**
   * Récupère les recommandations SparkSeer pour un nœud
   * @param pubkey - Clé publique du nœud
   */
  async getRecommendations(pubkey: string): Promise<MCPRecommendationsResponse> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }
    
    return this.makeRequest<MCPRecommendationsResponse>(`/api/v1/node/${pubkey}/recommendations`);
  }

  /**
   * Génère des actions prioritaires via OpenAI
   * @param pubkey - Clé publique du nœud
   * @param context - Contexte utilisateur (ex: "Je veux optimiser mes revenus")
   * @param goals - Objectifs (ex: ["increase_revenue", "improve_centrality"])
   */
  async getPriorityActions(
    pubkey: string, 
    context = "Optimisation générale", 
    goals = ["increase_revenue"]
  ): Promise<MCPPrioritiesResponse> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }

    return this.makeRequest<MCPPrioritiesResponse>(`/api/v1/node/${pubkey}/priorities`, {
      method: 'POST',
      body: JSON.stringify({
        context,
        goals
      })
    });
  }

  /**
   * Analyse complète d'un nœud Lightning
   * Récupère toutes les données en parallèle pour optimiser les performances
   */
  async analyzeNode(
    pubkey: string, 
    userContext = "Analyse complète du nœud", 
    userGoals = ["increase_revenue", "improve_centrality"]
  ): Promise<NodeAnalysisResult> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }

    try {
      console.log(`🔍 Analyse du nœud ${pubkey.substring(0, 10)}...`);

      // Exécuter toutes les requêtes en parallèle pour optimiser les performances
      const [nodeInfo, recommendations, priorities] = await Promise.all([
        this.getNodeInfo(pubkey),
        this.getRecommendations(pubkey),
        this.getPriorityActions(pubkey, userContext, userGoals)
      ]);

      const result: NodeAnalysisResult = {
        pubkey,
        timestamp: new Date().toISOString(),
        nodeInfo,
        recommendations,
        priorities,
        summary: this.generateSummary(nodeInfo, recommendations, priorities)
      };

      console.log('✅ Analyse terminée avec succès');
      return result;

    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse du nœud:', error);
      throw error;
    }
  }

  /**
   * Génère un résumé de l'analyse
   */
  private generateSummary(
    nodeInfo: MCPNodeInfo, 
    recommendations: MCPRecommendationsResponse, 
    priorities: MCPPrioritiesResponse
  ): NodeSummary {
    const stats = nodeInfo.current_stats;
    
    return {
      node_alias: stats.alias || 'Nœud Anonyme',
      capacity_btc: (stats.capacity / 100000000).toFixed(4),
      capacity_sats: stats.capacity?.toLocaleString() || 'N/A',
      channel_count: stats.channel_count || 0,
      centrality_rank: stats.centrality_rank?.toString() || 'N/A',
      recommendations_count: recommendations.recommendations?.length || 0,
      priority_actions_count: priorities.priority_actions?.length || 0,
      health_score: this.calculateHealthScore(stats),
      next_actions: priorities.priority_actions?.slice(0, 3).map(action => action.action) || []
    };
  }

  /**
   * Calcule un score de santé simple du nœud
   */
  private calculateHealthScore(stats: NodeStats): number {
    let score = 0;
    let factors = 0;

    // Facteurs positifs
    if (stats.capacity > 10000000) { score += 20; factors++; } // > 0.1 BTC
    if (stats.channel_count > 5) { score += 20; factors++; } // > 5 canaux
    if (stats.centrality_rank && stats.centrality_rank < 5000) { score += 20; factors++; } // Top 5000
    if (stats.htlc_success_rate && stats.htlc_success_rate > 95) { score += 20; factors++; } // > 95% succès
    if (stats.uptime_percentage && stats.uptime_percentage > 99) { score += 20; factors++; } // > 99% uptime

    return factors > 0 ? Math.round(score / factors * 5) : 50; // Score sur 100
  }

  /**
   * Valide le format d'une clé publique Lightning
   */
  isValidPubkey(pubkey: string): boolean {
    return typeof pubkey === 'string' && 
           pubkey.length === 66 && 
           /^[0-9a-fA-F]{66}$/.test(pubkey);
  }

  /**
   * Retourne l'état de l'initialisation
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Retourne les credentials actuels (pour debug)
   */
  getCredentials(): MCPLightCredentials | null {
    return this.credentials;
  }

  /**
   * Force la réinitialisation des credentials
   */
  async reinitialize(): Promise<boolean> {
    this.initialized = false;
    this.credentials = null;
    return this.initialize();
  }

  // Nouvelles méthodes pour les endpoints RAG
  async createDocument(content: string, metadata: Record<string, any>): Promise<RAGDocument> {
    return this.makeRequest<RAGDocument>('/rag/documents', {
      method: 'POST',
      body: JSON.stringify({ content, metadata })
    });
  }

  async createDocumentsBatch(documents: Array<{ content: string; metadata: Record<string, any> }>): Promise<RAGDocument[]> {
    return this.makeRequest<RAGDocument[]>('/rag/documents/batch', {
      method: 'POST',
      body: JSON.stringify({ documents })
    });
  }

  async getDocument(documentId: string): Promise<RAGDocument> {
    return this.makeRequest<RAGDocument>(`/rag/documents/${documentId}`);
  }

  async queryRAG(query: RAGQuery): Promise<any> {
    return this.makeRequest('/rag/query', {
      method: 'POST',
      body: JSON.stringify(query)
    });
  }

  async generateEmbedding(text: string): Promise<RAGEmbedding> {
    return this.makeRequest<RAGEmbedding>('/rag/embed', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async analyzeContent(content: string): Promise<any> {
    return this.makeRequest('/rag/analyze', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  // Nouvelles méthodes pour les endpoints Simulation
  async getSimulationProfiles(): Promise<SimulationProfile[]> {
    return this.makeRequest<SimulationProfile[]>('/api/v1/simulate/profiles');
  }

  async simulateNode(pubkey: string, scenario: string): Promise<SimulationResult> {
    return this.makeRequest<SimulationResult>('/api/v1/simulate/node', {
      method: 'POST',
      body: JSON.stringify({ pubkey, scenario })
    });
  }

  async optimizeNode(pubkey: string): Promise<SimulationResult> {
    return this.makeRequest<SimulationResult>(`/api/v1/optimize/node/${pubkey}`, {
      method: 'POST'
    });
  }

  // Nouvelles méthodes pour les endpoints Administration
  async getAdminMetrics(): Promise<any> {
    return this.makeRequest('/api/v1/admin/metrics');
  }

  async performMaintenance(action: string): Promise<any> {
    return this.makeRequest('/api/v1/admin/maintenance', {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }

  // Nouvelles méthodes pour les endpoints LNBits
  async getPayments(): Promise<LNBitsPayment[]> {
    return this.makeRequest<LNBitsPayment[]>('/api/v1/payments');
  }

  async getWallet(): Promise<LNBitsWallet> {
    return this.makeRequest<LNBitsWallet>('/api/v1/wallet');
  }

  async decodePayment(bolt11: string): Promise<any> {
    return this.makeRequest('/api/v1/payments/decode', {
      method: 'POST',
      body: JSON.stringify({ bolt11 })
    });
  }

  async payBolt11(bolt11: string): Promise<any> {
    return this.makeRequest('/api/v1/payments/bolt11', {
      method: 'POST',
      body: JSON.stringify({ bolt11 })
    });
  }

  async getChannels(): Promise<LNBitsChannel[]> {
    return this.makeRequest<LNBitsChannel[]>('/api/v1/channels');
  }

  // Nouvelle méthode pour l'endpoint Automatisation
  async getConfig(): Promise<any> {
    return this.makeRequest('/config');
  }
}

// Instance singleton
export const mcpLightAPI = new MCPLightAPI();

// Export par défaut
export default mcpLightAPI; 