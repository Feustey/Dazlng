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

// ============================================================================
// NOUVEAUX TYPES POUR LES ENDPOINTS LIGHTNING
// ============================================================================

export interface LightningNode {
  pubkey: string;
  alias: string;
  capacity: number;
  channel_count: number;
  uptime_percentage: number;
  last_update: string;
  color: string;
  addresses: string[];
  is_verified: boolean;
  rank: {
    capacity: number;
    channels: number;
    centrality: number;
  };
}

export interface ExplorerParams {
  search?: string;
  sort?: 'capacity:desc' | 'channels:desc' | 'uptime:desc' | 'alias:asc';
  page?: number;
  limit?: number;
  verified_only?: boolean;
}

export interface NodesResponse {
  nodes: LightningNode[];
  total: number;
  page: number;
  limit: number;
}

export interface RankingNode {
  pubkey: string;
  alias: string;
  rank: number;
  value: number;
  change_24h: number;
  is_verified: boolean;
  color: string;
}

export interface RankingsParams {
  metric: 'capacity' | 'channels' | 'revenue' | 'centrality' | 'growth';
  period?: 'current' | 'daily' | 'weekly' | 'monthly';
  limit?: number;
}

export interface RankingsResponse {
  metric: string;
  period: string;
  updated_at: string;
  nodes: RankingNode[];
}

export interface GlobalStatsResponse {
  timestamp: string;
  network_overview: {
    total_nodes: number;
    total_channels: number;
    total_capacity_btc: number;
    avg_channel_size_btc: number;
    network_diameter: number;
  };
  growth_metrics: {
    nodes_24h: number;
    channels_24h: number;
    capacity_24h_btc: number;
    nodes_7d: number;
    channels_7d: number;
    capacity_7d_btc: number;
  };
  health_indicators: {
    reachability_score: number;
    avg_uptime_percentage: number;
    active_channels_ratio: number;
  };
  big_movers: {
    capacity_gainers: Array<{
      pubkey: string;
      alias: string;
      change_btc: number;
      change_percentage: number;
    }>;
    capacity_losers: Array<{
      pubkey: string;
      alias: string;
      change_btc: number;
      change_percentage: number;
    }>;
    new_nodes: Array<{
      pubkey: string;
      alias: string;
      initial_capacity_btc: number;
      channels_count: number;
    }>;
  };
  fee_analysis: {
    avg_base_fee_msat: number;
    avg_fee_rate_ppm: number;
    median_base_fee_msat: number;
    median_fee_rate_ppm: number;
    fee_revenue_24h_btc: number;
  };
}

export interface StatsParams {
  include_movers?: boolean;
  include_fees?: boolean;
}

export interface EnhancedPriorityAction {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'connectivity' | 'efficiency' | 'security' | 'growth' | 'liquidity';
  priority: number;
  impact_score: number;
  implementation_effort: 'low' | 'medium' | 'high';
  estimated_time: string;
  revenue_potential: number;
  risk_level: 'low' | 'medium' | 'high';
  prerequisites: string[];
  steps: string[];
  metrics_to_track: string[];
  amboss_inspired: boolean;
}

export interface PrioritiesEnhancedResponse {
  pubkey: string;
  alias: string;
  timestamp: string;
  node_metrics: {
    capacity_btc: number;
    channel_count: number;
    routing_revenue_7d_sats: number;
    centrality_rank: number;
    uptime_percentage: number;
    fee_rate_avg_ppm: number;
    success_rate: number;
  };
  priority_actions: EnhancedPriorityAction[];
  ai_analysis: {
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    market_position: 'leader' | 'competitive' | 'emerging' | 'struggling';
    recommended_focus: string;
  };
  amboss_features: {
    available_features: string[];
    subscription_tier_required: 'free' | 'basic' | 'premium' | 'enterprise';
    competitive_analysis: boolean;
  };
}

export interface CalculatorParams {
  amount: number;
  from: 'sats' | 'btc' | 'fiat';
  to: 'sats' | 'btc' | 'fiat';
  currency?: 'USD' | 'EUR';
}

export interface CalculatorResponse {
  input: {
    amount: number;
    unit: string;
  };
  output: {
    amount: number;
    unit: string;
  };
  rate: {
    btc_usd: number;
    timestamp: string;
  };
}

export interface DecoderResponse {
  type: 'bolt11' | 'lnurl' | 'node_id' | 'lightning_address' | 'unknown';
  valid: boolean;
  decoded: any; // Structure dépendante du type
}

// ============================================================================
// TYPES EXISTANTS
// ============================================================================

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

// Nouveaux types pour v2.0 Enhanced
export interface EnrichedNodeData {
  pubkey: string;
  timestamp: string;
  sparkseer_data: {
    alias: string;
    total_capacity: number;
    num_channels: number;
    betweenness_rank: number;
    mean_outbound_fee_rate: number;
    htlc_success_rate: number;
    liquidity_flexibility_score: number;
  };
  lnd_data: {
    lnd_available: boolean;
    timestamp: string;
    local_node_info: {
      pubkey: string;
      alias: string;
      version: string;
      block_height: number;
      synced_to_chain: boolean;
      synced_to_graph: boolean;
      num_active_channels: number;
      num_inactive_channels: number;
      num_pending_channels: number;
      num_peers: number;
    } | null;
    network_position: {
      num_nodes: number;
      num_channels: number;
      total_network_capacity: string;
      avg_channel_size: string;
      graph_diameter: number;
    } | null;
    channel_details: Array<{
      channel_id: string;
      remote_pubkey: string;
      capacity: string;
      local_balance: string;
      remote_balance: string;
      total_satoshis_sent: string;
      total_satoshis_received: string;
      num_updates: string;
      private: boolean;
      initiator: boolean;
      uptime: string;
    }>;
    derived_stats: {
      payment_activity: {
        available: boolean;
        total_sent_sats: number;
        total_received_sats: number;
        total_updates: number;
        avg_updates_per_channel: number;
      };
      routing_stats: {
        available: boolean;
        active_channels: number;
        total_channels: number;
        routing_efficiency: number;
        total_capacity: number;
      };
      liquidity_distribution: {
        available: boolean;
        total_local_balance: number;
        total_remote_balance: number;
        local_ratio: number;
        remote_ratio: number;
        balance_score: number;
      };
    } | null;
  };
  combined_insights: {
    data_sources: {
      sparkseer_available: boolean;
      lnd_available: boolean;
    };
    node_classification: string;
    liquidity_status: string;
    routing_capability: string;
    network_position: string;
    maintenance_priority: string;
  };
  enhanced_alerts: IntelligentAlert[];
}

export interface IntelligentAlert {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  suggested_action: string;
  channel_id?: string;
  metric_value: number;
  threshold: number;
}

export interface LNDStatus {
  lnd_available: boolean;
  timestamp: string;
  local_node_info: any;
  network_position: any;
  channel_details: any[];
  derived_stats: any;
}

export interface NetworkStatus {
  source: string;
  timestamp: string;
  network_stats: {
    num_nodes: number;
    num_channels: number;
    total_network_capacity: string;
    avg_channel_size: string;
    graph_diameter: number;
    avg_out_degree: number;
  };
  health_indicators: {
    total_capacity_btc: number;
    avg_channel_size_btc: number;
    node_density: number;
    network_reach: number;
  };
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
   * Effectue une requête authentifiée à l'API
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Impossible d\'initialiser l\'API MCP-Light');
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

  /**
   * �� Récupère le statut enrichi complet d'un nœud (v2.0 Enhanced)
   * Combine SparkSeer + LND + IA pour une vue complète
   */
  async getEnrichedStatus(pubkey: string): Promise<EnrichedNodeData> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }
    
    return this.makeRequest<EnrichedNodeData>(`/api/v1/node/${pubkey}/status/complete`);
  }

  /**
   * 🆕 Récupère les données LND temps réel (v2.0 Enhanced)
   * Données pures du nœud Lightning local
   */
  async getLNDStatus(pubkey: string): Promise<LNDStatus> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }
    
    return this.makeRequest<LNDStatus>(`/api/v1/node/${pubkey}/lnd/status`);
  }

  /**
   * 🆕 Récupère les alertes intelligentes automatiques (v2.0 Enhanced)
   * Alertes proactives avec actions suggérées
   */
  async getIntelligentAlerts(pubkey: string, severity?: 'info' | 'warning' | 'critical'): Promise<IntelligentAlert[]> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }
    
    const params = severity ? `?severity=${severity}` : '';
    return this.makeRequest<IntelligentAlert[]>(`/api/v1/node/${pubkey}/alerts${params}`);
  }

  /**
   * 🆕 Récupère le statut global du réseau Lightning (v2.0 Enhanced)
   * Vue d'ensemble des métriques réseau
   */
  async getNetworkStatus(): Promise<NetworkStatus> {
    return this.makeRequest<NetworkStatus>('/api/v1/network/status');
  }

  /**
   * 🆕 Analyse complète enrichie avec toutes les sources de données (v2.0 Enhanced)
   * SparkSeer + LND + Alertes + Réseau en une seule requête optimisée
   */
  async performCompleteAnalysis(pubkey: string): Promise<{
    enriched_data: EnrichedNodeData;
    alerts: IntelligentAlert[];
    network_status: NetworkStatus;
    analysis_timestamp: string;
  }> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide');
    }

    try {
      // Exécution parallèle pour optimiser les performances
      const [enrichedData, alerts, networkStatus] = await Promise.all([
        this.getEnrichedStatus(pubkey),
        this.getIntelligentAlerts(pubkey),
        this.getNetworkStatus()
      ]);

      return {
        enriched_data: enrichedData,
        alerts: alerts,
        network_status: networkStatus,
        analysis_timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse complète:', error);
      throw error;
    }
  }

  // ============================================================================
  // NOUVEAUX ENDPOINTS LIGHTNING
  // ============================================================================

  /**
   * 🔍 Lightning Network Explorer
   * Recherche et filtrage des nœuds Lightning
   */
  async getLightningNodes(params: ExplorerParams = {}): Promise<NodesResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.verified_only) searchParams.append('verified_only', params.verified_only.toString());

    return this.makeRequest<NodesResponse>(`/api/v1/lightning/explorer/nodes?${searchParams}`);
  }

  /**
   * 🏆 Rankings des Nœuds Lightning
   * Classements par différentes métriques
   */
  async getLightningRankings(params: RankingsParams): Promise<RankingsResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const searchParams = new URLSearchParams();
    searchParams.append('metric', params.metric);
    if (params.period) searchParams.append('period', params.period);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return this.makeRequest<RankingsResponse>(`/api/v1/lightning/rankings?${searchParams}`);
  }

  /**
   * 📊 Statistiques Globales du Réseau Lightning
   * Vue d'ensemble complète du réseau
   */
  async getNetworkGlobalStats(params: StatsParams = {}): Promise<GlobalStatsResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const searchParams = new URLSearchParams();
    if (params.include_movers !== undefined) {
      searchParams.append('include_movers', params.include_movers.toString());
    }
    if (params.include_fees !== undefined) {
      searchParams.append('include_fees', params.include_fees.toString());
    }

    return this.makeRequest<GlobalStatsResponse>(`/api/v1/lightning/network/global-stats?${searchParams}`);
  }

  /**
   * 🎯 Priorities Enhanced - Analyse Avancée des Nœuds
   * Actions prioritaires avec IA inspirées d'Amboss.space
   */
  async getNodePrioritiesEnhanced(pubkey: string): Promise<PrioritiesEnhancedResponse> {
    if (!this.isValidPubkey(pubkey)) {
      throw new Error('Pubkey invalide: doit faire 66 caractères hexadécimaux');
    }

    if (!this.initialized) {
      await this.initialize();
    }

    return this.makeRequest<PrioritiesEnhancedResponse>(`/api/v1/node/${pubkey}/priorities-enhanced`);
  }

  /**
   * 🧮 Calculateur Lightning
   * Conversion entre sats, BTC et devises fiat
   */
  async getLightningCalculator(params: CalculatorParams): Promise<CalculatorResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const searchParams = new URLSearchParams();
    searchParams.append('amount', params.amount.toString());
    searchParams.append('from', params.from);
    searchParams.append('to', params.to);
    if (params.currency) searchParams.append('currency', params.currency);

    return this.makeRequest<CalculatorResponse>(`/api/v1/lightning/calculator?${searchParams}`);
  }

  /**
   * 🔓 Décodeur Lightning
   * Décode les invoices BOLT11, LNURL, adresses Lightning, etc.
   */
  async decodeLightningData(data: string): Promise<DecoderResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.makeRequest<DecoderResponse>('/api/v1/lightning/decoder', {
      method: 'POST',
      body: JSON.stringify({ data })
    });
  }
}

// Instance singleton
export const mcpLightAPI = new MCPLightAPI();

// Export par défaut
export default mcpLightAPI; 