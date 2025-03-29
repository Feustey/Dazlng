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

// Objet à exporter par défaut qui fournit des méthodes utilitaires pour Recommendation
const RecommendationImpl = {
  // Factory pour créer une nouvelle recommandation
  create: (data: Partial<Recommendation>): Recommendation => {
    return {
      id: data.id || '',
      nodePubkey: data.nodePubkey || '',
      type: data.type || 'capacity',
      description: data.description || '',
      priority: data.priority || 'medium',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      status: data.status || 'pending',
      details: data.details,
    };
  }
};

// Export par défaut de l'objet RecommendationImpl
export default RecommendationImpl; 