import { NextRequest } from 'next/server';
import { AdminResponseBuilder, withEnhancedAdminAuth } from '@/lib/admin-utils';
import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

/**
 * GET /api/admin/stats - Statistiques basiques pour l'interface admin
 */
async function getBasicStatsHandler(_req: NextRequest, _adminId: string): Promise<Response> {
  try {
    // Nombre total d'utilisateurs
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });
    
    // Nombre d'abonnements actifs
    const { count: activeSubscriptions } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");
    
    // Revenu total (somme des paiements status 'paid')
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("amount, status");
    
    const totalRevenue = payments && !paymentsError 
      ? payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0) 
      : 0;
    
    // Commandes en attente
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "pending");

    const stats = {
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0
    };

    return AdminResponseBuilder.success(stats, {
      stats: {
        total: 4,
        period: 'current'
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return AdminResponseBuilder.error(
      'INTERNAL_ERROR',
      'Erreur lors de la récupération des statistiques',
      null,
      500
    );
  }
}

export const GET = withEnhancedAdminAuth(
  getBasicStatsHandler,
  { resource: 'stats', action: 'read' }
); 