export interface LightningInvoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  description: string;
  expiresAt: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface DazNodeInvoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  description: string;
  expiresAt: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export type InvoiceStatus = 'pending' | 'settled' | 'expired' | 'failed';

export interface CreateInvoiceParams {
  amount: number;
  description: string;
  expiry?: number;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  createdAt: string;
  expiresAt: string;
  status: InvoiceStatus;
}

export interface WatchInvoiceConfig {
  checkInterval?: number;
  maxAttempts?: number;
  autoRenew?: boolean;
  onPaid?: () => Promise<void>;
  onExpired?: () => void;
  onError?: (error: Error) => void;
  onRenewing?: () => void;
  onRenewed?: (newInvoice: LightningInvoice) => void;
}

export interface PaymentLogEntry {
  payment_hash: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
  error?: string;
} 