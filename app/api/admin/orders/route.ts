import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { withAdminAuth, handleApiError } from '@/lib/api-utils';
import { z } from 'zod';
import { ErrorCodes } from '@/types/database';

// Schéma de validation pour les paramètres de requête
const querySchema = z.object({
  id: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.string().regex(/^[a-zA-Z_]+:(asc|desc)$/).default('created_at:desc'),
  status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional()
});

// GET /api/admin/orders - Liste ou détails des commandes
export async function GET(req: NextRequest): Promise<Response> {
  return withAdminAuth(req, async (_adminUser) => {
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

      const { id, limit, sort, status } = result.data;
      const [sortField, sortOrder] = sort.split(':');

      // Si un ID est fourni, récupérer les détails complets de la commande
      if (id) {
        // Récupérer la commande avec les informations utilisateur et livraison
        const { data: orderData, error: orderError } = await getSupabaseAdminClient()
          .from("orders")
          .select(`
            *,
            profiles:user_id (
              id,
              email,
              nom,
              prenom,
              pubkey,
              compte_x,
              compte_nostr,
              created_at,
              email_verified
            )
          `)
          .eq("id", id)
          .single();

        if (orderError) throw orderError;

        // Récupérer les informations de livraison
        const { data: deliveryData } = await getSupabaseAdminClient()
          .from("deliveries")
          .select("*")
          .eq("order_id", id)
          .single();

        // Récupérer les informations de paiement
        const { data: paymentData } = await getSupabaseAdminClient()
          .from("payments")
          .select("*")
          .eq("order_id", id)
          .single();

        return NextResponse.json({
          success: true,
          data: {
            ...orderData,
            delivery: deliveryData || null,
            payment: paymentData || null
          },
          meta: {
            timestamp: new Date().toISOString(),
            version: "1.0"
          }
        });
      }

      // Liste des commandes avec pagination
      let query = getSupabaseAdminClient()
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            nom,
            prenom
          )
        `, { count: "exact" })
        .order(sortField, { ascending: sortOrder === "asc" })
        .limit(limit);

      if (status) {
        query = query.eq("payment_status", status);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || [],
        meta: {
          total: count || 0,
          limit,
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });

    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 