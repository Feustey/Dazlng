import { getSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (!getSupabaseAdminClient) {
    console.warn('Supabase admin non configuré pour /api/user/crm-data');
    return NextResponse.json(
      { error: 'Service non disponible' },
      { status: 503 }
    );
  }

  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await getSupabaseAdminClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erreur profil:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }

    // Récupérer les commandes
    const { data: orders } = await getSupabaseAdminClient()
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    // Récupérer l'abonnement actuel
    const { data: subscription } = await getSupabaseAdminClient()
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // Calculer le score utilisateur
    const userScore = calculateUserScore(profile, orders || [], subscription);
    
    // Déterminer le segment
    const segment = determineSegment(userScore, profile, orders || [], subscription);

    // Générer les recommandations
    const recommendations = generateRecommendations(profile, orders || [], subscription, userScore);

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

function generateRecommendations(profile: any, orders: any[], subscription: any, userScore: number) {
  const recommendations = [];

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