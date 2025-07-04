import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "./supabase";

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
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

// Types pour les notifications admin
export interface AdminNotification {
  id: string;
  admin_id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  action?: {
    type: "link" | "button";
    label: string;
    url?: string;
  };
  read: boolean;
  priority: "low" | "medium" | "high";
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
  private cache = new Map<string, any>();

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
  ORDERS: (filters: string) => `admin_orders_${filters}`
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
    meta?: AdminApiResponse<T>["meta"]
  ): NextResponse<AdminApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        ...meta
      }
    });
  }

  static error(
    code: string,
    message: string,
    details?: any,
    status: number = 400
  ): NextResponse<AdminApiResponse<any>> {
    return NextResponse.json({
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0"
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
        version: "1.0.0",
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
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    
    // Validation des paramètres
    if (page < 1) {
      return { success: false, error: "Page doit être >= 1" };
    }
    
    if (limit < 1 || limit > 100) {
      return { success: false, error: "Limit doit être entre 1 et 100" };
    }
    
    if (sortOrder !== "asc" && sortOrder !== "desc") {
      return { success: false, error: "SortOrder doit être 'asc' ou 'desc'" };
    }
    
    // Filtres supplémentaires
    const filters: Record<string, any> = {};
    const status = searchParams.get("status");
    if (status) filters.status = status;
    
    const dateRange = searchParams.get("dateRange");
    if (dateRange) {
      try {
        filters.dateRange = JSON.parse(dateRange);
      } catch {
        return { success: false, error: "DateRange invalide" };
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
      error: error instanceof Error ? error.message : "Erreur lors du parsing des filtres"
    };
  }
}

// Fonction pour récupérer les statistiques enrichies
export async function getEnhancedStats(): Promise<EnhancedStats> {
  const cacheKey = CACHE_KEYS.STATS("enhanced");
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const supabase = getSupabaseAdminClient();
    
    // Récupération parallèle des statistiques
    const [
      usersResult,
      ordersResult,
      paymentsResult,
      subscriptionsResult,
      prospectsResult
    ] = await Promise.all([
      // Utilisateurs
      supabase
        .from("profiles")
        .select("id, created_at, email_verified")
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      
      // Commandes
      supabase
        .from("orders")
        .select("amount, payment_status"),
      
      // Paiements
      supabase
        .from("payments")
        .select("amount, status"),
      
      // Abonnements
      supabase
        .from("subscriptions")
        .select("status, plan_id"),
      
      // Prospects
      supabase
        .from("prospects")
        .select("prospect, date")
    ]);
    
    // Calcul des statistiques
    const users = usersResult.data || [];
    const orders = ordersResult.data || [];
    const payments = paymentsResult.data || [];
    const subscriptions = subscriptionsResult.data || [];
    const prospects = prospectsResult.data || [];
    
    const stats: EnhancedStats = {
      users: {
        total: users.length,
        active: users.filter(u => u.email_verified).length,
        newThisMonth: users.length,
        growth: 0 // À calculer avec les données historiques
      },
      orders: {
        total: orders.length,
        pending: orders.filter(o => o.payment_status === "pending").length,
        completed: orders.filter(o => o.payment_status === "paid").length,
        revenue: orders
          .filter(o => o.payment_status === "paid")
          .reduce((sum, o) => sum + (o.amount || 0), 0)
      },
      payments: {
        total: payments.length,
        successful: payments.filter(p => p.status === "paid").length,
        failed: payments.filter(p => p.status === "failed").length,
        totalAmount: payments
          .filter(p => p.status === "paid")
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      },
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === "active").length,
        cancelled: subscriptions.filter(s => s.status === "cancelled").length,
        mrr: subscriptions
          .filter(s => s.status === "active")
          .reduce((sum, s) => sum + (s.plan_id === "premium" ? 1000 : 500), 0)
      },
      prospects: {
        total: prospects.length,
        converted: prospects.filter(p => !p.prospect).length,
        conversionRate: prospects.length > 0 
          ? (prospects.filter(p => !p.prospect).length / prospects.length) * 100 
          : 0
      },
      network: {
        totalNodes: 0, // À implémenter
        activeChannels: 0, // À implémenter
        totalCapacity: 0 // À implémenter
      },
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        cpuUsage: 0 // À implémenter
      }
    };
    
    cache.set(cacheKey, stats, CACHE_TTL.STATS);
    return stats;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    throw error;
  }
}

// Fonction pour logger les actions admin
export async function logAdminAction(
  req: NextRequest,
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, any>,
  notes?: string
): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    
    await supabase
      .from("admin_audit_log")
      .insert({
        admin_id: adminId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        changes: changes || {},
        notes: notes || "",
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
        user_agent: req.headers.get("user-agent") || "unknown"
      });
  } catch (error) {
    console.error("Erreur lors du logging de l'action admin:", error);
  }
}

// Fonction pour vérifier les permissions admin
export async function checkAdminPermissions(
  userId: string,
  resource: string,
  action: "read" | "write" | "delete" | "export"
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    
    if (!profile) return false;
    
    // Logique de permissions basique
    if (profile.role === "admin") return true;
    if (profile.role === "moderator" && action === "read") return true;
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error);
    return false;
  }
}

// Middleware d'authentification admin
export function withEnhancedAdminAuth(
  handler: (req: NextRequest, adminId: string) => Promise<Response>,
  requiredPermissions?: { resource: string; action: string }
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      // Validation de l'authentification
      const adminId = await validateAdminRequest(req);
      
      if (!adminId) {
        return AdminResponseBuilder.error(
          "UNAUTHORIZED",
          "Authentification admin requise",
          null,
          401
        );
      }
      
      // Vérification des permissions si spécifiées
      if (requiredPermissions) {
        const hasPermission = await checkAdminPermissions(
          adminId,
          requiredPermissions.resource,
          requiredPermissions.action as any
        );
        
        if (!hasPermission) {
          return AdminResponseBuilder.error(
            "FORBIDDEN",
            "Permissions insuffisantes",
            null,
            403
          );
        }
      }
      
      // Exécution du handler
      return await handler(req, adminId);
      
    } catch (error) {
      console.error("Erreur dans le middleware admin:", error);
      return AdminResponseBuilder.error(
        "INTERNAL_ERROR",
        "Erreur interne du serveur",
        null,
        500
      );
    }
  };
}

// Validation de la requête admin
async function validateAdminRequest(req: NextRequest): Promise<string | null> {
  // Vérifier l'en-tête d'autorisation
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    return await validateAdminToken(authHeader);
  }
  
  // Vérifier les cookies de session
  const cookies = req.headers.get("cookie");
  if (cookies) {
    return await validateAdminSession(cookies);
  }
  
  return null;
}

// Validation du token admin
async function validateAdminToken(authHeader: string): Promise<string | null> {
  try {
    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }
    
    const token = authHeader.substring(7);
    // Ici, vous devriez implémenter la validation JWT
    // Pour l'instant, on retourne null
    return null;
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error);
    return null;
  }
}

// Validation de la session admin
async function validateAdminSession(cookies: string): Promise<string | null> {
  try {
    // Ici, vous devriez implémenter la validation de session
    // Pour l'instant, on retourne null
    return null;
  } catch (error) {
    console.error("Erreur lors de la validation de session:", error);
    return null;
  }
}

// Fonction pour récupérer les notifications admin
export async function getAdminNotifications(
  adminId: string,
  unreadOnly: boolean = false
): Promise<AdminNotification[]> {
  const cacheKey = CACHE_KEYS.NOTIFICATIONS(adminId);
  const cached = cache.get(cacheKey);
  
  if (cached && !unreadOnly) {
    return cached;
  }
  
  try {
    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from("admin_notifications")
      .select("*")
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false });
    
    if (unreadOnly) {
      query = query.eq("read", false);
    }
    
    const { data: notifications } = await query;
    
    if (!unreadOnly) {
      cache.set(cacheKey, notifications || [], CACHE_TTL.NOTIFICATIONS);
    }
    
    return notifications || [];
    
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return [];
  }
}