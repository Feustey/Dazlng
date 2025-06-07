// ============================================================================
// TYPES POUR L'API DAZNO.DE V1
// ============================================================================

export interface DaznoNodeInfo {
  pubkey: string
  alias: string
  capacity_sats: number
  capacity_btc: number
  channels_count: number
  centrality_rank: number
  avg_fees_ppm: number
  htlc_response_time: number
  flexibility_score: number
}

export interface DaznoSparkSeerRecommendation {
  type: 'channel' | 'fee' | 'close'
  action: string
  reason: string
  target_pubkey?: string
  ideal_capacity?: number
  current_fee?: number
  recommended_fee?: number
}

export interface DaznoSparkSeerRecommendations {
  count: number
  recommendations: DaznoSparkSeerRecommendation[]
}

export interface DaznoOpenAIAction {
  priority: number
  action: string
  reasoning: string
  impact: string
  difficulty: 'facile' | 'moyen' | 'difficile'
  timeframe: 'immédiat' | 'court_terme' | 'moyen_terme' | 'long_terme'
  resources?: string[]
  dependencies?: string[]
}

export interface DaznoOpenAIActions {
  count: number
  actions: DaznoOpenAIAction[]
  analysis: string
}

export interface DaznoCompleteResponse {
  pubkey: string
  timestamp: string
  node_info: DaznoNodeInfo
  sparkseer_recommendations: DaznoSparkSeerRecommendations
  openai_actions: DaznoOpenAIActions
  health_score: number
  next_steps: string[]
}

export interface DaznoPriorityRequest {
  context: 'beginner' | 'intermediate' | 'expert'
  goals: ('increase_revenue' | 'improve_connectivity' | 'reduce_costs')[]
  preferences?: {
    risk_tolerance: 'low' | 'medium' | 'high'
    investment_horizon: 'short_term' | 'medium_term' | 'long_term'
    budget_sats?: number
  }
}

export interface DaznoPriorityResponse {
  pubkey: string
  priority_actions: DaznoOpenAIAction[]
  openai_analysis: string
  generated_at: string
  report_files: {
    node_report: string
    openai_recommendations: string
  }
}

export interface DaznoHistoricalStats {
  timestamp: string
  capacity: number
  channels: number
  fee_rate: number
  htlc_time: number
}

export interface DaznoNodeInfoDetailed {
  pubkey: string
  alias: string
  total_capacity: number
  num_channels: number
  betweenness_rank: number
  mean_outbound_fee_rate: number
  htlc_response_time_mean: number
  liquidity_flexibility_score: number
  historical_stats: DaznoHistoricalStats[]
}

export interface DaznoRecommendationsResponse {
  pubkey: string
  recommendations: DaznoSparkSeerRecommendation[]
  generated_at: string
}

// ============================================================================
// TYPES D'AUTHENTIFICATION DAZNO API
// ============================================================================

export interface DaznoAuthCredentials {
  api_key?: string
  bearer_token?: string
  expires_at?: string
}

export interface DaznoApiError {
  code: string
  message: string
  details?: any
}

export interface DaznoApiResponse<T> {
  success: boolean
  data?: T
  error?: DaznoApiError
  meta?: {
    timestamp: string
    version: string
  }
}

// ============================================================================
// UTILITAIRES DE VALIDATION
// ============================================================================

export const isDaznoValidContext = (context: string): context is DaznoPriorityRequest['context'] => {
  return ['beginner', 'intermediate', 'expert'].includes(context)
}

export const isDaznoValidGoal = (goal: string): goal is DaznoPriorityRequest['goals'][0] => {
  return ['increase_revenue', 'improve_connectivity', 'reduce_costs'].includes(goal)
}

export const isDaznoValidRiskTolerance = (risk: string): risk is NonNullable<DaznoPriorityRequest['preferences']>['risk_tolerance'] => {
  return ['low', 'medium', 'high'].includes(risk)
}

export const isDaznoValidInvestmentHorizon = (horizon: string): horizon is NonNullable<DaznoPriorityRequest['preferences']>['investment_horizon'] => {
  return ['short_term', 'medium_term', 'long_term'].includes(horizon)
} 