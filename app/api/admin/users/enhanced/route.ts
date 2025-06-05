import { NextRequest } from 'next/server';
import { 
  AdminResponseBuilder, 
  parseAdminFilters, 
  withEnhancedAdminAuth,
  logAdminAction
} from '@/lib/admin-utils';
import { supabase } from '@/lib/supabase';
import { ErrorCodes } from '@/types/database';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

/**
 * GET /api/admin/users/enhanced - Liste enrichie des utilisateurs avec filtres avancés
 */
async function getEnhancedUsersHandler(req: NextRequest, adminId: string): Promise<Response> {
  try {
    const filterResult = await parseAdminFilters(req);
    
    if (!filterResult.success) {
      return AdminResponseBuilder.error(
        ErrorCodes.VALIDATION_ERROR,
        filterResult.error || 'Paramètres invalides'
      );
    }
    
    const filters = filterResult.data!;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    
    // Construction de la requête de base avec jointures
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
    
    // Application des filtres
    if (filters.searchTerm) {
      query = query.or(`email.ilike.%${filters.searchTerm}%,nom.ilike.%${filters.searchTerm}%,prenom.ilike.%${filters.searchTerm}%`);
    }
    
    if (filters.status && filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          query = query.eq('email_verified', true);
          break;
        case 'pending':
          query = query.eq('email_verified', false);
          break;
      }
    }
    
    // Filtre par plage de dates
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('created_at', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('created_at', filters.dateRange.end);
      }
    }
    
    // Tri
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Pagination
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);
    
    const { data: profiles, error: profilesError, count } = await query;
    
    if (profilesError) {
      console.error('Erreur lors de la récupération des profils:', profilesError);
      return AdminResponseBuilder.error(
        ErrorCodes.DATABASE_ERROR,
        'Erreur lors de la récupération des utilisateurs'
      );
    }
    
    if (!profiles || profiles.length === 0) {
      return AdminResponseBuilder.paginated([], count || 0, page, limit);
    }
    
    // Enrichissement des données utilisateur
    const userIds = profiles.map(p => p.id);
    
    // Récupération des statistiques d'utilisation
    const [ordersData, subscriptionsData] = await Promise.all([
      // Commandes par utilisateur
      supabase
        .from('orders')
        .select('user_id, amount, payment_status')
        .in('user_id', userIds),
      
      // Abonnements actifs
      supabase
        .from('subscriptions')
        .select('user_id, status, plan_id, start_date, end_date')
        .in('user_id', userIds)
    ]);
    
    // Enrichissement des profils avec les statistiques
    const enrichedProfiles = profiles.map(profile => {
      // Statistiques des commandes
      const userOrders = ordersData.data?.filter(o => o.user_id === profile.id) || [];
      const ordersCount = userOrders.length;
      const totalSpent = userOrders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, order) => sum + (order.amount || 0), 0);
      
      // Abonnement actuel
      const activeSubscription = subscriptionsData.data?.find(
        s => s.user_id === profile.id && s.status === 'active'
      );
      
      // Dernière activité
      const lastActivity = new Date(profile.updated_at);
      const daysSinceLastActivity = Math.floor(
        (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        ...profile,
        statistics: {
          ordersCount,
          totalSpent,
          subscriptionStatus: activeSubscription?.plan_id || 'free',
          subscriptionStart: activeSubscription?.start_date,
          subscriptionEnd: activeSubscription?.end_date,
          daysSinceLastActivity,
          isActive: daysSinceLastActivity <= 30
        }
      };
    });
    
    // Logger l'accès aux données utilisateur
    await logAdminAction(
      req,
      adminId,
      'users_viewed',
      'users',
      'bulk',
      { 
        count: enrichedProfiles.length,
        filters: filterResult.data
      }
    );
    
    return AdminResponseBuilder.paginated(
      enrichedProfiles,
      count || 0,
      page,
      limit,
      {
        filters: filterResult.data,
        enrichment: {
          includesStatistics: true,
          includesSubscriptions: true,
          includesActivity: true
        }
      }
    );
    
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs enrichis:', error);
    return AdminResponseBuilder.error(
      ErrorCodes.INTERNAL_ERROR,
      'Erreur lors de la récupération des utilisateurs',
      null,
      500
    );
  }
}

/**
 * Export de la route GET avec middleware d'administration
 */
export const GET = withEnhancedAdminAuth(
  getEnhancedUsersHandler,
  { resource: 'users', action: 'read' }
); 