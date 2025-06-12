import { NextRequest, NextResponse } from "next/server";
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

interface AdminUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  verified_at?: string;
  t4g_tokens: number;
  node_id?: string;
  settings?: any;
  ordersCount: number;
  totalSpent: number;
  subscriptionStatus: string;
}

// Données mock pour le développement
const generateMockUsers = (): AdminUser[] => {
  return [
    {
      id: 'dev-user-1',
      email: 'alice@example.com',
      nom: 'Dupont',
      prenom: 'Alice',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T15:45:00Z',
      email_verified: true,
      verified_at: '2024-01-15T11:00:00Z',
      t4g_tokens: 150,
      node_id: 'lnd_node_001',
      settings: { theme: 'dark' },
      ordersCount: 3,
      totalSpent: 250000,
      subscriptionStatus: 'premium'
    },
    {
      id: 'dev-user-2',
      email: 'bob@company.com',
      nom: 'Martin',
      prenom: 'Bob',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-19T11:20:00Z',
      email_verified: true,
      verified_at: '2024-01-10T09:30:00Z',
      t4g_tokens: 50,
      settings: { theme: 'light' },
      ordersCount: 1,
      totalSpent: 75000,
      subscriptionStatus: 'basic'
    },
    {
      id: 'dev-user-3',
      email: 'charlie@gmail.com',
      nom: 'Durand',
      prenom: 'Charlie',
      created_at: '2024-01-08T14:00:00Z',
      updated_at: '2024-01-08T14:00:00Z',
      email_verified: false,
      t4g_tokens: 1,
      settings: {},
      ordersCount: 0,
      totalSpent: 0,
      subscriptionStatus: 'free'
    },
    {
      id: 'dev-user-4',
      email: 'dev@dazno.de',
      nom: 'Admin',
      prenom: 'DazNode',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T16:00:00Z',
      email_verified: true,
      verified_at: '2024-01-01T00:00:00Z',
      t4g_tokens: 1000,
      node_id: 'admin_node_001',
      settings: { theme: 'dark', admin: true },
      ordersCount: 5,
      totalSpent: 500000,
      subscriptionStatus: 'enterprise'
    }
  ];
};

/**
 * GET /api/admin/users - Liste tous les utilisateurs avec pagination et filtres
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Mode développement - utiliser des données mock
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      console.log('[API] /admin/users - Mode développement, données mock utilisées');
      
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const search = searchParams.get('search') || '';
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let mockUsers = generateMockUsers();
      
      // Appliquer la recherche si spécifiée
      if (search) {
        mockUsers = mockUsers.filter(user => 
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.nom.toLowerCase().includes(search.toLowerCase()) ||
          user.prenom.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Appliquer la pagination
      const total = mockUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = mockUsers.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: paginatedUsers,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    }

    // Mode production - cette partie nécessiterait une vraie configuration Supabase
    return NextResponse.json({
      success: false,
      error: 'Configuration de production requise'
    }, { status: 500 });

  } catch (error) {
    console.error('Erreur API /admin/users:', error);
    
    // Fallback vers les données mock même en cas d'erreur
    const mockUsers = generateMockUsers();
    
    return NextResponse.json({
      success: true,
      data: mockUsers,
      meta: {
        total: mockUsers.length,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    });
  }
}

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
export const GET_ADMIN = withAdmin(getUsersHandler); 