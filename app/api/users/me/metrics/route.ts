import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient.auth.getUser(token);
  return user;
}

// GET /api/users/me/metrics - Métriques utilisateur enrichies
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Non autorisé"
        }
      }, { status: 401 });
    }

    // Récupère les métriques de base du profil
    const { data: profile, error: profileError } = await getSupabaseAdminClient
      .from("profiles")
      .select(`
        total_transactions, average_rating, total_reviews, completion_rate,
        response_time, active_days, referral_count, last_login_at,
        created_at, updated_at
      `)
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la récupération des métriques"
        }
      }, { status: 500 });
    }

    // Récupère les statistiques des commandes
    const { data: orders, error: ordersError } = await getSupabaseAdminClient
      .from("orders")
      .select("amount, payment_status, created_at")
      .eq("user_id", user.id);

    if (ordersError) {
      console.error("Erreur récupération commandes:", ordersError);
    }

    // Récupère les statistiques des paiements
    const { data: payments, error: paymentsError } = await getSupabaseAdminClient
      .from("payments")
      .select("amount, status, created_at")
      .eq("user_id", user.id);

    if (paymentsError) {
      console.error("Erreur récupération paiements:", paymentsError);
    }

    // Calcule les métriques enrichies
    const metrics = calculateEnhancedMetrics(profile, orders || [], payments || []);

    return NextResponse.json({
      success: true,
      data: metrics,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur GET /api/users/me/metrics:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// Fonction pour calculer les métriques enrichies
function calculateEnhancedMetrics(profile: any, orders: any[], payments: any[]) {
  const now = new Date();
  const createdAt = new Date(profile.created_at);
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  // Calcul des métriques de base
  const totalTransactions = profile.total_transactions || orders.length;
  const averageRating = profile.average_rating || 0;
  const totalReviews = profile.total_reviews || 0;
  const completionRate = profile.completion_rate || 0;
  const responseTime = profile.response_time || 0;
  const activeDays = profile.active_days || Math.min(daysSinceCreation, 365);
  const referralCount = profile.referral_count || 0;

  // Calcul des métriques financières
  const totalSpent = orders
    .filter(order => order.payment_status === 'paid')
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  const successfulPayments = payments
    .filter(payment => payment.status === 'paid')
    .length;

  const paymentSuccessRate = payments.length > 0 
    ? (successfulPayments / payments.length) * 100 
    : 0;

  // Calcul de l'activité récente
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentOrders = orders.filter(order => 
    new Date(order.created_at) >= last30Days
  ).length;

  const recentPayments = payments.filter(payment => 
    new Date(payment.created_at) >= last30Days
  ).length;

  // Calcul du profil de complétion
  const profileCompletion = calculateProfileCompletion(profile);

  return {
    // Métriques de base
    totalTransactions,
    averageRating: Math.round(averageRating * 100) / 100,
    totalReviews,
    completionRate: Math.round(completionRate * 100) / 100,
    responseTime,
    activeDays,
    referralCount,
    profileCompletion,

    // Métriques financières
    totalSpent,
    paymentSuccessRate: Math.round(paymentSuccessRate * 100) / 100,
    averageOrderValue: totalTransactions > 0 ? Math.round(totalSpent / totalTransactions) : 0,

    // Métriques d'activité
    recentOrders,
    recentPayments,
    daysSinceCreation,
    lastLoginAt: profile.last_login_at,

    // Métriques de performance
    ordersPerDay: daysSinceCreation > 0 ? Math.round((totalTransactions / daysSinceCreation) * 100) / 100 : 0,
    averageResponseTime: responseTime > 0 ? Math.round(responseTime / 60) : 0, // en minutes
    engagementScore: Math.round((activeDays / Math.min(daysSinceCreation, 365)) * 100)
  };
}

// Fonction utilitaire pour calculer le pourcentage de complétion du profil
function calculateProfileCompletion(profile: any): number {
  const fields = [
    'nom', 'prenom', 'email', 'phone', 'pubkey',
    'preferences', 'social_links', 'privacy_settings'
  ];
  
  const completedFields = fields.filter(field => {
    const value = profile[field];
    if (typeof value === 'string') return value && value.trim().length > 0;
    if (typeof value === 'object') return value && Object.keys(value).length > 0;
    return !!value;
  });

  return Math.round((completedFields.length / fields.length) * 100);
} 