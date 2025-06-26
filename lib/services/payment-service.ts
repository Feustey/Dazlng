import { createDazNodeLightningService } from './daznode-lightning-service';

export enum InvoiceStatus {
  pending = "pending",
  settled = "settled",
  expired = "expired",
  failed = "failed"
}
import { PaymentLogger } from './payment-logger';
import { OrderService } from './order-service';
import { Order } from '@/types/database';
import { z } from 'zod';

// Schéma de validation pour la création d'une commande
const CreateOrderSchema = z.object({
  product_type: z.enum(['daznode', 'dazbox', 'dazpay']),
  amount: z.number().positive(),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string().optional(),
    plan: z.enum(['basic', 'premium', 'enterprise']).optional()
  }),
  plan: z.enum(['basic', 'premium', 'enterprise']).optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
  metadata: z.record(z.any()).optional()
});

export type CreateOrderParams = z.infer<typeof CreateOrderSchema>;

interface _ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface CreateInvoiceParams {
  amount: number;
  description: string;
  metadata?: Record<string, string | number | boolean>;
  expiry?: number;
}

export interface Invoice {
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  expiresAt: string;
  createdAt: string;
}

type InvoiceStatus = InvoiceStatus.settled | InvoiceStatus.pending | InvoiceStatus.expired | 'error';

export interface WatchInvoiceParams {
  invoice: Invoice;
  checkInterval?: number;
  maxAttempts?: number;
  onPaid: () => Promise<void>;
  onExpired: () => void;
  onError: (error: Error) => void;
  onRenewing: () => void;
  onRenewed: (newInvoice: Invoice) => void;
}

export interface PaymentServiceConfig {
  provider?: 'daznode' | 'lnd';
}

export interface PaymentStatus {
  status: InvoiceStatus.pending | 'paid' | InvoiceStatus.failed | InvoiceStatus.expired;
  settledAt?: string;
  amount?: number;
}

export interface PaymentServiceResult {
  success: boolean;
  data?: PaymentStatus;
  error?: {
    code: string;
    message: string;
  };
}

export class PaymentService {
  private provider: 'daznode' | 'lnd';
  private logger: PaymentLogger | null = null;
  private lightningService = createDazNodeLightningService();
  private orderService = new OrderService();

  constructor(config?: PaymentServiceConfig) {
    this.provider = config?.provider || 'daznode';
    this.logger = new PaymentLogger();
  }

  /**
   * Crée une nouvelle commande et génère une facture Lightning
   */
  async createOrderWithInvoice(params: CreateOrderParams): Promise<{
    order: Order;
    invoice: Invoice;
    orderRef: string;
  }> {
    try {
      // Création de la commande
      const order = await (this ?? Promise.reject(new Error("this is null"))).orderService?.createOrder(params);
      const orderRef = order.id;

      // Génération de la facture
      const invoice = await (this ?? Promise.reject(new Error("this is null"))).createInvoice({
        amount: order.amount,
        description: `${params.product_type.toUpperCase()} - ${params.plan?.toUpperCase() || 'BASIC'} - ${orderRef}`,
        metadata: {
          orderId: orderRef,
          productType: params.product_type,
          plan: params.plan
        }
      });

      return { order, invoice, orderRef };
    } catch (error) {
      console.error('Erreur création commande et facture:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une facture et met à jour la commande si nécessaire
   */
  async checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus> {
    try {
      const status = await (this ?? Promise.reject(new Error("this is null"))).lightningService?.checkInvoiceStatus(paymentHash);
      return status as InvoiceStatus;
    } catch (error) {
      console.error('Erreur vérification facture:', error);
      throw error;
    }
  }

  /**
   * Surveille une facture avec renouvellement automatique
   */
  async watchInvoiceWithRenewal(params: {
    invoice: Invoice;
    orderId: string;
    orderRef: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
    onRenewing: () => void;
    onRenewed: (newInvoice: Invoice) => void;
    checkInterval?: number;
    maxAttempts?: number;
  }): Promise<void> {
    try {
      let attempts = 0;
      const maxAttempts = params.maxAttempts || 120; // 6 minutes
      const checkInterval = params.checkInterval || 3000;

      const watcher = setInterval(async () => {
        try {
          attempts++;

          if (attempts >= maxAttempts) {
            clearInterval(watcher);
            await (this ?? Promise.reject(new Error("this is null"))).logger?.updatePaymentStatus(params.invoice.paymentHash, InvoiceStatus.expired);
            params.onExpired();
            return;
          }

          const { status } = await (this ?? Promise.reject(new Error("this is null"))).checkInvoiceStatus(params.invoice.paymentHash);

          if (status === InvoiceStatus.settled) {
            clearInterval(watcher);
            await (this ?? Promise.reject(new Error("this is null"))).orderService?.markOrderPaid(params.orderId);
            await (this ?? Promise.reject(new Error("this is null"))).logger?.updatePaymentStatus(params.invoice.paymentHash, InvoiceStatus.settled);
            await (params ?? Promise.reject(new Error("params is null"))).onPaid();
          } else if (status === InvoiceStatus.expired) {
            clearInterval(watcher);
            await (this ?? Promise.reject(new Error("this is null"))).logger?.updatePaymentStatus(params.invoice.paymentHash, InvoiceStatus.expired);
            params.onExpired();
          }
        } catch (error) {
          clearInterval(watcher);
          await (this ?? Promise.reject(new Error("this is null"))).logger?.logPaymentError(params.invoice.paymentHash, error instanceof Error ? error : new Error('Erreur inconnue'));
          params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
        }
      }, checkInterval);

    } catch (error) {
      console.error('❌ PaymentService - Erreur surveillance facture:', error);
      throw error;
    }
  }

  async createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      const invoice = await (this ?? Promise.reject(new Error("this is null"))).lightningService?.generateInvoice(params);
      await (this ?? Promise.reject(new Error("this is null"))).logger?.log('invoice_created', invoice);
      return invoice;
    } catch (error) {
      console.error('Erreur création facture:', error);
      throw error;
    }
  }

  async watchInvoice(params: {
    paymentHash: string;
    onPaid: () => void;
    onExpired: () => void;
    onError: (error: Error) => void;
  }): Promise<void> {
    const checkInterval = setInterval(async () => {
      try {
        const { status } = await (this ?? Promise.reject(new Error("this is null"))).checkInvoiceStatus(params.paymentHash);
        
        if (status === InvoiceStatus.settled) {
          clearInterval(checkInterval);
          params.onPaid();
        } else if (status === InvoiceStatus.expired) {
          clearInterval(checkInterval);
          params.onExpired();
        }
      } catch (error) {
        clearInterval(checkInterval);
        params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
      }
    }, 5000); // Vérifier toutes les 5 secondes
  }

  async checkPayment(paymentHash: string): Promise<PaymentServiceResult> {
    try {
      const status = await (this ?? Promise.reject(new Error("this is null"))).lightningService?.checkPaymentStatus(paymentHash);

      await (this ?? Promise.reject(new Error("this is null"))).logger?.updatePaymentStatus(paymentHash, status.status);

      return {
        success: true,
        data: status
      };

    } catch (error) {
      console.error('❌ PaymentService - Erreur vérification:', error);
      return {
        success: false,
        error: {
          code: 'PAYMENT_CHECK_ERROR',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        }
      };
    }
  }
}
