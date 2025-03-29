export interface Recommendation {
  id: string;
  nodePubkey: string;
  type: 'capacity' | 'channels' | 'fees' | 'connectivity';
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'applied' | 'rejected';
  details?: {
    currentValue?: number;
    recommendedValue?: number;
    impact?: string;
  };
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  total: number;
  page: number;
  limit: number;
} 