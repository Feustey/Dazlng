import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { 
  errorResponse,
  paginatedResponse,
  handleApiError,
  logApiRequest
} from '@/lib/api-response';
import { 
  adminQuerySchema,
  validateData
} from '@/lib/validations';
import { withAdmin } from '@/lib/middleware';
import { ErrorCodes } from '@/types/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { AdminUser } from '@/types/database';

/**
 * GET /api/admin/users - Liste tous les utilisateurs avec pagination et filtres
 * Nécessite des droits d'administration
 */
async function getUsersHandler(req: NextRequest, user: SupabaseUser): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    
    // Validation des paramètres de requête
    const validationResult = validateData(adminQuerySchema, Object.fromEntries(searchParams.entries()));
    if (!validationResult.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Paramètres de requête invalides',
        // @ts-expect-error - TypeScript Zod validation narrowing issue
        validationResult.error.details
      );
    }

    const { page = 1, limit = 20, sort = 'created_at:desc', search } = validationResult.data;

    logApiRequest('GET', '/api/admin/users', user.id, { page, limit, search });

    // Construction de la requête avec jointures pour les statistiques
    let query = supabase
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
        settings
      `, { count: 'exact' });

    // Filtrage par recherche si spécifié
    if (search) {
      query = query.or(`email.ilike.%${search}%,nom.ilike.%${search}%,prenom.ilike.%${search}%`);
    }

    // Tri
    const [sortField, sortOrder] = sort.split(':');
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Pagination
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data: profiles, error: profilesError, count } = await query;

    if (profilesError) {
      console.error('Erreur lors de la récupération des profils:', profilesError);
      return errorResponse(ErrorCodes.DATABASE_ERROR, 'Erreur lors de la récupération des utilisateurs');
    }

    if (!profiles || profiles.length === 0) {
      return paginatedResponse([], count || 0, page, limit);
    }

    // Récupérer les statistiques additionnelles pour chaque utilisateur
    const userIds = profiles.map(p => p.id);
    
    // Compter les commandes par utilisateur
    const { data: orderCounts } = await supabase
      .from('orders')
      .select('user_id')
      .in('user_id', userIds);

    // Calculer le total dépensé par utilisateur
    const { data: orderTotals } = await supabase
      .from('orders')
      .select('user_id, amount')
      .eq('payment_status', 'paid')
      .in('user_id', userIds);

    // Récupérer les statuts d'abonnement
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, status, plan_id')
      .eq('status', 'active')
      .in('user_id', userIds);

    // Enrichir les données des utilisateurs
    const enrichedUsers: AdminUser[] = profiles.map(profile => {
      const ordersCount = orderCounts?.filter(o => o.user_id === profile.id).length || 0;
      const totalSpent = orderTotals?.filter(o => o.user_id === profile.id)
        .reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const subscription = subscriptions?.find(s => s.user_id === profile.id);

      return {
        ...profile,
        ordersCount,
        totalSpent,
        subscriptionStatus: subscription?.plan_id || 'free'
      };
    });

    return paginatedResponse(enrichedUsers, count || 0, page, limit);

  } catch (error) {
    return handleApiError(error, 'GET /api/admin/users');
  }
}

/**
 * Export de la route GET avec middleware d'administration
 */
export const GET = withAdmin(getUsersHandler); 