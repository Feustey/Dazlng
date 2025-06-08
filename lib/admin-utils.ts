import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { 
  AdminApiResponse, 
  EnhancedStats, 
  AdminAuditLog, 
  AdminNotification,
  AdminPermission,
  AdminFilterInput
} from '@/types/admin';
import { ErrorCodes } from '@/types/database';
import { validateData } from '@/lib/validations';
import { adminFilterSchema } from '@/types/admin';

// Cache simple en mémoire (à remplacer par Redis en production)
class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  set(key: string, data: any, ttl: number = 300): void {
    const expiry = Date.now() + (ttl * 1000);
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

// Constantes pour le cache
const CACHE_KEYS = {
  STATS: 'admin:stats',
  USER_COUNT: 'admin:user_count',
  REVENUE: 'admin:revenue',
  NOTIFICATIONS: (adminId: string) => `admin:notifications:${adminId}`
};

const CACHE_TTL = {
  STATS: 300, // 5 minutes
  USER_COUNT: 600, // 10 minutes
  REVENUE: 300, // 5 minutes
  NOTIFICATIONS: 60 // 1 minute
};

// Utilitaire pour les réponses admin standardisées
export class AdminResponseBuilder {
  static success<T>(
    data: T, 
    meta?: AdminApiResponse<T>['meta']
  ): NextResponse<AdminApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString()
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
      error: { code, message, details }
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
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total,
          filtered: data.length
        },
        timestamp: new Date().toISOString(),
        ...additionalMeta
      }
    });
  }
}

// Validation et parsing des filtres admin
export async function parseAdminFilters(req: NextRequest): Promise<{
  success: boolean;
  data?: AdminFilterInput;
  error?: string;
}> {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, any> = Object.fromEntries(searchParams.entries());
    
    // Conversion des paramètres de type
    if (params.page) params.page = parseInt(params.page);
    if (params.limit) params.limit = parseInt(params.limit);
    
    // Gestion de la plage de dates
    if (params.startDate || params.endDate) {
      params.dateRange = {
        start: params.startDate,
        end: params.endDate
      };
      delete params.startDate;
      delete params.endDate;
    }
    
    const validation = validateData(adminFilterSchema, params);
    
    if (!validation.success) {
      return {
        success: false,
        error: 'Paramètres de filtrage invalides'
      };
    }
    
    return {
      success: true,
      data: validation.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors du parsing des filtres'
    };
  }
}

// Calcul des statistiques enrichies
export async function getEnhancedStats(): Promise<EnhancedStats> {
  const cached = cache.get(CACHE_KEYS.STATS);
  if (cached) return cached;
  
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Statistiques utilisateurs
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
    
    const { count: activeLastMonth } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('updated_at', lastMonth.toISOString());
    
    const { count: withSubscriptions } = await supabase
      .from('subscriptions')
      .select('user_id', { count: 'exact', head: true })
      .eq('status', 'active');
    
    // Statistiques de revenus
    const { data: paidPayments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'paid');
    
    const totalRevenue = paidPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    
    const thisMonthPayments = paidPayments?.filter(p => 
      new Date(p.created_at) >= thisMonthStart
    ) || [];
    
    const lastMonthPayments = paidPayments?.filter(p => {
      const date = new Date(p.created_at);
      return date >= lastMonth && date < thisMonthStart;
    }) || [];
    
    const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Statistiques par produit
    const { data: orders } = await supabase
      .from('orders')
      .select('product_type, amount, payment_status');
    
    const productStats = {
      daznode: { active: 0, total: 0, revenue: 0 },
      dazbox: { active: 0, total: 0, revenue: 0 },
      dazpay: { active: 0, total: 0, revenue: 0 }
    };
    
    orders?.forEach(order => {
      if (order.product_type in productStats) {
        const product = productStats[order.product_type as keyof typeof productStats];
        product.total++;
        if (order.payment_status === 'paid') {
          product.active++;
          product.revenue += order.amount || 0;
        }
      }
    });
    
    // Statistiques de paiements
    const { data: allPayments } = await supabase
      .from('payments')
      .select('status, amount');
    
    const paymentStats = allPayments?.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const stats: EnhancedStats = {
      users: {
        total: totalUsers || 0,
        activeLastMonth: activeLastMonth || 0,
        withSubscriptions: withSubscriptions || 0,
        conversionRate: totalUsers ? Math.round((withSubscriptions || 0) / totalUsers * 100) : 0,
        growthRate: lastMonth ? Math.round(((activeLastMonth || 0) / (totalUsers || 1)) * 100) : 0
      },
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: lastMonthRevenue ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0,
        averageOrderValue: Math.round(totalRevenue / Math.max(paidPayments?.length || 1, 1))
      },
      products: productStats,
      payments: {
        success: paymentStats.paid || 0,
        failed: paymentStats.failed || 0,
        pending: paymentStats.pending || 0,
        averageAmount: Math.round(totalRevenue / Math.max(allPayments?.length || 1, 1)),
        successRate: allPayments?.length ? Math.round((paymentStats.paid || 0) / allPayments.length * 100) : 0
      },
      network: {
        totalNodes: 0, // À implémenter avec les données Lightning
        activeNodes: 0,
        totalChannels: 0,
        totalCapacity: 0
      }
    };
    
    cache.set(CACHE_KEYS.STATS, stats, CACHE_TTL.STATS);
    return stats;
    
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    throw new Error('Impossible de calculer les statistiques');
  }
}

// Audit des actions admin
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
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', adminId)
      .single();
    
    const auditLog: Omit<AdminAuditLog, 'id'> = {
      admin_id: adminId,
      admin_email: adminProfile?.email || 'unknown',
      action,
      entity_type: entityType,
      entity_id: entityId,
      changes: changes || {},
      ip_address: ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString()
    };
    
    await supabase
      .from('admin_audit_logs')
      .insert(auditLog);
      
    console.log('[ADMIN-AUDIT]', {
      admin: adminProfile?.email,
      action,
      entity: `${entityType}:${entityId}`
    });
    
  } catch (error) {
    console.error('Erreur lors du logging de l\'action admin:', error);
    // Ne pas faire échouer l'action principale en cas d'erreur de logging
  }
}

// Gestion des permissions admin
export async function checkAdminPermissions(
  userId: string,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'export'
): Promise<boolean> {
  try {
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role, permissions')
      .eq('user_id', userId)
      .single();
    
    if (!adminRole) return false;
    
    // Super admin a tous les droits
    if (adminRole.role === 'super_admin') return true;
    
    // Vérifier les permissions spécifiques
    const permissions = adminRole.permissions as AdminPermission[];
    const resourcePermission = permissions.find(p => p.resource === resource);
    
    return resourcePermission?.actions.includes(action) || false;
    
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error);
    return false;
  }
}

// Middleware de sécurité renforcé
export function withEnhancedAdminAuth(
  handler: (req: NextRequest, adminId: string) => Promise<Response>,
  requiredPermissions?: { resource: string; action: string }
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      // Pour le développement, on va simplifier l'auth admin
      // En production, il faudrait implémenter une véritable auth admin
      
      // Récupération du token de session depuis les cookies ou headers
      const authHeader = req.headers.get('authorization');
      const cookies = req.headers.get('cookie');
      
      let adminId: string | null = null;
      
      // Essayer avec le header Authorization
      if (authHeader) {
        adminId = await validateAdminToken(authHeader);
      }
      
      // Essayer avec les cookies de session Supabase
      if (!adminId && cookies) {
        adminId = await validateAdminSession(cookies);
      }
      
      // Pour le développement local, autoriser sans auth si pas de config admin
      if (!adminId && process.env.NODE_ENV === 'development') {
        console.warn('Mode développement : authentification admin simplifiée');
        adminId = 'dev-admin-user';
      }
      
      if (!adminId) {
        return AdminResponseBuilder.error(
          ErrorCodes.UNAUTHORIZED,
          'Authentification admin requise',
          null,
          401
        );
      }
      
      // Vérification des permissions si spécifiées (skip en développement)
      if (requiredPermissions && process.env.NODE_ENV !== 'development') {
        const hasPermission = await checkAdminPermissions(
          adminId,
          requiredPermissions.resource,
          requiredPermissions.action as any
        );
        
        if (!hasPermission) {
          return AdminResponseBuilder.error(
            ErrorCodes.FORBIDDEN,
            'Permissions insuffisantes',
            { required: requiredPermissions },
            403
          );
        }
      }
      
      return await handler(req, adminId);
      
    } catch (error) {
      console.error('Erreur dans le middleware admin:', error);
      return AdminResponseBuilder.error(
        ErrorCodes.INTERNAL_ERROR,
        'Erreur interne du serveur',
        null,
        500
      );
    }
  };
}

// Validation du token admin (à personnaliser)
async function validateAdminToken(authHeader: string): Promise<string | null> {
  try {
    // Implémentation à adapter selon votre système d'auth
    // Exemple avec JWT ou session Supabase
    const token = authHeader.replace('Bearer ', '');
    
    // Validation du token et récupération de l'utilisateur
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return null;
    
    // Vérifier si l'utilisateur est admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    return adminRole ? user.id : null;
    
  } catch (error) {
    console.error('Erreur lors de la validation du token admin:', error);
    return null;
  }
}

// Validation de la session admin via cookies
async function validateAdminSession(_cookies: string): Promise<string | null> {
  try {
    // Essayer de récupérer la session depuis les cookies
    // Pour le moment, on retourne null car on utilise le mode développement
    // En production, il faudrait parser les cookies de session Supabase
    
    // Mode simplifié pour le développement
    if (process.env.NODE_ENV === 'development') {
      return 'dev-admin-user';
    }
    
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
    
    await supabase
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
    
    let query = supabase
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