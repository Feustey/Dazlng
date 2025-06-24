import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from './supabase';

// Types pour les réponses API admin
export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
    timestamp: string;
    version: string;
  };
}

// Types pour les filtres admin
export interface AdminFilterInput {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Types pour les notifications admin
export interface AdminNotification {
  id: string;
  admin_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  action?: {
    type: 'link' | 'button';
    label: string;
    url?: string;
  };
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// Types pour les statistiques
export interface EnhancedStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
  };
  payments: {
    total: number;
    successful: number;
    failed: number;
    totalAmount: number;
  };
  subscriptions: {
    total: number;
    active: number;
    cancelled: number;
    mrr: number;
  };
  prospects: {
    total: number;
    converted: number;
    conversionRate: number;
  };
  network: {
    totalNodes: number;
    activeChannels: number;
    totalCapacity: number;
  };
  system: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

// Cache simple en mémoire
class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttl: number = 300): void {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

// Clés de cache
const CACHE_KEYS = {
  STATS: (type: string) => `admin_stats_${type}`,
  NOTIFICATIONS: (adminId: string) => `admin_notifications_${adminId}`,
  USERS: (filters: string) => `admin_users_${filters}`,
  ORDERS: (filters: string) => `admin_orders_${filters}`,
} as const;

// TTL du cache
const CACHE_TTL = {
  STATS: 300, // 5 minutes
  NOTIFICATIONS: 60, // 1 minute
  USERS: 120, // 2 minutes
  ORDERS: 120, // 2 minutes
} as const;

// Builder pour les réponses API admin
export class AdminResponseBuilder {
  static success<T>(
    data: T, 
    meta?: AdminApiResponse<T>['meta']
  ): NextResponse<AdminApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        ...meta
      }
    });
  }

  static error(
    code: string,
    message: string,
    details?: any,
    status: number = 400
  ): NextResponse<AdminApiResponse<null>> {
    return NextResponse.json({
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    }, { status });
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    additionalMeta?: any
  ): NextResponse<AdminApiResponse<T[]>> {
    return NextResponse.json({
      success: true,
      data,
      meta: {
        pagination: {
          total,
          page,
          limit
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        ...additionalMeta
      }
    });
  }
}

// Parseur de filtres admin
export async function parseAdminFilters(req: NextRequest): Promise<{
  success: boolean;
  data?: AdminFilterInput;
  error?: string;
}> {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const search = url.searchParams.get('search') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Parse des filtres additionnels
    const filters: Record<string, any> = {};
    for (const [key, value] of url.searchParams.entries()) {
      if (!['page', 'limit', 'search', 'sortBy', 'sortOrder'].includes(key)) {
        filters[key] = value;
      }
    }

    return {
      success: true,
      data: {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors du parsing des filtres'
    };
  }
}

// Statistiques enrichies
export async function getEnhancedStats(): Promise<EnhancedStats> {
  try {
    const cacheKey = CACHE_KEYS.STATS('enhanced');
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const supabase = getSupabaseAdminClient();

    // Statistiques utilisateurs
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('last_sign_in_at', 'is', null);

    const { count: newUsersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    // Statistiques commandes
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'pending');

    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid');

    // Statistiques paiements
    const { count: totalPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    const { count: successfulPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'paid');

    const { count: failedPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    // Statistiques abonnements
    const { count: totalSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: cancelledSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled');

    // Statistiques prospects
    const { count: totalProspects } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true });

    const { count: convertedProspects } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('prospect', false);

    const stats: EnhancedStats = {
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        newThisMonth: newUsersThisMonth || 0,
        growth: totalUsers && newUsersThisMonth ? (newUsersThisMonth / totalUsers) * 100 : 0
      },
      orders: {
        total: totalOrders || 0,
        pending: pendingOrders || 0,
        completed: completedOrders || 0,
        revenue: 0 // À calculer avec les montants
      },
      payments: {
        total: totalPayments || 0,
        successful: successfulPayments || 0,
        failed: failedPayments || 0,
        totalAmount: 0 // À calculer avec les montants
      },
      subscriptions: {
        total: totalSubscriptions || 0,
        active: activeSubscriptions || 0,
        cancelled: cancelledSubscriptions || 0,
        mrr: 0 // À calculer
      },
      prospects: {
        total: totalProspects || 0,
        converted: convertedProspects || 0,
        conversionRate: totalProspects && convertedProspects ? (convertedProspects / totalProspects) * 100 : 0
      },
      network: {
        totalNodes: 0, // À récupérer depuis l'API Lightning
        activeChannels: 0,
        totalCapacity: 0
      },
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        cpuUsage: 0
      }
    };

    cache.set(cacheKey, stats, CACHE_TTL.STATS);
    return stats;

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
}

// Logging des actions admin
export async function logAdminAction(
  req: NextRequest,
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, any>,
  _notes?: string
): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes: changes ? JSON.stringify(changes) : null,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        created_at: new Date().toISOString()
      });

  } catch (error) {
    console.error('Erreur lors du logging de l\'action admin:', error);
  }
}

// Vérification des permissions admin
export async function checkAdminPermissions(
  userId: string,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'export'
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('permissions')
      .eq('user_id', userId)
      .single();

    if (error || !admin) return false;

    const permissions = admin.permissions as Record<string, string[]>;
    return permissions[resource]?.includes(action) || false;

  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error);
    return false;
  }
}

// Middleware d'authentification admin avec permissions
export function withEnhancedAdminAuth(
  handler: (req: NextRequest, adminId: string) => Promise<Response>,
  requiredPermissions?: { resource: string; action: string }
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      // Vérification de l'authentification
      const adminId = await validateAdminRequest(req);
      if (!adminId) {
        return AdminResponseBuilder.error(
          'UNAUTHORIZED',
          'Authentification admin requise',
          null,
          401
};
      }

      // Vérification des permissions si spécifiées
      if (requiredPermissions) {
        const hasPermission = await checkAdminPermissions(
          adminId,
          requiredPermissions.resource,
          requiredPermissions.action as any
};
        if (!hasPermission) {
          return AdminResponseBuilder.error(
            'FORBIDDEN',
            'Permissions insuffisantes',
            null,
            403
};
        }
      }

      // Exécution du handler
      return await handler(req, adminId);

    } catch (error) {
      console.error('Erreur dans le middleware admin:', error);
      return AdminResponseBuilder.error(
        'INTERNAL_ERROR',
        'Erreur interne du serveur',
        null,
        500
};
    }
  };
}

// Validation de l'authentification admin
async function validateAdminRequest(req: NextRequest): Promise<string | null> {
  try {
    // Vérification du token Bearer
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return await validateAdminToken(authHeader);
    }

    // Vérification des cookies de session
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      return await validateAdminSession(cookieHeader);
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la validation de la session admin:', error);
    return null;
  }
}

// Validation du token admin
async function validateAdminToken(authHeader: string): Promise<string | null> {
  try {
    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdminClient();
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    // Vérifier que l'utilisateur est admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    return admin ? user.id : null;

  } catch (error) {
    console.error('Erreur lors de la validation du token admin:', error);
    return null;
  }
}

// Validation de la session admin
async function validateAdminSession(_cookies: string): Promise<string | null> {
  try {
    // Implémentation de la validation par session
    // À adapter selon votre système d'authentification
    return null;
  } catch (error) {
    console.error('Erreur lors de la validation de la session admin:', error);
    return null;
  }
}

// Gestion des notifications admin
export async function createAdminNotification(
  adminId: string,
  type: AdminNotification['type'],
  title: string,
  message: string,
  action?: AdminNotification['action'],
  priority: AdminNotification['priority'] = 'medium'
): Promise<void> {
  try {
    const notification: Omit<AdminNotification, 'id'> = {
      admin_id: adminId,
      type,
      title,
      message,
      action,
      read: false,
      priority,
      created_at: new Date().toISOString()
    };
    
    await getSupabaseAdminClient()
      .from('admin_notifications')
      .insert(notification);
    
    // Invalider le cache des notifications
    cache.clear();
    
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
}

// Récupération des notifications admin
export async function getAdminNotifications(
  adminId: string,
  unreadOnly: boolean = false
): Promise<AdminNotification[]> {
  try {
    const cacheKey = CACHE_KEYS.NOTIFICATIONS(adminId);
    const cached = cache.get(cacheKey);
    if (cached && !unreadOnly) return cached;
    
    let query = getSupabaseAdminClient()
      .from('admin_notifications')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false });
    
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query.limit(50);
    
    if (error) throw error;
    
    if (!unreadOnly) {
      cache.set(cacheKey, data || [], CACHE_TTL.NOTIFICATIONS);
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return [];
  }
}

// Invalidation du cache
export function invalidateAdminCache(pattern?: string): void {
  if (pattern) {
    // Invalider les clés qui correspondent au pattern
    // Implémentation simple pour le cache en mémoire
    cache.clear();
  } else {
    cache.clear();
  }
}
