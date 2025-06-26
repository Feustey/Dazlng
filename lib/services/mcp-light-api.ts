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
  historical_data?: Record<string, unknown>;
  network_position?: Record<string, unknown>;
  performance_metrics?: Record<string, unknown>;
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
    details?: Record<string, unknown>;
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
  metadata: Record<string, unknown>;
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
  parameters: Record<string, unknown>;
}

export interface SimulationResult {
  success: boolean;
  data: Record<string, unknown>;
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

// Nouvelles interfaces pour les endpoints DazFlow index
export interface DazFlowAnalysis {
  node_id: string;
  dazflow_capacity: number;
  success_probability: number;
  liquidity_efficiency: number;
  network_centrality: number;
  bottlenecks_count: number;
  reliability_curve: ReliabilityPoint[];
  bottlenecks: Bottleneck[];
  recommendations: DazFlowRecommendation[];
  timestamp: string;
}

export interface ReliabilityPoint {
  amount: number;
  probability: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  recommended: boolean;
}

export interface Bottleneck {
  channel_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'liquidity_imbalance' | 'low_liquidity' | 'fee_misalignment' | 'connectivity_issue';
  description: string;
  impact_score: number;
  suggested_actions: string[];
}

export interface DazFlowRecommendation {
  id: string;
  type: 'channel_optimization' | 'fee_adjustment' | 'liquidity_rebalancing' | 'connectivity_improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expected_impact: {
    revenue_increase: number;
    risk_reduction: number;
    implementation_cost: number;
  };
  implementation_steps: string[];
  estimated_roi: number;
}

export interface NetworkHealthAnalysis {
  global_metrics: {
    average_dazflow_capacity: number;
    network_efficiency: number;
    bottleneck_distribution: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  recommendations: {
    network_wide: string[];
    node_specific: Record<string, string[]>;
  };
  timestamp: string;
}

export interface DazFlowOptimizationRequest {
  node_id: string;
  optimization_target: 'revenue_maximization' | 'risk_minimization' | 'balanced';
  constraints?: {
    max_channels?: number;
    max_liquidity?: number;
    min_fees?: number;
  };
}

export interface DazFlowOptimizationResponse {
  optimization_id: string;
  current_performance: {
    dazflow_capacity: number;
    success_probability: number;
    estimated_revenue: number;
  };
  optimized_performance: {
    dazflow_capacity: number;
    success_probability: number;
    estimated_revenue: number;
  };
  improvements: {
    capacity_increase: number;
    probability_increase: number;
    revenue_increase: number;
  };
  recommendations: DazFlowRecommendation[];
  implementation_plan: {
    steps: string[];
    estimated_time: string;
    estimated_cost: number;
  };
}

import type {
  RAGAdvancedQuery,
  RAGQueryResponse,
  RAGEvaluationRequest,
  RAGEvaluationResponse,
  RAGExpansionRequest,
  RAGExpansionResponse,
  RAGCacheStats,
  RAGCacheInvalidationRequest,
  RAGCacheInvalidationResponse,
  LightningRAGQuery,
  LightningRAGResponse,
  LightningOptimizationRequest,
  LightningOptimizationResponse
} from '../../types/rag-advanced';

class MCPLightAPI {
  private baseURL: string | null = null;
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

      this.credentials = await (response ?? Promise.reject(new Error("response is null"))).json();
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
      const success = await (this ?? Promise.reject(new Error("this is null"))).initialize();
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
        'Authorization': `Bearer ${this.credentials?.jwt_token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...defaultOptions,
      ...options
    });

    if (!response.ok) {
      const errorData = await (response ?? Promise.reject(new Error("response is null"))).text();
      throw new Error(`API Error ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  /**
   * Vérifie l'état de santé de l'API
   */
  async checkHealth(): Promise<{ status: string; timestamp: string; services?: Record<string, unknown> }> {
    return this.makeRequest('/health');
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
  async createRAGDocument(content: string, metadata: Record<string, unknown>) {
    return this.makeRequest('/api/v1/rag/documents', {
      method: 'POST',
      body: JSON.stringify({ content, metadata })
    });
  }

  async createRAGDocumentsBatch(documents: Array<{ content: string; metadata: Record<string, unknown> }>) {
    return this.makeRequest('/api/v1/rag/documents/batch', {
      method: 'POST',
      body: JSON.stringify({ documents })
    });
  }

  async getRAGDocument(documentId: string) {
    return this.makeRequest(`/api/v1/rag/documents/${documentId}`);
  }

  // --- Requêtes avancées ---
  async advancedRAGQuery(query: RAGAdvancedQuery): Promise<RAGQueryResponse> {
    return this.makeRequest('/api/v1/rag/query', {
      method: 'POST',
      body: JSON.stringify(query)
    });
  }
  async evaluateRAGResponse(payload: RAGEvaluationRequest): Promise<RAGEvaluationResponse> {
    return this.makeRequest('/api/v1/rag/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async expandRAGQuery(payload: RAGExpansionRequest): Promise<RAGExpansionResponse> {
    return this.makeRequest('/api/v1/rag/expansion', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Cache RAG ---
  async getRAGCacheStats(): Promise<RAGCacheStats> {
    return this.makeRequest('/api/v1/rag/cache/stats');
  }
  async invalidateRAGCache(payload: RAGCacheInvalidationRequest): Promise<RAGCacheInvalidationResponse> {
    return this.makeRequest('/api/v1/rag/cache/invalidate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Intégration Lightning-RAG ---
  async integratedNodeQuery(payload: LightningRAGQuery): Promise<LightningRAGResponse> {
    return this.makeRequest('/api/v1/integrated/node_query', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async lightningOptimizeWithRAG(payload: LightningOptimizationRequest): Promise<LightningOptimizationResponse> {
    return this.makeRequest('/api/v1/lightning/optimize', {
      method: 'POST',
      body: JSON.stringify(payload)
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
  async getAdminMetrics(): Promise<Record<string, unknown>> {
    return this.makeRequest('/admin/metrics');
  }

  async performMaintenance(action: string): Promise<Record<string, unknown>> {
    return this.makeRequest('/admin/maintenance', {
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

  async decodePayment(bolt11: string): Promise<Record<string, unknown>> {
    return this.makeRequest('/lnbits/decode', {
      method: 'POST',
      body: JSON.stringify({ bolt11 })
    });
  }

  async payBolt11(bolt11: string): Promise<Record<string, unknown>> {
    return this.makeRequest('/lnbits/pay', {
      method: 'POST',
      body: JSON.stringify({ bolt11 })
    });
  }

  async getChannels(): Promise<LNBitsChannel[]> {
    return this.makeRequest<LNBitsChannel[]>('/api/v1/channels');
  }

  // Nouvelle méthode pour l'endpoint Automatisation
  async getConfig(): Promise<Record<string, unknown>> {
    return this.makeRequest('/lnbits/config');
  }

  // Nouvelles méthodes pour les endpoints DazFlow index
  
  /**
   * Analyse DazFlow Index d'un nœud
   */
  async getDazFlowAnalysis(nodeId: string): Promise<DazFlowAnalysis> {
    try {
      return await this.makeRequest<DazFlowAnalysis>(`/analytics/dazflow/node/${nodeId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse DazFlow:', error);
      throw new Error(`Impossible d'analyser le nœud ${nodeId}: ${error}`);
    }
  }

  /**
   * Courbe de fiabilité d'un nœud
   */
  async getReliabilityCurve(nodeId: string): Promise<ReliabilityPoint[]> {
    try {
      return await this.makeRequest<ReliabilityPoint[]>(`/analytics/reliability/curve/${nodeId}`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la courbe de fiabilité:', error);
      throw new Error(`Impossible de récupérer la courbe de fiabilité pour ${nodeId}: ${error}`);
    }
  }

  /**
   * Identification des goulots d'étranglement
   */
  async getBottlenecks(nodeId: string): Promise<Bottleneck[]> {
    try {
      return await this.makeRequest<Bottleneck[]>(`/analytics/bottlenecks/${nodeId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'identification des goulots:', error);
      throw new Error(`Impossible d'identifier les goulots pour ${nodeId}: ${error}`);
    }
  }

  /**
   * Évaluation de la santé du réseau
   */
  async getNetworkHealth(): Promise<NetworkHealthAnalysis> {
    try {
      return await this.makeRequest<NetworkHealthAnalysis>('/analytics/network-health');
    } catch (error) {
      console.error('❌ Erreur lors de l\'évaluation de la santé réseau:', error);
      throw new Error(`Impossible d'évaluer la santé du réseau: ${error}`);
    }
  }

  /**
   * Optimisation DazFlow Index
   */
  async optimizeDazFlow(request: DazFlowOptimizationRequest): Promise<DazFlowOptimizationResponse> {
    try {
      return await this.makeRequest<DazFlowOptimizationResponse>('/analytics/optimization/dazflow', {
        method: 'POST',
        body: JSON.stringify(request)
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation DazFlow:', error);
      throw new Error(`Impossible d'optimiser le nœud ${request.node_id}: ${error}`);
    }
  }

  // --- ENDPOINTS RAG ---
  async ragQuery(query: RAGAdvancedQuery) {
    return this.makeRequest('/api/v1/rag/query', {
      method: 'POST',
      body: JSON.stringify(query)
    });
  }
  async ragStats() {
    return this.makeRequest('/api/v1/rag/stats', { method: 'GET' });
  }
  async ragIngest(document: { content: string; metadata?: Record<string, unknown> }) {
    return this.makeRequest('/api/v1/rag/ingest', {
      method: 'POST',
      body: JSON.stringify(document)
    });
  }
  async ragHistory(params?: { page?: number; limit?: number }) {
    const url = '/api/v1/rag/history' + (params ? `?page=${params.page ?? 1}&limit=${params.limit ?? 20}` : '');
    return this.makeRequest(url, { method: 'GET' });
  }
  async ragHealth() {
    return this.makeRequest('/api/v1/rag/health', { method: 'GET' });
  }
  async ragAnalyzeNode(payload: { node_pubkey: string; context?: string }) {
    return this.makeRequest('/api/v1/rag/analyze/node', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async ragWorkflowExecute(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/rag/workflow/execute', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async ragValidate(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/rag/validate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async ragBenchmark(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/rag/benchmark', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async ragAssetsList() {
    return this.makeRequest('/api/v1/rag/assets/list', { method: 'GET' });
  }
  async ragAsset(asset_id: string) {
    return this.makeRequest(`/api/v1/rag/assets/${asset_id}`, { method: 'GET' });
  }
  async ragCacheClear() {
    return this.makeRequest('/api/v1/rag/cache/clear', { method: 'POST' });
  }
  async ragCacheStats() {
    return this.makeRequest('/api/v1/rag/cache/stats', { method: 'GET' });
  }

  // --- ENDPOINTS INTELLIGENCE ---
  async intelligenceNodeAnalyze(payload: { node_pubkey: string; context?: string }) {
    return this.makeRequest('/api/v1/intelligence/node/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceNetworkAnalyze(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/network/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceOptimizationRecommend(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/optimization/recommend', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligencePredictionGenerate(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/prediction/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceComparativeAnalyze(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/comparative/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceAlertsConfigure(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/alerts/configure', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceInsightsSummary() {
    return this.makeRequest('/api/v1/intelligence/insights/summary', { method: 'GET' });
  }
  async intelligenceWorkflowAutomated(payload: Record<string, unknown>) {
    return this.makeRequest('/api/v1/intelligence/workflow/automated', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
  async intelligenceHealth() {
    return this.makeRequest('/api/v1/intelligence/health/intelligence', { method: 'GET' });
  }
}

// Instance singleton
export const mcpLightAPI = new MCPLightAPI();

// Export par défaut
export default mcpLightAPI; 