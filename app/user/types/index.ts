// Types partagés pour l'interface utilisateur

export export interface UserProfile {
  email: string;
  nom?: string;
  prenom?: string;
  firstName?: string; // Alias pour compatibilité
  lastName?: string;  // Alias pour compatibilité
  pubkey?: string;
  compte_x?: string;
  compte_nostr?: string;
  twitterHandle?: string; // Alias pour compatibilité
  nostrPubkey?: string;   // Alias pour compatibilité
  phone?: string;
  phone_verified?: boolean;
  phoneVerified?: boolean; // Alias pour compatibilité
  profile_score?: number;
  email_verified?: boolean;
}

export export interface NodeStats {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number;
  rankInNetwork: number;
  totalNodes: number;
}

export export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  isFree: boolean;
  estimatedGain: number;
  timeToImplement: string;
  category: 'liquidity' | 'routing' | 'efficiency' | 'security';
}

export export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  href: string;
}

export export interface CRMData {
  profileCompletion: number;
  userScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
  conversionPotential: number;
  lastActivity: Date;
}

export export interface DazBoxStats {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  price: number;
  roi: number;
}
