import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // TODO: Ajouter une vérification d'authentification admin ici
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const status = url.searchParams.get("status"); // otp_only, conversion_candidate, converted
    const source = url.searchParams.get("source"); // otp_login, register, etc.
    
    const offset = (page - 1) * limit;

    // Construction de la requête avec filtres
    let query = getSupabaseAdminClient()
      .from("user_email_tracking")
      .select("*", { count: "exact" })
      .order("last_seen_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("conversion_status", status);
    }
    
    if (source) {
      query = query.eq("source", source);
    }

    const { data: emailTracking, count, error } = await query;

    if (error) {
      console.error("[EMAIL-ANALYTICS] Erreur récupération données:", error);
      return new Response(JSON.stringify({ 
        error: "Erreur lors de la récupération des données" 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Statistiques globales
    const { data: globalStats } = await getSupabaseAdminClient()
      .from("user_email_tracking")
      .select("conversion_status, source")
      .not("conversion_status", "is", null);

    // Calcul des métriques
    const stats = {
      total: count || 0,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      conversionRate: 0,
      activeUsersLast7Days: 0
    };

    if (globalStats) {
      // Grouper par statut
      globalStats.forEach((item: any) => {
        stats.byStatus[item.conversion_status] = (stats.byStatus[item.conversion_status] || 0) + 1;
        if (item.source) {
          stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;
        }
      });

      // Calcul du taux de conversion
      const converted = stats.byStatus["converted"] || 0;
      const total = globalStats.length;
      stats.conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    }

    // Analyse des tendances (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentActivity } = await getSupabaseAdminClient()
      .from("user_email_tracking")
      .select("first_seen_at, conversion_status")
      .gte("first_seen_at", thirtyDaysAgo.toISOString());

    const trends = {
      newUsersLast30Days: recentActivity?.length || 0,
      conversionsLast30Days: recentActivity?.filter(u => u.conversion_status === "converted").length || 0
    };

    // Utilisateurs actifs (connexion dans les 7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: activeUsers } = await getSupabaseAdminClient()
      .from("user_email_tracking")
      .select("email")
      .gte("last_seen_at", sevenDaysAgo.toISOString());

    stats.activeUsersLast7Days = activeUsers?.length || 0;

    const response = {
      success: true,
      data: emailTracking,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      statistics: stats,
      trends
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("[EMAIL-ANALYTICS] Erreur:", error);
    return new Response(JSON.stringify({ 
      error: "Erreur interne du serveur",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST pour déclencher des actions de conversion manuelles
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { action, email, notes } = await req.json();

    if (!action || !email) {
      return new Response(JSON.stringify({ 
        error: "Action et email requis" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    switch (action) {
      case "mark_as_converted":
        await getSupabaseAdminClient()
          .from("user_email_tracking")
          .update({
            conversion_status: "converted",
            notes: notes || "Marqué comme converti manuellement",
            last_seen_at: new Date().toISOString()
          })
          .eq("email", email);
        break;

      case "mark_as_candidate":
        await getSupabaseAdminClient()
          .from("user_email_tracking")
          .update({
            conversion_status: "conversion_candidate",
            notes: notes || "Marqué comme candidat à la conversion",
            last_seen_at: new Date().toISOString()
          })
          .eq("email", email);
        break;

      case "reset_status":
        await getSupabaseAdminClient()
          .from("user_email_tracking")
          .update({
            conversion_status: "otp_only",
            notes: notes || "Statut réinitialisé",
            last_seen_at: new Date().toISOString()
          })
          .eq("email", email);
        break;

      default:
        return new Response(JSON.stringify({ 
          error: "Action non reconnue" 
        }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }

    console.log("[EMAIL-ANALYTICS] Action exécutée:", { action, email, notes });

    return NextResponse.json({ 
      success: true,
      message: `Action ${action} exécutée avec succès pour ${email}`
    });

  } catch (error) {
    console.error("[EMAIL-ANALYTICS] Erreur action POST:", error);
    return new Response(JSON.stringify({ 
      error: "Erreur lors de l'exécution de l'action",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const dynamic = "force-dynamic";