export interface BaseRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  reasoning?: string;
  date?: string;
  category?: string;
}

export interface EnhancedRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  estimated_gain: number;
  category: 'liquidity' | 'connectivity' | 'fees' | 'security';
  action_type: 'open_channel' | 'close_channel' | 'adjust_fees' | 'rebalance' | 'other';
  target_node?: {
    pubkey: string;
    alias: string;
    capacity: number;
  };
  steps: {
    order: number;
    description: string;
    command?: string;
  }[];
  free: boolean;
  action?: string;
  reasoning?: string;
  expected_impact?: string;
  timeline?: string;
  urgency?: string;
  estimated_time?: string;
  implementation_details?: {
    steps?: string[];
    requirements?: string[];
    estimated_hours?: number;
  };
  success_criteria?: string[];
  metadata?: Record<string, any>;
}

export interface DailyRecommendation {
  id: string;
  type: 'channel_optimization' | 'fee_adjustment' | 'liquidity_management' | 'network_growth';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  estimated_revenue_impact: number;
  estimated_risk: number;
  steps: string[];
  prerequisites: string[];
  created_at: string;
  expires_at?: string;
  metadata: Record<string, any>;
}

export interface RecommendationContext {
  dailyRecommendation: DailyRecommendation | null;
  userPreferences: Record<string, any>;
}

export interface DaziaData {
  recommendations: EnhancedRecommendation[];
  dailyRecommendation: DailyRecommendation | null;
  completedActions: Set<string>;
}