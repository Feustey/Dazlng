import { getSupabaseAdminClient } from '@/lib/supabase';
import { createDaznoApiOnlyService } from './dazno-api-only';
import { Invoice, CreateInvoiceParams, InvoiceStatus } from '@/types/lightning';
import { PaymentLogger } from './payment-logger';
import { OrderService } from './order-service';
import { Order } from '@/types/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

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

export type PaymentStatus = 'pending' | 'settled' | 'failed' | 'expired';

export interface PaymentServiceResult {
  success: boolean;
  data?: PaymentStatus;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentServiceConfig {
  provider?: 'daznode';
}

export class PaymentService {
  private provider: 'daznode';
  private logger: PaymentLogger | null = null;
  private lightningService = createDaznoApiOnlyService();
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
      const order = await this.orderService?.createOrder(params);
      const orderRef = order.id;

      // Génération de la facture
      const invoice = await this.createInvoice({
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
      const status = await this.lightningService?.checkInvoiceStatus(paymentHash);
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
            await this.logger?.updatePaymentStatus(params.invoice.paymentHash, 'expired');
            params.onExpired();
            return;
          }

          const { status } = await this.checkInvoiceStatus(params.invoice.paymentHash);

          if (status === 'settled') {
            clearInterval(watcher);
            await this.orderService?.markOrderPaid(params.orderId);
            await this.logger?.updatePaymentStatus(params.invoice.paymentHash, 'settled');
            await params.onPaid();
          } else if (status === 'expired') {
            clearInterval(watcher);
            await this.logger?.updatePaymentStatus(params.invoice.paymentHash, 'expired');
            params.onExpired();
          }
        } catch (error) {
          clearInterval(watcher);
          await this.logger?.logPaymentError(params.invoice.paymentHash, error instanceof Error ? error : new Error('Erreur inconnue'));
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
      const invoice = await this.lightningService?.generateInvoice(params);
      await this.logger?.logPayment({
        payment_hash: invoice.paymentHash,
        amount: invoice.amount,
        description: invoice.description,
        status: 'pending',
        metadata: { event: 'invoice_created' }
      });
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

  async checkPayment(paymentHash: string): Promise<PaymentServiceResult> {
    try {
      const status = await this.lightningService?.checkInvoiceStatus(paymentHash);

      await this.logger?.updatePaymentStatus(paymentHash, status.status);

      return {
        success: true,
        data: status.status
      };
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      return {
        success: false,
        error: {
          code: 'PAYMENT_CHECK_ERROR',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        }
      };
    }
  }

  async createPayment(orderId: string, amount: number, description: string): Promise<{ success: boolean; paymentHash?: string; error?: string }> {
    try {
      logger.info('💰 Création paiement', { orderId, amount, provider: this.provider });

      // Créer la facture Lightning
      const invoice = await this.lightningService.generateInvoice({
        amount,
        description,
        metadata: {
          orderId,
          provider: this.provider
        }
      });

      // Logger le paiement
      if (this.logger) {
        await this.logger.logPayment({
          payment_hash: invoice.paymentHash,
          amount,
          description,
          status: 'pending',
          metadata: { orderId, provider: this.provider }
        });
      }

      logger.info('✅ Paiement créé avec succès', { paymentHash: invoice.paymentHash });
      return { success: true, paymentHash: invoice.paymentHash };

    } catch (error) {
      logger.error('❌ Erreur création paiement:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  async checkPaymentStatus(paymentHash: string): Promise<{ status: string; orderId?: string }> {
    try {
      logger.info('🔍 Vérification statut paiement', { paymentHash });

      const status = await this.lightningService.checkInvoiceStatus(paymentHash);
      
      if (status.status === 'settled') {
        // Logger le paiement réussi
        if (this.logger) {
          await this.logger.updatePaymentStatus(paymentHash, 'paid' as any);
        }

        logger.info('✅ Paiement confirmé', { paymentHash });
        return { status: 'paid' };
      }

      return { status: status.status };

    } catch (error) {
      logger.error('❌ Erreur vérification paiement:', error);
      return { status: 'error' };
    }
  }

  async getPaymentHistory(orderId: string): Promise<any[]> {
    try {
      const supabase = getSupabaseAdminClient();
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('❌ Erreur récupération historique paiements:', error);
        return [];
      }

      return payments || [];
    } catch (error) {
      logger.error('❌ Erreur historique paiements:', error);
      return [];
    }
  }
}
