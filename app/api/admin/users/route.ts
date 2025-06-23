import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { withAdminAuth, handleApiError } from '@/lib/api-utils';
import { ErrorCodes } from '@/types/database';
import { z } from 'zod';

// Schéma de validation pour les paramètres de requête
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().regex(/^[a-zA-Z_]+:(asc|desc)$/).default('created_at:desc')
});

// GET /api/admin/users - Liste tous les utilisateurs avec pagination et filtres
export async function GET(req: NextRequest): Promise<Response> {
  return withAdminAuth(req, async () => {
    try {
      const { searchParams } = new URL(req.url);
      const result = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Paramètres de requête invalides",
            details: result.error.issues
          }
        }, { status: 400 });
      }

      const { page, limit, search, sort } = result.data;
      const [field, order] = sort.split(':');

      // Construction de la requête
      let query = getSupabaseAdminClient()
        .from('profiles')
        .select(`
          id,
          email,
          nom,
          prenom,
          created_at,
          updated_at,
          email_verified,
          verified_at,
          t4g_tokens,
          node_id,
          settings,
          orders (count),
          subscriptions (
            status,
            plan_id
          )
        `, { count: 'exact' })
        .order(field, { ascending: order === 'asc' })
        .range((page - 1) * limit, page * limit - 1);

      // Appliquer la recherche si spécifiée
      if (search) {
        query = query.or(`email.ilike.%${search}%,nom.ilike.%${search}%,prenom.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Enrichir les données avec les statistiques
      const enrichedUsers = await Promise.all((data || []).map(async (user) => {
        // Récupérer le total dépensé
        const { data: ordersData } = await getSupabaseAdminClient()
          .from('orders')
          .select('amount')
          .eq('user_id', user.id)
          .eq('payment_status', 'paid');

        const totalSpent = ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

        return {
          ...user,
          ordersCount: user.orders?.length || 0,
          totalSpent,
          subscriptionStatus: user.subscriptions?.[0]?.status || 'free'
        };
      }));

      return NextResponse.json({
        success: true,
        data: enrichedUsers,
        meta: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });

    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 