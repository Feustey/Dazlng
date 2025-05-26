import { z } from 'zod';

// Types pour les réponses API admin
export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    stats?: {
      total: number;
      filtered?: number;
      period?: string;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters?: Record<string, any>;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Types pour les statistiques enrichies
export interface EnhancedStats {
  users: {
    total: number;
    activeLastMonth: number;
    withSubscriptions: number;
    conversionRate: number;
    growthRate: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    averageOrderValue: number;
  };
  products: {
    daznode: { active: number; total: number; revenue: number };
    dazbox: { active: number; total: number; revenue: number };
    dazpay: { active: number; total: number; revenue: number };
  };
  payments: {
    success: number;
    failed: number;
    pending: number;
    averageAmount: number;
    successRate: number;
  };
  network: {
    totalNodes: number;
    activeNodes: number;
    totalChannels: number;
    totalCapacity: number;
  };
}

// Types pour l'audit des actions admin
export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

// Types pour les notifications admin
export interface AdminNotification {
  id: string;
  admin_id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  action?: {
    type: string;
    entityId: string;
    url?: string;
  };
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  expires_at?: string;
}

// Types pour les analytics email enrichis
export interface EnhancedEmailAnalytics {
  conversionFunnel: {
    stage: string;
    count: number;
    rate: number;
  }[];
  userSegments: {
    segment: string;
    count: number;
    engagement: number;
    averageValue: number;
  }[];
  timeBasedMetrics: {
    period: string;
    metrics: Record<string, number>;
  }[];
  cohortAnalysis: {
    cohort: string;
    retention: number[];
    revenue: number;
  }[];
}

// Types pour les permissions admin
export interface AdminRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  permissions: AdminPermission[];
  created_at: string;
  updated_at: string;
}

export interface AdminPermission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

// Types pour les exports
export interface ExportRequest {
  type: 'users' | 'orders' | 'payments' | 'subscriptions' | 'analytics';
  format: 'csv' | 'xlsx' | 'json';
  filters: Record<string, any>;
  includeFields?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExportJob {
  id: string;
  admin_id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  file_url?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

// Schémas de validation Zod
export const adminFilterSchema = z.object({
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional()
  }).optional(),
  status: z.enum(['all', 'pending', 'active', 'cancelled', 'expired']).optional(),
  searchTerm: z.string().min(1).max(100).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'amount', 'email', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  productType: z.enum(['daznode', 'dazbox', 'dazpay']).optional(),
  paymentMethod: z.string().optional()
});

export const exportRequestSchema = z.object({
  type: z.enum(['users', 'orders', 'payments', 'subscriptions', 'analytics']),
  format: z.enum(['csv', 'xlsx', 'json']),
  filters: z.record(z.any()).optional(),
  includeFields: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional()
});

export const adminActionSchema = z.object({
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  changes: z.record(z.any()).optional(),
  notes: z.string().max(500).optional()
});

export type AdminFilterInput = z.infer<typeof adminFilterSchema>;
export type ExportRequestInput = z.infer<typeof exportRequestSchema>;
export type AdminActionInput = z.infer<typeof adminActionSchema>; 