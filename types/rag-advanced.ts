// Types avancés pour RAG et Lightning-RAG

export interface RAGAdvancedQuery {
  query: string;
  context?: string;
  limit?: number;
  filters?: Record<string, unknown>;
  similarity_threshold?: number;
  include_metadata?: boolean;
  response_format?: 'text' | 'structured' | 'hybrid';
}

export interface RAGQueryResponse {
  answer: string;
  sources: RAGDocument[];
  confidence: number;
  metadata: Record<string, unknown>;
  processing_time: number;
}

export interface RAGEvaluationRequest {
  query: string;
  response: string;
  expected_answer?: string;
  context?: string;
}

export interface RAGEvaluationResponse {
  relevance_score: number;
  accuracy_score: number;
  completeness_score: number;
  overall_score: number;
  feedback: string[];
  suggestions: string[];
}

export interface RAGExpansionRequest {
  query: string;
  context?: string;
  expansion_type: 'synonyms' | 'related' | 'semantic' | 'hybrid';
  max_expansions?: number;
}

export interface RAGExpansionResponse {
  original_query: string;
  expanded_queries: string[];
  confidence_scores: number[];
  reasoning: string;
}

export interface RAGCacheStats {
  total_documents: number;
  cache_hits: number;
  cache_misses: number;
  hit_rate: number;
  average_response_time: number;
  memory_usage: number;
  last_updated: string;
}

export interface RAGCacheInvalidationRequest {
  document_ids?: string[];
  filters?: Record<string, unknown>;
  invalidate_all?: boolean;
}

export interface RAGCacheInvalidationResponse {
  invalidated_count: number;
  remaining_documents: number;
  cache_stats: RAGCacheStats;
}

export interface RAGDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Lightning-RAG
export interface LightningRAGQuery {
  node_pubkey: string;
  query: string;
  context?: string;
  include_network_data?: boolean;
  include_historical_data?: boolean;
  response_format?: 'text' | 'structured' | 'actionable';
}

export interface LightningRAGResponse {
  answer: string;
  node_context: {
    pubkey: string;
    alias: string;
    current_stats: Record<string, unknown>;
    relevant_channels: Array<{
      channel_id: string;
      remote_pubkey: string;
      capacity: number;
      relevance_score: number;
    }>;
  };
  network_insights: {
    similar_nodes: Array<{
      pubkey: string;
      alias: string;
      similarity_score: number;
      shared_characteristics: string[];
    }>;
    market_trends: string[];
    opportunities: string[];
  };
  actionable_recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    expected_impact: string;
    implementation_steps: string[];
    estimated_roi: number;
  }>;
  confidence: number;
  sources: RAGDocument[];
}

export interface LightningOptimizationRequest {
  node_pubkey: string;
  optimization_goal: 'revenue_maximization' | 'risk_minimization' | 'efficiency_improvement' | 'network_growth';
  constraints?: {
    max_channels?: number;
    max_liquidity?: number;
    min_fees?: number;
    max_risk_tolerance?: number;
  };
  include_rag_insights?: boolean;
  historical_context?: boolean;
}

export interface LightningOptimizationResponse {
  optimization_id: string;
  node_pubkey: string;
  current_state: {
    capacity: number;
    revenue_estimate: number;
    risk_score: number;
    efficiency_score: number;
  };
  optimized_state: {
    capacity: number;
    revenue_estimate: number;
    risk_score: number;
    efficiency_score: number;
  };
  improvements: {
    capacity_increase: number;
    revenue_increase: number;
    risk_reduction: number;
    efficiency_improvement: number;
  };
  rag_insights: {
    similar_successful_nodes: Array<{
      pubkey: string;
      alias: string;
      success_factors: string[];
      similarity_score: number;
    }>;
    market_opportunities: string[];
    risk_factors: string[];
  };
  implementation_plan: {
    phases: Array<{
      phase: number;
      title: string;
      actions: string[];
      estimated_time: string;
      estimated_cost: number;
      dependencies: string[];
    }>;
    total_estimated_time: string;
    total_estimated_cost: number;
    expected_roi: number;
  };
  monitoring_metrics: {
    kpis: string[];
    alerts: Array<{
      metric: string;
      threshold: number;
      condition: 'above' | 'below';
      action: string;
    }>;
  };
} 