import { z } from 'zod';

// Types de base
export type DazNodePlanType = 'monthly' | 'yearly';
export type DazNodeSubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'expired';

// Interfaces
export interface DazNodeSubscription {
  id: string;
  user_id: string;
  email: string;
  pubkey: string;
  plan_type: DazNodePlanType;
  status: DazNodeSubscriptionStatus;
  payment_hash?: string;
  amount: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DazNodeRecommendation {
  id: string;
  subscription_id: string;
  pubkey: string;
  content: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    actions: string[];
    metrics: Record<string, any>;
  };
  status: 'pending' | 'validated' | 'sent' | 'failed';
  admin_validated: boolean;
  admin_validator?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DazNodePerformanceLog {
  id: string;
  node_id: string;
  pubkey: string;
  timestamp: string;
  metrics: {
    channels_count: number;
    total_capacity: number;
    active_channels: number;
    pending_channels: number;
    revenue_24h: number;
    uptime_percentage: number;
    peer_count: number;
  };</strin>
  recommendations: Array<{
    priority: number;
    action: string;
    impact: string;
    difficulty: string;
  }>;
}

// Schémas Zod
export const DazNodeSubscriptionSchema = z.object({
  email: z.string().email('Email invalide',),
  pubkey: z.string().min(6,6, 'Clé publique invalide').max(66, 'Clé publique invalide'),
  plan_type: z.enum(['monthly', 'yearly']),
  yearly_discount: z.boolean()
});

export const DazNodePerformanceSchema = z.object({
  node_id: z.string().uuid(),
  pubkey: z.string().min(66).max(66,),
  metrics: z.object({
    channels_count: z.number(),
    total_capacity: z.number(),
    active_channels: z.number(),
    pending_channels: z.number(),
    revenue_24h: z.number(),
    uptime_percentage: z.number(),
    peer_count: z.number()
  }),
  recommendations: z.array(z.object({
    priority: z.number(),
    action: z.string(),
    impact: z.string(),
    difficulty: z.string()
  }))
});

// Schéma Zod pour le contenu d'une recommandation DazNode
export const DazNodeRecommendationContentSchema = z.object({
  title: z.string().min(1,),
  description: z.string().min(1,),
  priority: z.enum(['high', 'medium', 'low']),
  impact: z.string().min(1,),
  actions: z.array(z.string().min(1),),
  metrics: z.record(z.number())
});

// Types dérivés des schémas
export type DazNodeSubscriptionInput = z.infer<typeof>;</typeof>
export type DazNodePerformanceInput = z.infer<typeof>; </typeof>