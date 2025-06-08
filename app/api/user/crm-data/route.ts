import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  // Créer le client Supabase dans la fonction pour éviter les erreurs de build
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Variables Supabase manquantes pour /api/user/crm-data');
    return NextResponse.json(
      { success: false, error: { code: 'CONFIG_ERROR', message: 'Configuration Supabase manquante' } },
      { status: 500 }
    );
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    // Récupérer l'utilisateur connecté depuis le header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Token manquant' } },
        { status: 401 }
      );
    }

    // Simuler l'extraction de l'user_id depuis le token JWT
    // En production, il faudrait vérifier le JWT
    const userId = request.headers.get('x-user-id') || 'user-123';

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Utilisateur non trouvé' } },
        { status: 404 }
      );
    }

    // Récupérer les commandes
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    // Récupérer l'abonnement actuel
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Calculer le score utilisateur
    const userScore = calculateUserScore(profile, orders || [], subscription);
    
    // Déterminer le segment
    const segment = determineSegment(userScore, profile, orders || [], subscription);

    // Générer les recommandations avec données réelles
    const recommendations = await generateRecommendations(supabase, profile, orders || [], subscription, userScore);

    // Calculer la completion du profil
    const profileCompletion = calculateProfileCompletion(profile);

    // Construire les données CRM
    const crmData = {
      userScore,
      segment,
      engagementLevel: Math.min(100, userScore + 10),
      conversionProbability: calculateConversionProbability(userScore, profile),
      lastActivity: profile.updated_at,
      totalOrders: orders?.length || 0,
      totalSpent: orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0,
      isPremium: subscription?.status === 'active',
      hasNode: !!profile.node_id,
      profileCompletion,
      lightningAdoption: !!profile.pubkey,
      recommendations
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
    );
  }
}

function calculateUserScore(profile: any, orders: any[], subscription: any): number {
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

function determineSegment(score: number, profile: any, orders: any[], subscription: any): string {
  if (score >= 80) return 'champion';
  if (score >= 60 || subscription?.status === 'active') return 'premium';
  if (score >= 40 || orders.length > 0) return 'client';
  if (score >= 20 || profile.email_verified) return 'lead';
  return 'prospect';
}

function calculateProfileCompletion(profile: any): number {
  const fields = ['nom', 'prenom', 'pubkey', 'node_id', 'compte_x', 'compte_nostr'];
  const completed = fields.filter(field => profile[field] && profile[field].length > 0).length;
  const emailVerified = profile.email_verified ? 1 : 0;
  
  return Math.round(((completed + emailVerified) / (fields.length + 1)) * 100);
}

function calculateConversionProbability(score: number, profile: any): number {
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

/**
 * Récupère le nombre d'utilisateurs ayant appliqué une recommandation depuis la BDD
 */
async function getAppliedByCount(supabase: any, actionType: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('user_actions')
      .select('id', { count: 'exact', head: true })
      .eq('action_type', actionType)
      .eq('status', 'completed');

    if (error) {
      console.warn(`Erreur récupération appliedBy pour ${actionType}:`, error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn(`Erreur appliedBy ${actionType}:`, error);
    return 0;
  }
}

/**
 * Calcule le gain estimé basé sur les données réelles d'utilisateurs similaires
 */
async function calculateEstimatedGain(supabase: any, actionType: string, userSegment: string): Promise<number> {
  try {
    // Récupérer les gains réels moyens pour cette action et ce segment
    const { data: avgGains, error } = await supabase
      .from('user_actions')
      .select('actual_gain')
      .eq('action_type', actionType)
      .eq('user_segment', userSegment)
      .not('actual_gain', 'is', null);

    if (error || !avgGains || avgGains.length === 0) {
      // Fallback sur des valeurs calculées dynamiquement selon le type d'action
      return getBaseEstimatedGain(actionType, userSegment);
    }

    // Calculer la moyenne des gains réels
    const avgGain = avgGains.reduce((sum: number, item: any) => sum + (item.actual_gain || 0), 0) / avgGains.length;
    return Math.round(avgGain);

  } catch (error) {
    console.warn(`Erreur calcul estimatedGain ${actionType}:`, error);
    return getBaseEstimatedGain(actionType, userSegment);
  }
}

/**
 * Gains de base selon le type d'action et segment utilisateur
 */
function getBaseEstimatedGain(actionType: string, userSegment: string): number {
  const baseGains: Record<string, Record<string, number>> = {
    'verify-email': {
      'prospect': 5000,
      'lead': 8000,
      'client': 12000,
      'premium': 15000,
      'champion': 20000
    },
    'add-pubkey': {
      'prospect': 15000,
      'lead': 20000,
      'client': 25000,
      'premium': 30000,
      'champion': 35000
    },
    'connect-node': {
      'prospect': 50000,
      'lead': 60000,
      'client': 75000,
      'premium': 90000,
      'champion': 100000
    },
    'upgrade-premium': {
      'prospect': 100000,
      'lead': 120000,
      'client': 150000,
      'premium': 180000,
      'champion': 200000
    },
    'dazbox-offer': {
      'prospect': 150000,
      'lead': 180000,
      'client': 200000,
      'premium': 250000,
      'champion': 300000
    },
    'ai-optimization': {
      'premium': 80000,
      'champion': 100000
    },
    'custom-alerts': {
      'premium': 40000,
      'champion': 50000
    }
  };

  return baseGains[actionType]?.[userSegment] || 10000;
}

async function generateRecommendations(supabase: any, profile: any, orders: any[], subscription: any, userScore: number) {
  const recommendations = [];
  const userSegment = determineSegment(userScore, profile, orders, subscription);

  // Recommandations basées sur le profil
  if (!profile.email_verified) {
    const appliedBy = await getAppliedByCount(supabase, 'verify-email');
    const estimatedGain = await calculateEstimatedGain(supabase, 'verify-email', userSegment);
    
    recommendations.push({
      id: 'verify-email',
      title: 'Vérifiez votre email',
      description: 'Débloquez toutes les fonctionnalités en vérifiant votre adresse email',
      category: 'security',
      impact: 'high',
      estimatedGain,
      timeToImplement: '2 minutes',
      isPremium: false,
      priority: 'high',
      href: '/user/settings',
      appliedBy
    });
  }

  if (!profile.pubkey) {
    const appliedBy = await getAppliedByCount(supabase, 'add-pubkey');
    const estimatedGain = await calculateEstimatedGain(supabase, 'add-pubkey', userSegment);
    
    recommendations.push({
      id: 'add-pubkey',
      title: 'Connectez votre portefeuille Lightning',
      description: 'Accédez aux fonctionnalités Lightning et améliorez votre score',
      category: 'growth',
      impact: 'high',
      estimatedGain,
      timeToImplement: '5 minutes',
      isPremium: false,
      priority: 'high',
      href: '/user/settings',
      appliedBy
    });
  }

  if (!profile.node_id && userScore >= 40) {
    const appliedBy = await getAppliedByCount(supabase, 'connect-node');
    const estimatedGain = await calculateEstimatedGain(supabase, 'connect-node', userSegment);
    
    recommendations.push({
      id: 'connect-node',
      title: 'Connectez votre nœud Lightning',
      description: 'Obtenez des analytics détaillées et des recommandations IA',
      category: 'efficiency',
      impact: 'high',
      estimatedGain,
      timeToImplement: '10 minutes',
      isPremium: false,
      priority: 'medium',
      href: '/user/node',
      appliedBy
    });
  }

  if (!subscription && userScore >= 50) {
    const appliedBy = await getAppliedByCount(supabase, 'upgrade-premium');
    const estimatedGain = await calculateEstimatedGain(supabase, 'upgrade-premium', userSegment);
    
    recommendations.push({
      id: 'upgrade-premium',
      title: 'Passez à Premium',
      description: 'Débloquez les optimisations IA et le support prioritaire',
      category: 'revenue',
      impact: 'high',
      estimatedGain,
      timeToImplement: '1 minute',
      isPremium: true,
      priority: 'high',
      href: '/subscribe',
      appliedBy
    });
  }

  if (!profile.node_id && userScore >= 60) {
    const appliedBy = await getAppliedByCount(supabase, 'dazbox-offer');
    const estimatedGain = await calculateEstimatedGain(supabase, 'dazbox-offer', userSegment);
    
    recommendations.push({
      id: 'dazbox-offer',
      title: 'Découvrez DazBox',
      description: 'Nœud Lightning clé en main pour des revenus passifs optimisés',
      category: 'revenue',
      impact: 'high',
      estimatedGain,
      timeToImplement: '48h livraison',
      isPremium: true,
      priority: 'medium',
      href: '/dazbox',
      appliedBy
    });
  }

  // Recommandations Premium
  if (subscription) {
    const aiOptimizationApplied = await getAppliedByCount(supabase, 'ai-optimization');
    const aiOptimizationGain = await calculateEstimatedGain(supabase, 'ai-optimization', userSegment);
    
    recommendations.push({
      id: 'ai-optimization',
      title: 'Optimisation IA avancée',
      description: 'Analyse automatique et optimisation continue de vos canaux',
      category: 'efficiency',
      impact: 'high',
      estimatedGain: aiOptimizationGain,
      timeToImplement: 'Automatique',
      isPremium: true,
      priority: 'high',
      href: '/user/node/optimization',
      appliedBy: aiOptimizationApplied
    });

    const customAlertsApplied = await getAppliedByCount(supabase, 'custom-alerts');
    const customAlertsGain = await calculateEstimatedGain(supabase, 'custom-alerts', userSegment);
    
    recommendations.push({
      id: 'custom-alerts',
      title: 'Alertes personnalisées',
      description: 'Configurez des alertes sur mesure pour votre stratégie',
      category: 'security',
      impact: 'medium',
      estimatedGain: customAlertsGain,
      timeToImplement: '5 minutes',
      isPremium: true,
      priority: 'medium',
      href: '/user/settings/alerts',
      appliedBy: customAlertsApplied
    });
  }

  return recommendations.slice(0, 6); // Limiter à 6 recommandations
} 