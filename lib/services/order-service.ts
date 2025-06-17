import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { z } from 'zod';
import { PaymentService } from './payment-service';

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

export class OrderService {
  private supabase;
  private paymentService;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.paymentService = new PaymentService();
  }

  /**
   * Crée une nouvelle commande
   */
  async createOrder(params: CreateOrderParams) {
    try {
      // 1. Validation des données
      const validatedParams = CreateOrderSchema.parse(params);

      // 2. Création de la commande dans la base de données
      const { data: order, error } = await this.supabase
        .from('orders')
        .insert({
          product_type: validatedParams.product_type,
          amount: validatedParams.amount,
          payment_method: 'lightning',
          payment_status: 'pending',
          metadata: {
            customer: validatedParams.customer,
            plan: validatedParams.plan,
            billing_cycle: validatedParams.billing_cycle,
            ...validatedParams.metadata
          }
        })
        .select()
        .single();

      if (error) throw error;
      if (!order) throw new Error('Erreur lors de la création de la commande');

      return order;
    } catch (error) {
      console.error('❌ OrderService - Erreur création commande:', error);
      throw error;
    }
  }

  /**
   * Met à jour une commande
   */
  async updateOrder(orderId: string, updates: Partial<Database['public']['Tables']['orders']['Update']>) {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      if (!order) throw new Error('Commande non trouvée');

      return order;
    } catch (error) {
      console.error('❌ OrderService - Erreur mise à jour commande:', error);
      throw error;
    }
  }

  /**
   * Marque une commande comme payée
   */
  async markOrderPaid(orderId: string) {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      if (!order) throw new Error('Commande non trouvée');

      return order;
    } catch (error) {
      console.error('❌ OrderService - Erreur marquage commande payée:', error);
      throw error;
    }
  }

  /**
   * Récupère une commande par son ID
   */
  async getOrder(orderId: string) {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .select()
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return order;
    } catch (error) {
      console.error('❌ OrderService - Erreur récupération commande:', error);
      throw error;
    }
  }

  /**
   * Récupère une commande par son hash de paiement
   */
  async getOrderByPaymentHash(paymentHash: string) {
    try {
      const { data: order, error } = await this.supabase
        .from('orders')
        .select()
        .eq('payment_hash', paymentHash)
        .single();

      if (error) throw error;
      return order;
    } catch (error) {
      console.error('❌ OrderService - Erreur récupération commande par hash:', error);
      throw error;
    }
  }

  /**
   * Récupère les commandes d'un utilisateur
   */
  async getUserOrders(userId: string) {
    try {
      const { data: orders, error } = await this.supabase
        .from('orders')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return orders;
    } catch (error) {
      console.error('❌ OrderService - Erreur récupération commandes utilisateur:', error);
      throw error;
    }
  }
} 