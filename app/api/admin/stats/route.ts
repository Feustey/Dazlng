import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, handleApiError } from '@/lib/api-utils';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

/**
 * GET /api/admin/stats - Statistiques basiques pour l'interface admin
 */
export async function GET(req: NextRequest): Promise<Response> {
  return withAdminAuth(req, async (_adminUser) => {
    try {
      // Nombre total d'utilisateurs
      const { count: totalUsers } = await getSupabaseAdminClient()
        .from("profiles")
        .select("id", { count: "exact", head: true });
      
      // Nombre d'abonnements actifs
      const { count: activeSubscriptions } = await getSupabaseAdminClient()
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active");
      
      // Revenu total (somme des paiements status 'paid')
      const { data: payments, error: paymentsError } = await getSupabaseAdminClient()
        .from("payments")
        .select("amount, status");
      
      if (paymentsError) throw paymentsError;
      
      const totalRevenue = payments
        ? payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0) 
        : 0;
      
      // Commandes en attente
      const { count: pendingOrders } = await getSupabaseAdminClient()
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("payment_status", "pending");

      return NextResponse.json({
        success: true,
        data: {
          totalUsers: totalUsers || 0,
          activeSubscriptions: activeSubscriptions || 0,
          totalRevenue,
          pendingOrders: pendingOrders || 0
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0",
          stats: {
            total: 4,
            period: 'current'
          }
        }
      });

    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 