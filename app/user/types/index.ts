// Types partagés pour l'interface utilisateur

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  pubkey?: string;
  twitterHandle?: string;
  nostrPubkey?: string;
  phoneVerified: boolean;
}

export interface NodeStats {
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

export interface Recommendation {
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface ProfileField {
  name: string;
  label: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  href: string;
}

export interface CRMData {
  profileCompletion: number;
  userScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
  conversionPotential: number;
  lastActivity: Date;
}

export interface DazBoxStats {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  price: number;
  roi: number;
} 