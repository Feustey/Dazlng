import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

interface BusinessMetrics {
  // Acquisition
  monthly_signups: number;
  weekly_signups: number;
  conversion_rate: number;
  customer_acquisition_cost: number;
  
  // Retention  
  churn_rate: number;
  customer_lifetime_value: number;
  monthly_recurring_revenue: number;
  
  // Product
  daznode_adoption: number;
  lightning_connection_rate: number;
  premium_conversion_rate: number;
  
  // Revenue
  total_revenue: number;
  monthly_revenue: number;
  avg_order_value: number;
  revenue_per_user: number;
}

interface FunnelMetrics {
  visitors: number;
  signups: number;
  verified_users: number;
  first_purchase: number;
  premium_users: number;
  
  // Conversion rates
  signup_rate: number;
  verification_rate: number;
  purchase_rate: number;
  premium_rate: number;
}

interface CohortData {
  month: string;
  cohort_size: number;
  month_1: number;
  month_2: number;
  month_3: number;
  month_6: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 7, 30, 90 jours
    const type = searchParams.get('type') || 'business'; // business, funnel, cohort

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    switch (type) {
      case 'business':
        const businessMetrics = await getBusinessMetrics(startDate);
        return NextResponse.json({ 
          success: true, 
          data: businessMetrics,
          meta: { period: periodDays, type: 'business' }
        });

      case 'funnel':
        const funnelMetrics = await getFunnelMetrics(startDate);
        return NextResponse.json({ 
          success: true, 
          data: funnelMetrics,
          meta: { period: periodDays, type: 'funnel' }
        });

      case 'cohort':
        const cohortData = await getCohortAnalysis();
        return NextResponse.json({ 
          success: true, 
          data: cohortData,
          meta: { type: 'cohort' }
        });

      default:
        return NextResponse.json({ 
          success: false, 
          error: { code: 'INVALID_TYPE', message: 'Type d\'analyse non supporté' }
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Erreur analytics avancées:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Erreur lors du calcul des métriques',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }, { status: 500 });
  }
}

async function getBusinessMetrics(_startDate: Date): Promise<BusinessMetrics> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  // Signups
  const { count: totalSignups } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: monthlySignups } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthStart.toISOString());

  const { count: weeklySignups } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekStart.toISOString());

  // Revenue data
  const { data: ordersData } = await getSupabaseAdminClient()
    .from('orders')
    .select('amount, payment_status, created_at, user_id')
    .eq('payment_status', 'paid');

  const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
  
  const monthlyRevenue = ordersData?.filter(order => 
    new Date(order.created_at) >= monthStart
  ).reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

  const avgOrderValue = ordersData?.length ? totalRevenue / ordersData.length : 0;

  // Subscriptions
  const { count: premiumCount } = await getSupabaseAdminClient()
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', 'premium')
    .eq('status', 'active');

  // Lightning adoption
  const { count: lightningUsers } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .not('pubkey', 'is', null);

  // Verified users
  const { count: _verifiedUsers } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('email_verified', true);

  // Customers (users with orders)
  const uniqueCustomers = new Set(ordersData?.map(order => order.user_id) || []).size;

  // Calculate metrics
  const conversionRate = totalSignups ? (uniqueCustomers / totalSignups) * 100 : 0;
  const premiumConversionRate = totalSignups ? (premiumCount || 0) / totalSignups * 100 : 0;
  const lightningAdoption = totalSignups ? (lightningUsers || 0) / totalSignups * 100 : 0;
  const customerAcquisitionCost = monthlyRevenue && monthlySignups ? monthlyRevenue / monthlySignups : 0;
  const revenuePerUser = totalSignups ? totalRevenue / totalSignups : 0;

  // Calcul CLV approximatif (basé sur average order value et fréquence)
  const avgCustomerOrders = uniqueCustomers ? (ordersData?.length || 0) / uniqueCustomers : 0;
  const customerLifetimeValue = avgOrderValue * avgCustomerOrders * 1.5; // facteur de projection

  return {
    monthly_signups: monthlySignups || 0,
    weekly_signups: weeklySignups || 0,
    conversion_rate: conversionRate,
    customer_acquisition_cost: customerAcquisitionCost,
    churn_rate: 0, // À implémenter avec plus de données historiques
    customer_lifetime_value: customerLifetimeValue,
    monthly_recurring_revenue: monthlyRevenue,
    daznode_adoption: lightningAdoption,
    lightning_connection_rate: lightningAdoption,
    premium_conversion_rate: premiumConversionRate,
    total_revenue: totalRevenue,
    monthly_revenue: monthlyRevenue,
    avg_order_value: avgOrderValue,
    revenue_per_user: revenuePerUser
  };
}

async function getFunnelMetrics(startDate: Date): Promise<FunnelMetrics> {
  // Étape 1: Visiteurs (approximation basée sur les signups)
  const { count: totalSignups } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  // Étape 2: Utilisateurs vérifiés
  const { count: verifiedUsers } = await getSupabaseAdminClient()
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('email_verified', true)
    .gte('created_at', startDate.toISOString());

  // Étape 3: Premier achat
  const { data: firstPurchases } = await getSupabaseAdminClient()
    .from('orders')
    .select('user_id, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', startDate.toISOString());

  const uniqueBuyers = new Set(firstPurchases?.map(order => order.user_id) || []).size;

  // Étape 4: Premium
  const { count: premiumUsers } = await getSupabaseAdminClient()
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', 'premium')
    .eq('status', 'active')
    .gte('created_at', startDate.toISOString());

  // Estimation des visiteurs (x3 factor des signups)
  const estimatedVisitors = (totalSignups || 0) * 3;

  // Calcul des taux de conversion
  const signupRate = estimatedVisitors ? (totalSignups || 0) / estimatedVisitors * 100 : 0;
  const verificationRate = totalSignups ? (verifiedUsers || 0) / totalSignups * 100 : 0;
  const purchaseRate = verifiedUsers ? uniqueBuyers / verifiedUsers * 100 : 0;
  const premiumRate = uniqueBuyers ? (premiumUsers || 0) / uniqueBuyers * 100 : 0;

  return {
    visitors: estimatedVisitors,
    signups: totalSignups || 0,
    verified_users: verifiedUsers || 0,
    first_purchase: uniqueBuyers,
    premium_users: premiumUsers || 0,
    signup_rate: signupRate,
    verification_rate: verificationRate,
    purchase_rate: purchaseRate,
    premium_rate: premiumRate
  };
}

async function getCohortAnalysis(): Promise<CohortData[]> {
  // Analyse de cohorte simplifiée - utilisateurs par mois d'inscription
  const { data: cohorts } = await getSupabaseAdminClient()
    .from('profiles')
    .select('created_at, id')
    .order('created_at', { ascending: true });

  if (!cohorts) return [];

  // Grouper par mois d'inscription
  const cohortMap = new Map<string, string[]>();
  
  cohorts.forEach(user => {
    const month = new Date(user.created_at).toISOString().substring(0, 7);
    if (!cohortMap.has(month)) {
      cohortMap.set(month, []);
    }
    cohortMap.get(month)?.push(user.id);
  });

  // Pour chaque cohorte, calculer la rétention
  const cohortAnalysis: CohortData[] = [];
  
  for (const [month, userIds] of cohortMap.entries()) {
    if (userIds.length === 0) continue;

    // Calculer l'activité pour différentes périodes
    // Note: Ceci est une version simplifiée, idéalement il faudrait tracker les connexions
    const cohortSize = userIds.length;
    
    // Pour cette démo, nous utilisons des métriques proxy (commandes, abonnements)
    const { count: activeMonth1 } = await getSupabaseAdminClient()
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .gte('created_at', new Date(month + '-01').toISOString())
      .lt('created_at', new Date(new Date(month + '-01').setMonth(new Date(month + '-01').getMonth() + 1)).toISOString());

    cohortAnalysis.push({
      month,
      cohort_size: cohortSize,
      month_1: activeMonth1 || 0,
      month_2: Math.floor((activeMonth1 || 0) * 0.7), // Approximation
      month_3: Math.floor((activeMonth1 || 0) * 0.5),
      month_6: Math.floor((activeMonth1 || 0) * 0.3)
    });
  }

  return cohortAnalysis.slice(-12); // 12 derniers mois
} 