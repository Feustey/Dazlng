import { LightningService } from './lightning-service';
import { PaymentLogger } from './payment-logger';
import { OrderService } from './order-service';
import { InvoiceStatus, CreateInvoiceParams, Invoice } from '@/types/lightning';
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export class PaymentService {
  private lightningService: LightningService;
  private logger: PaymentLogger;
  private orderService: OrderService;

  constructor() {
    this.lightningService = new LightningService();
    this.logger = new PaymentLogger();
    this.orderService = new OrderService();
  }

  /**
   * Crée une nouvelle commande et génère une facture Lightning
   */
  async createOrderWithInvoice(params: CreateOrderParams): Promise<{
    order: Order;
    invoice: {
      paymentRequest: string;
      paymentHash: string;
      amount: number;
    };
    orderRef: string;
  }> {
    try {
      // 1. Validation des données
      const validatedParams = CreateOrderSchema.parse(params);

      // 2. Création de la commande
      const order = await this.orderService.createOrder(validatedParams);

      // 3. Génération d'une référence unique pour le support
      const orderRef = `${order.id.substring(0, 8)}-${Date.now().toString(36)}`;

      // 4. Génération de la facture
      const invoice = await this.lightningService.generateInvoice({
        amount: order.amount,
        description: `${validatedParams.product_type.toUpperCase()} - ${validatedParams.plan?.toUpperCase() || 'BASIC'} - ${orderRef}`,
        metadata: { 
          order_id: order.id, 
          order_ref: orderRef,
          ...validatedParams.metadata 
        }
      });

      // 5. Mise à jour de la commande avec les informations de paiement
      await this.orderService.updateOrder(order.id, {
        payment_hash: invoice.paymentHash,
        payment_request: invoice.paymentRequest,
        order_ref: orderRef
      });

      // 6. Log du paiement
      await this.logger.logPayment({
        order_id: order.id,
        order_ref: orderRef,
        payment_hash: invoice.paymentHash,
        payment_request: invoice.paymentRequest,
        amount: invoice.amount,
        status: 'pending',
        metadata: validatedParams.metadata
      });

      return {
        order,
        invoice,
        orderRef
      };
    } catch (error) {
      console.error('❌ PaymentService - Erreur création commande:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une facture et met à jour la commande si nécessaire
   */
  async checkInvoiceStatus(paymentHash: string): Promise<{ status: InvoiceStatus }> {
    try {
      const response = await fetch('/api/lightning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checkInvoice',
          params: { paymentHash }
        })
      });

      if (!response.ok) {
        throw new Error('Erreur vérification facture');
      }

      const { data } = await response.json() as ApiResponse<{ status: InvoiceStatus }>;
      return data;
    } catch (error) {
      console.error('Erreur vérification facture:', error);
      throw error;
    }
  }

  /**
   * Surveille une facture avec renouvellement automatique
   */
  async watchInvoiceWithRenewal(params: {
    invoice: {
      paymentRequest: string;
      paymentHash: string;
      amount: number;
    };
    orderId: string;
    orderRef: string;
    onPaid: () => Promise<void>;
    onExpired: () => void;
    onError: (error: Error) => void;
    onRenewing: () => void;
    onRenewed: (newInvoice: { paymentRequest: string; paymentHash: string; amount: number; }) => void;
    checkInterval?: number;
    maxAttempts?: number;
  }): Promise<void> {
    try {
      await this.lightningService.watchInvoiceWithRenewal(params.invoice, {
        checkInterval: params.checkInterval || 3000,
        maxAttempts: params.maxAttempts || 240,
        onPaid: async () => {
          await this.orderService.markOrderPaid(params.orderId);
          await this.logger.updatePaymentStatus(params.invoice.paymentHash, 'settled');
          await params.onPaid();
        },
        onExpired: () => {
          this.logger.updatePaymentStatus(params.invoice.paymentHash, 'expired');
          params.onExpired();
        },
        onError: (error) => {
          this.logger.logPaymentError(params.invoice.paymentHash, error);
          params.onError(error);
        },
        onRenewing: params.onRenewing,
        onRenewed: async (newInvoice) => {
          await this.orderService.updateOrder(params.orderId, {
            payment_hash: newInvoice.paymentHash,
            payment_request: newInvoice.paymentRequest
          });
          await this.logger.logPayment({
            order_id: params.orderId,
            order_ref: params.orderRef,
            payment_hash: newInvoice.paymentHash,
            payment_request: newInvoice.paymentRequest,
            amount: newInvoice.amount,
            status: 'pending'
          });
          params.onRenewed(newInvoice);
        }
      });
    } catch (error) {
      console.error('❌ PaymentService - Erreur surveillance facture:', error);
      throw error;
    }
  }

  async generateInvoice(params: CreateInvoiceParams): Promise<Invoice> {
    try {
      const response = await fetch('/api/lightning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateInvoice',
          params: {
            amount: params.amount,
            description: params.description,
            expires_at: params.expires_at
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erreur génération facture');
      }

      const { data } = await response.json() as ApiResponse<Invoice>;
      return data;
    } catch (error) {
      console.error('Erreur génération facture:', error);
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
        const { status } = await this.checkInvoiceStatus(params.paymentHash);
        
        if (status === 'settled') {
          clearInterval(checkInterval);
          params.onPaid();
        } else if (status === 'expired') {
          clearInterval(checkInterval);
          params.onExpired();
        }
      } catch (error) {
        clearInterval(checkInterval);
        params.onError(error instanceof Error ? error : new Error('Erreur inconnue'));
      }
    }, 5000); // Vérifier toutes les 5 secondes
  }
} 