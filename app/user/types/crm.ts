// Types pour le système CRM côté utilisateur

export interface UserProfile {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  pubkey?: string;
  compte_x?: string;
  compte_nostr?: string;
  t4g_tokens: number;
  node_id?: string;
  email_verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  settings?: any;
}

export interface CRMData {
  userScore: number;
  segment: 'prospect' | 'lead' | 'client' | 'premium' | 'champion';
  engagementLevel: number;
  conversionProbability: number;
  lastActivity: string;
  totalOrders: number;
  totalSpent: number;
  isPremium: boolean;
  hasNode: boolean;
  profileCompletion: number;
  lightningAdoption: boolean;
  recommendations: SmartRecommendation[];
}

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'efficiency' | 'security' | 'growth';
  impact: 'high' | 'medium' | 'low';
  estimatedGain: number;
  timeToImplement: string;
  isPremium: boolean;
  appliedBy?: number;
  priority: 'high' | 'medium' | 'low';
  href: string;
}

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  href: string;
  points?: number;
  description?: string;
}

export interface ConversionMetrics {
  profileCompletionRate: number;
  emailVerificationRate: number;
  lightningAdoptionRate: number;
  premiumConversionRate: number;
  averageTimeToConversion: number;
  segmentDistribution: {
    prospect: number;
    lead: number;
    client: number;
    premium: number;
    champion: number;
  };
}
