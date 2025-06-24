import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabase-auth';

export interface UserProfile {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  pubkey?: string;
  node_id?: string;
  compte_x?: string;
  compte_nostr?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  settings: Record<string, unknown>;
}

export interface UserOrder {
  id: string;
  user_id: string;
  product_type: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date?: string;
}

export interface CRMRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  estimatedGain: number;
  timeToImplement: string;
  isPremium: boolean;
  priority: string;
  href: string;
  appliedBy: number;
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED', 
            message: 'Non authentifié' 
          } 
        },
        { status: 401 }
};
    }

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await getSupabaseAdminClient()
      ?.from('profiles')
      .select('*')
      .eq('id', user.id)
      .single() || { data: null, error: new Error('Client non disponible') };

    if (profileError || !profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'PROFILE_NOT_FOUND', 
            message: 'Profil utilisateur non trouvé' 
          } 
        },
        { status: 404 }
};
    }

    // Récupérer les commandes de l'utilisateur
    const { data: orders, error: _ordersError } = await getSupabaseAdminClient()
      ?.from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }) || { data: [], error: null };

    // Récupérer l'abonnement actuel
    const { data: subscription, error: _subscriptionError } = await getSupabaseAdminClient()
      ?.from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single() || { data: null, error: null };

    // Calculer les métriques CRM
    const userScore = calculateUserScore(profile as UserProfile, orders as UserOrder[] || [], subscription as UserSubscription);
    const segment = determineSegment(userScore, profile as UserProfile, orders as UserOrder[] || [], subscription as UserSubscription);
    const profileCompletion = calculateProfileCompletion(profile as UserProfile);
    const conversionProbability = calculateConversionProbability(userScore, profile as UserProfile);
    const recommendations = generateRecommendations(profile as UserProfile, orders as UserOrder[] || [], subscription as UserSubscription, userScore);

    const crmData = {
      userScore,
      segment,
      profileCompletion,
      conversionProbability,
      recommendations,
      metrics: {
        totalOrders: orders?.length || 0,
        totalSpent: orders?.reduce((sum: number, order: UserOrder) => sum + order.amount, 0) || 0,
        averageOrderValue: orders?.length ? (orders.reduce((sum: number, order: UserOrder) => sum + order.amount, 0) / orders.length) : 0,
        lastOrderDate: orders?.[0]?.created_at || null,
        subscriptionStatus: subscription?.status || 'none',
        daysSinceRegistration: Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        profile,
        crmData
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    });

  } catch (error) {
    console.error('Erreur API user CRM data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Erreur interne du serveur' 
        } 
      },
      { status: 500 }
};
  }
}

function calculateUserScore(profile: UserProfile, orders: UserOrder[], subscription: UserSubscription): number {
  let score = 0;

  // Email vérifié (20 points)
  if (profile.email_verified) score += 20;

  // Profil complété (20 points max)
  score += calculateProfileCompletion(profile) * 0.2;

  // Pubkey Lightning (15 points)
  if (profile.pubkey) score += 15;

  // Nœud connecté (20 points)
  if (profile.node_id) score += 20;

  // Commandes (15 points max)
  if (orders.length > 0) {
    score += Math.min(15, orders.length * 5);
  }

  // Abonnement Premium (10 points)
  if (subscription?.status === 'active') score += 10;

  return Math.min(100, Math.round(score));
}

function determineSegment(score: number, profile: UserProfile, orders: UserOrder[], subscription: UserSubscription): string {
  if (score >= 80) return 'champion';
  if (score >= 60 || subscription?.status === 'active') return 'premium';
  if (score >= 40 || orders.length > 0) return 'client';
  if (score >= 20 || profile.email_verified) return 'lead';
  return 'prospect';
}

function calculateProfileCompletion(profile: UserProfile): number {
  const fields = ['nom', 'prenom', 'pubkey', 'node_id', 'compte_x', 'compte_nostr'];
  const completed = fields.filter(field => profile[field as keyof UserProfile] && String(profile[field as keyof UserProfile]).length > 0).length;
  const emailVerified = profile.email_verified ? 1 : 0;
  
  return Math.round(((completed + emailVerified) / (fields.length + 1)) * 100);
}

function calculateConversionProbability(score: number, profile: UserProfile): number {
  let probability = score * 0.6; // Base sur le score
  
  // Bonus si email vérifié
  if (profile.email_verified) probability += 10;
  
  // Bonus si pubkey Lightning
  if (profile.pubkey) probability += 15;
  
  // Malus si compte très récent (moins de 7 jours)
  const accountAge = (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (accountAge < 7) probability -= 20;
  
  return Math.max(0, Math.min(100, Math.round(probability)));
}

function generateRecommendations(profile: UserProfile, orders: UserOrder[], subscription: UserSubscription, userScore: number): CRMRecommendation[] {
  const recommendations: CRMRecommendation[] = [];

  // Recommandations basées sur le profil
  if (!profile.email_verified) {
    recommendations.push({
      id: 'verify-email',
      title: 'Vérifiez votre email',
      description: 'Débloquez toutes les fonctionnalités en vérifiant votre adresse email',
      category: 'security',
      impact: 'high',
      estimatedGain: 10000,
      timeToImplement: '2 minutes',
      isPremium: false,
      priority: 'high',
      href: '/user/settings',
      appliedBy: 1250
    });
  }

  if (!profile.pubkey) {
    recommendations.push({
      id: 'add-pubkey',
      title: 'Connectez votre portefeuille Lightning',
      description: 'Accédez aux fonctionnalités Lightning et améliorez votre score',
      category: 'growth',
      impact: 'high',
      estimatedGain: 25000,
      timeToImplement: '5 minutes',
      isPremium: false,
      priority: 'high',
      href: '/user/settings',
      appliedBy: 890
    });
  }

  if (!profile.node_id && userScore >= 40) {
    recommendations.push({
      id: 'connect-node',
      title: 'Connectez votre nœud Lightning',
      description: 'Obtenez des analytics détaillées et des recommandations IA',
      category: 'efficiency',
      impact: 'high',
      estimatedGain: 75000,
      timeToImplement: '10 minutes',
      isPremium: false,
      priority: 'medium',
      href: '/user/node',
      appliedBy: 456
    });
  }

  if (!subscription && userScore >= 50) {
    recommendations.push({
      id: 'upgrade-premium',
      title: 'Passez à Premium',
      description: 'Débloquez les optimisations IA et le support prioritaire',
      category: 'revenue',
      impact: 'high',
      estimatedGain: 150000,
      timeToImplement: '1 minute',
      isPremium: true,
      priority: 'high',
      href: '/subscribe',
      appliedBy: 678
    });
  }

  if (!profile.node_id && userScore >= 60) {
    recommendations.push({
      id: 'dazbox-offer',
      title: 'Découvrez DazBox',
      description: 'Nœud Lightning clé en main pour des revenus passifs optimisés',
      category: 'revenue',
      impact: 'high',
      estimatedGain: 200000,
      timeToImplement: '48h livraison',
      isPremium: true,
      priority: 'medium',
      href: '/dazbox',
      appliedBy: 234
    });
  }

  // Recommandations Premium
  if (subscription) {
    recommendations.push({
      id: 'ai-optimization',
      title: 'Optimisation IA avancée',
      description: 'Analyse automatique et optimisation continue de vos canaux',
      category: 'efficiency',
      impact: 'high',
      estimatedGain: 100000,
      timeToImplement: 'Automatique',
      isPremium: true,
      priority: 'high',
      href: '/user/node/optimization',
      appliedBy: 145
    });

    recommendations.push({
      id: 'custom-alerts',
      title: 'Alertes personnalisées',
      description: 'Configurez des alertes sur mesure pour votre stratégie',
      category: 'security',
      impact: 'medium',
      estimatedGain: 50000,
      timeToImplement: '5 minutes',
      isPremium: true,
      priority: 'medium',
      href: '/user/settings/alerts',
      appliedBy: 89
    });
  }

  return recommendations.slice(0, 6); // Limiter à 6 recommandations
}
