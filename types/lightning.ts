/**
 * Types standardisés pour les paiements Lightning
 */

// Enum unifié pour les statuts de facture
export const INVOICE_STATUS = {
  PENDING: 'pending',
  SETTLED: 'settled',
  EXPIRED: 'expired',
  FAILED: 'failed'
} as const;

export type InvoiceStatus = 'pending' | 'settled' | 'expired' | 'failed';

// Statuts de paiement standardisés
export type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';

// Types pour les services Lightning
export interface Invoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  createdAt: string;
  expiresAt: string;
  settledAt?: string;
}

export interface CreateInvoiceParams {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

// Réponse de statut de facture
export interface InvoiceStatusResponse {
  status: PaymentStatus;
  amount: number;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}

// Configuration pour la surveillance des factures
export interface WatchInvoiceConfig {
  timeout?: number;
  interval?: number;
}

// Interface pour les logs de paiement
export interface PaymentLogEntry {
  id: string;
  payment_hash: string;
  amount: number;
  description: string;
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Interface pour le service Lightning
export interface LightningService {
  createInvoice(params: CreateInvoiceParams): Promise<Invoice>;
  checkInvoice(paymentHash: string): Promise<Invoice>;
  watchInvoice(paymentHash: string, config?: WatchInvoiceConfig): Promise<Invoice>;
  healthCheck(): Promise<HealthCheckResult>;
  close(): Promise<void>;
}

export interface HealthCheckResult {
  isOnline: boolean;
  provider: string;
  nodeInfo?: {
    publicKey: string;
    alias: string;
    channels: number;
    blockHeight: number;
  };
}

// Types spécifiques pour les factures (pour compatibilité)
export type LightningInvoice = Invoice;
export type DazNodeInvoice = Invoice;

// Types pour les paramètres DazNode
export interface DazNodeInvoiceParams {
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
}

// Types pour le statut DazNode
export interface DazNodeInvoiceStatus {
  status: PaymentStatus;
  amount: number;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}

// Types pour les recommandations DazNode
export interface DazNodeRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact: number;
  difficulty: number;
  estimatedTime: number;
  actions: string[];
  metadata?: Record<string, unknown>;
}

// Schéma de validation pour les recommandations
export const recommendationSchema = {
  id: 'string',
  title: 'string',
  description: 'string',
  priority: ['high', 'medium', 'low'],
  category: 'string',
  impact: 'number',
  difficulty: 'number',
  estimatedTime: 'number',
  actions: 'array',
  metadata: 'object'
} as const;