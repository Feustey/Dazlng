import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateAdminAccess } from "@/utils/adminHelpers";

export async function GET(req: NextRequest): Promise<Response> {
  const isAdmin = await validateAdminAccess(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
  // Nombre total d'utilisateurs
  const { count: totalUsers } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  // Nombre d'abonnements actifs
  const { count: activeSubscriptions } = await supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active");
  // Revenu total (somme des paiements status 'paid')
  const { data: payments, error: paymentsError } = await supabase.from("payments").select("amount, status");
  const totalRevenue = payments && !paymentsError ? payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0) : 0;
  // Commandes en attente
  const { count: pendingOrders } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending");

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    totalRevenue,
    pendingOrders: pendingOrders || 0
  });
} 