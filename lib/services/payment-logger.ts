import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { InvoiceStatus } from '@/types/lightning';

interface PaymentLogEntry {
  order_id: string;
  order_ref: string;
  payment_hash: string;
  payment_request: string;
  amount: number;
  status: InvoiceStatus;
  error?: string;
  metadata?: Record<string, any>;
}

export class PaymentLogger {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Enregistre un nouveau paiement
   */
  async logPayment(entry: PaymentLogEntry): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('payment_logs')
        .insert({
          order_id: entry.order_id,
          order_ref: entry.order_ref,
          payment_hash: entry.payment_hash,
          payment_request: entry.payment_request,
          amount: entry.amount,
          status: entry.status,
          error: entry.error,
          metadata: entry.metadata,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('❌ PaymentLogger - Erreur enregistrement paiement:', error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'un paiement
   */
  async updatePaymentStatus(paymentHash: string, status: InvoiceStatus): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('payment_logs')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('payment_hash', paymentHash);

      if (error) throw error;
    } catch (error) {
      console.error('❌ PaymentLogger - Erreur mise à jour statut:', error);
      throw error;
    }
  }

  /**
   * Enregistre une erreur de paiement
   */
  async logPaymentError(paymentHash: string, error: Error): Promise<void> {
    try {
      const { error: dbError } = await this.supabase
        .from('payment_logs')
        .update({
          status: 'error',
          error: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('payment_hash', paymentHash);

      if (dbError) throw dbError;
    } catch (err) {
      console.error('❌ PaymentLogger - Erreur enregistrement erreur:', err);
      throw err;
    }
  }

  /**
   * Récupère l'historique des paiements d'une commande
   */
  async getOrderPaymentHistory(orderId: string): Promise<PaymentLogEntry[]> {
    try {
      const { data: logs, error } = await this.supabase
        .from('payment_logs')
        .select()
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return logs || [];
    } catch (error) {
      console.error('❌ PaymentLogger - Erreur récupération historique:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques de paiement
   */
  async getPaymentStats(): Promise<{
    total: number;
    success: number;
    failed: number;
    pending: number;
  }> {
    try {
      const { data: logs, error } = await this.supabase
        .from('payment_logs')
        .select('status');

      if (error) throw error;

      const stats = {
        total: logs?.length || 0,
        success: logs?.filter(log => log.status === 'settled').length || 0,
        failed: logs?.filter(log => log.status === 'error').length || 0,
        pending: logs?.filter(log => log.status === 'pending').length || 0
      };

      return stats;
    } catch (error) {
      console.error('❌ PaymentLogger - Erreur récupération statistiques:', error);
      throw error;
    }
  }
} 