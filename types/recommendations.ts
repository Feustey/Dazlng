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

export interface DailyRecommendation extends BaseRecommendation {
  implementation_steps?: string[];
  success_criteria?: string[];
  action?: string;
  expected_impact?: string;
  timeline?: string;
  urgency?: string;
  estimated_time?: string;
  implementation_details?: {
    steps?: string[];
    requirements?: string[];
    estimated_hours?: number;
  };
}

export interface DaziaData {
  recommendations: EnhancedRecommendation[];
  dailyRecommendation: DailyRecommendation | null;
  completedActions: Set<string>;
} 