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

export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

// Statuts de paiement standardisés
export type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';

// Interface de base pour une facture
export interface Invoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  createdAt: string;
  expiresAt: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
}

// Paramètres pour la création d'une facture
export interface CreateInvoiceParams {
  amount: number;
  description: string;
  expiry?: number; // En secondes
  metadata?: Record<string, unknown>;
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
  checkInterval?: number; // En millisecondes
  maxAttempts?: number;
  autoRenew?: boolean;
  onPaid?: () => Promise<void>;
  onExpired?: () => void;
  onError?: (error: Error) => void;
  onRenewing?: () => void;
  onRenewed?: (newInvoice: Invoice) => void;
}

// Interface pour les logs de paiement
export interface PaymentLogEntry {
  payment_hash: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  error?: string;
  metadata?: Record<string, unknown>;
  order_id?: string; // Ajout pour compatibilité
}

// Interface pour le service Lightning
export interface LightningService {
  generateInvoice(params: CreateInvoiceParams): Promise<Invoice>;
  checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatusResponse>;
  watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void>;
  healthCheck(): Promise<{ isOnline: boolean; provider: string }>;
  createInvoice(params: { amount: number; description: string }): Promise<{ payment_hash: string }>;
  checkPayment(paymentHash: string): Promise<boolean>;
  close?(): Promise<void>;
}

// Types spécifiques pour les factures (pour compatibilité)
export type { Invoice as LightningInvoice };
export type { Invoice as DazNodeInvoice };

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