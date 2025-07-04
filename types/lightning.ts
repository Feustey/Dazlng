// Types pour le système Lightning simplifié utilisant api.dazno.de

export interface LightningService {
  generateInvoice(params: CreateInvoiceParams): Promise<Invoice>;
  checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus>;
  healthCheck(): Promise<{ isOnline: boolean; provider: string }>;
  watchInvoice(params: {
    paymentHash: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void>;
}

export interface CreateInvoiceParams {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
  expiry?: number;
}

export interface Invoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  description: string;
  status: 'pending' | 'settled' | 'expired';
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, any>;
}

export interface InvoiceStatus {
  status: 'pending' | 'settled' | 'expired';
  amount?: number;
  settledAt?: string;
  metadata?: Record<string, any>;
}

export type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';