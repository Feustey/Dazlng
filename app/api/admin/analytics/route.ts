import { NextRequest } from 'next/server';
import { withEnhancedAdminAuth, AdminResponseBuilder } from '@/lib/admin-utils';
import { umamiApi, UmamiStatsResponse } from '@/lib/services/umami-api';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface AnalyticsResponse {
  // Métriques Umami
  umami: UmamiStatsResponse;
  
  // Métriques business internes
  business: {
    totalUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsers: number;
    premiumUsers: number;
    conversionRate: number;
    churnRate: number;
  };
  
  // Métriques de performance
  performance: {
    totalRevenue: number;
    monthlyRevenue: number;
    avgOrderValue: number;
    totalOrders: number;
    pendingOrders: number;
  };
  
  // Funnel de conversion
  funnel: {
    visitors: number;
    signups: number;
    verifiedUsers: number;
    firstPurchase: number;
    premiumConversions: number;
    conversionRates: {
      visitorsToSignups: number;
      signupsToVerified: number;
      verifiedToPurchase: number;
      purchaseToPremium: number;
    };
  };
}

/**
 * GET /api/admin/analytics - Métriques complètes pour le dashboard admin
 */
async function getAnalyticsHandler(req: NextRequest, _adminId: string): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const period = parseInt(searchParams.get('period') || '30');
    const realtime = searchParams.get('realtime') === 'true';

    // 1. Récupérer les métriques Umami
    let umamiStats: UmamiStatsResponse;
    if (realtime) {
      umamiStats = await umamiApi.getRealTimeStats();
    } else {
      umamiStats = await umamiApi.getStatsForPeriod(period);
    }

    // 2. Calcul des dates pour les métriques business
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (period * 24 * 60 * 60 * 1000));
    const weekStartDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    const monthStartDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));

    // 3. Métriques business en parallèle
    const [
      totalUsersResult,
      newUsersWeekResult,
      newUsersMonthResult,
      activeUsersResult,
      premiumUsersResult,
      revenueResult,
      ordersResult,
      pendingOrdersResult
    ] = await Promise.allSettled([
      // Total utilisateurs
      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true }),
      
      // Nouveaux utilisateurs cette semaine
      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStartDate.toISOString()),
      
      // Nouveaux utilisateurs ce mois
      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', monthStartDate.toISOString()),
      
      // Utilisateurs actifs (avec au moins une commande)
      supabaseAdmin
        .from('orders')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString()),
      
      // Utilisateurs premium
      supabaseAdmin
        .from('subscriptions')
        .select('user_id', { count: 'exact', head: true })
        .eq('status', 'active')
        .in('plan_id', ['premium', 'enterprise']),
      
      // Revenus
      supabaseAdmin
        .from('orders')
        .select('amount, created_at')
        .eq('payment_status', 'paid'),
      
      // Commandes totales
      supabaseAdmin
        .from('orders')
        .select('id, amount, created_at')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString()),
      
      // Commandes en attente
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'pending')
    ]);

    // 4. Extraction des résultats avec gestion d'erreurs
    const totalUsers = totalUsersResult.status === 'fulfilled' ? (totalUsersResult.value.count || 0) : 0;
    const newUsersWeek = newUsersWeekResult.status === 'fulfilled' ? (newUsersWeekResult.value.count || 0) : 0;
    const newUsersMonth = newUsersMonthResult.status === 'fulfilled' ? (newUsersMonthResult.value.count || 0) : 0;
    const activeUsers = activeUsersResult.status === 'fulfilled' ? (activeUsersResult.value.count || 0) : 0;
    const premiumUsers = premiumUsersResult.status === 'fulfilled' ? (premiumUsersResult.value.count || 0) : 0;
    
    const revenueData = revenueResult.status === 'fulfilled' ? revenueResult.value.data || [] : [];
    const ordersData = ordersResult.status === 'fulfilled' ? ordersResult.value.data || [] : [];
    const pendingOrders = pendingOrdersResult.status === 'fulfilled' ? (pendingOrdersResult.value.count || 0) : 0;

    // 5. Calculs des métriques dérivées
    const totalRevenue = revenueData.reduce((sum, order) => sum + (order.amount || 0), 0);
    const monthlyRevenue = revenueData
      .filter(order => new Date(order.created_at) >= monthStartDate)
      .reduce((sum, order) => sum + (order.amount || 0), 0);
    
    const avgOrderValue = ordersData.length > 0 
      ? ordersData.reduce((sum, order) => sum + (order.amount || 0), 0) / ordersData.length 
      : 0;

    const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
    const churnRate = 0; // À implémenter avec plus de données historiques

    // 6. Métriques du funnel de conversion
    const visitors = umamiStats.uniques; // Visiteurs uniques d'Umami
    const signups = totalUsers;
    const verifiedUsers = activeUsers; // Approximation
    const firstPurchase = ordersData.length;
    const premiumConversions = premiumUsers;

    // Taux de conversion du funnel
    const visitorsToSignups = visitors > 0 ? (signups / visitors) * 100 : 0;
    const signupsToVerified = signups > 0 ? (verifiedUsers / signups) * 100 : 0;
    const verifiedToPurchase = verifiedUsers > 0 ? (firstPurchase / verifiedUsers) * 100 : 0;
    const purchaseToPremium = firstPurchase > 0 ? (premiumConversions / firstPurchase) * 100 : 0;

    // 7. Construction de la réponse
    const analyticsData: AnalyticsResponse = {
      umami: umamiStats,
      business: {
        totalUsers,
        newUsersThisWeek: newUsersWeek,
        newUsersThisMonth: newUsersMonth,
        activeUsers,
        premiumUsers,
        conversionRate,
        churnRate
      },
      performance: {
        totalRevenue,
        monthlyRevenue,
        avgOrderValue,
        totalOrders: ordersData.length,
        pendingOrders
      },
      funnel: {
        visitors,
        signups,
        verifiedUsers,
        firstPurchase,
        premiumConversions,
        conversionRates: {
          visitorsToSignups,
          signupsToVerified,
          verifiedToPurchase,
          purchaseToPremium
        }
      }
    };

    return AdminResponseBuilder.success(analyticsData, {
      stats: {
        total: analyticsData.business.totalUsers,
        period: `${period} days`
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return AdminResponseBuilder.error(
      'INTERNAL_ERROR',
      'Erreur lors de la récupération des analytics',
      { error: error instanceof Error ? error.message : 'Erreur inconnue' },
      500
    );
  }
}

export const GET = withEnhancedAdminAuth(
  getAnalyticsHandler,
  { resource: 'analytics', action: 'read' }
); 