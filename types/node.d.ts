export interface NodeInfo {
  pubkey: string;
  alias: string;
  color: string;
  capacity: number;
  channels: number;
  last_update: string;
  custom_records?: Record<string, any>;
  features?: Record<string, any>;
  addresses?: Array<{
    type: string;
    address: string;
    port: number;
  }>;
}

export interface NodeRecommendations {
  recommendations: Array<{
    type: string;
    priority: number;
    description: string;
    impact: number;
    difficulty: number;
    action: string;
  }>;
}

export interface NodePriorities {
  priorities: Array<{
    id: string;
    title: string;
    description: string;
    impact: number;
    difficulty: number;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
  }>;
} 