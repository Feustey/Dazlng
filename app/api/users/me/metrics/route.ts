import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { withAuth, handleApiError } from '@/lib/api-utils';

// GET /api/users/me/metrics - Métriques utilisateur
export async function GET(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user) => {
    try {
      // Récupérer les métriques de l'utilisateur
      const { data, error } = await getSupabaseAdminClient()
        .from("user_metrics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || {
          user_id: user.id,
          total_views: 0,
          total_likes: 0,
          total_shares: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
}

// POST /api/users/me/metrics - Mettre à jour les métriques
export async function POST(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user) => {
    try {
      const body = await req.json();
      
      // Récupérer les métriques actuelles
      const { data: currentMetrics, error: fetchError } = await getSupabaseAdminClient()
        .from("user_metrics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      const updatedMetrics = {
        user_id: user.id,
        total_views: (currentMetrics?.total_views || 0) + (body.views || 0),
        total_likes: (currentMetrics?.total_likes || 0) + (body.likes || 0),
        total_shares: (currentMetrics?.total_shares || 0) + (body.shares || 0),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await getSupabaseAdminClient()
        .from("user_metrics")
        .upsert(updatedMetrics)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 