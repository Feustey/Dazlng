import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { dazNodePerformanceService } from "@/lib/services/daznode-performance-service";

// Vérifier le secret du cron
const validateCronSecret = (request: Request): boolean => {
  const headersList = headers();
  const authHeader = headersList.get("authorization");
  
  if (!authHeader) {
    return false;
  }

  const [type, token] = authHeader.split(" ");
  return type === "Bearer" && token === process.env.CRON_SECRET;
};

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    if (!validateCronSecret(request)) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Non autorisé"
        }
      }, { status: 401 });
    }

    // Récupérer tous les abonnements actifs
    const supabase = getSupabaseAdminClient();
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("daznode_subscriptions")
      .select("pubkey")
      .eq("payment_status", "paid")
      .gt("end_date", new Date().toISOString());

    if (subscriptionError) {
      throw new Error("Erreur lors de la récupération des abonnements");
    }

    // Enregistrer les performances pour chaque nœud
    const results = {
      total: subscriptions.length,
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const subscription of subscriptions) {
      try {
        await dazNodePerformanceService.logNodePerformance(subscription.pubkey);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `${subscription.pubkey}: ${error instanceof Error ? error.message : "Erreur inconnue"}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("❌ Erreur log performances:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Erreur inattendue"
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";