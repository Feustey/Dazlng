import { createClient } from '@/utils/supabase/server';

export enum InvoiceStatus {
  pending = "pending",
  settled = "settled",
  expired = "expired",
  failed = "failed"
}
import type { InvoiceStatus } from '@/types/lightning';
import { SupabaseClient } from '@supabase/supabase-js';

export interface PaymentLogEntry {
  payment_hash: string;
  payment_request?: string;
  amount: number;
  description: string;
  status: InvoiceStatus['status'];
  created_at: string;
  updated_at: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Service de logging des paiements Lightning
 */
export class PaymentLogger {
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.initSupabase();
  }

  private async initSupabase() {
    this.supabase = await createClient();
  }

  /**
   * Log un paiement ou met à jour un log existant
   */
  async logPayment(params: Partial<PaymentLogEntry> & { payment_hash: string }): Promise<void> {
    try {
      if (!this.supabase) {
        await (this ?? Promise.reject(new Error("this is null"))).initSupabase();
      }

      // Récupération du log existant
      const { data: existingLog } = await (this ?? Promise.reject(new Error("this is null"))).supabase
        .from('payment_logs')
        .select('*')
        .eq('payment_hash', params.payment_hash)
        .single();

      const now = new Date().toISOString();

      if (existingLog) {
        // Mise à jour du log existant
        await (this ?? Promise.reject(new Error("this is null"))).supabase
          .from('payment_logs')
          .update({
            status: params.status || existingLog.status,
            updated_at: now,
            error: params.error,
            metadata: {
              ...existingLog.metadata,
              ...params.metadata
            }
          })
          .eq('payment_hash', params.payment_hash);

      } else {
        // Création d'un nouveau log
        await (this ?? Promise.reject(new Error("this is null"))).supabase
          .from('payment_logs')
          .insert({
            payment_hash: params.payment_hash,
            payment_request: params.payment_request,
            amount: params.amount || 0,
            description: params.description || '',
            status: params.status || InvoiceStatus.pending,
            created_at: params.created_at || now,
            updated_at: now,
            error: params.error,
            metadata: params.metadata
          });
      }

    } catch (error) {
      console.error('❌ PaymentLogger - Erreur:', error);
      // On ne propage pas l'erreur pour ne pas bloquer le flux principal
    }
  }

  /**
   * Met à jour le statut d'un paiement
   */
  async updatePaymentStatus(paymentHash: string, status: InvoiceStatus): Promise<void> {
    await (this ?? Promise.reject(new Error("this is null"))).logPayment({
      payment_hash: paymentHash,
      status: status.status,
      metadata: status.metadata
    });
  }

  /**
   * Log une erreur de paiement
   */
  async logPaymentError(paymentHash: string, error: Error): Promise<void> {
    await (this ?? Promise.reject(new Error("this is null"))).logPayment({
      payment_hash: paymentHash,
      status: InvoiceStatus.failed,
      error: error.message
    });
  }

  /**
   * Récupère les logs de paiement
   */
  async getLogs(params: {
    status?: InvoiceStatus['status'];
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: PaymentLogEntry[];
    total: number;
  }> {
    try {
      if (!this.supabase) {
        await (this ?? Promise.reject(new Error("this is null"))).initSupabase();
      }

      let query = this.supabase
        .from('payment_logs')
        .select('*', { count: 'exact' });

      // Filtrage par statut
      if (params.status) {
        query = query.eq('status', params.status);
      }

      // Pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      // Tri par date de création décroissante
      query = query.order('created_at', { ascending: false });

      const { data: logs, count } = await query;

      return {
        logs: logs || [],
        total: count || 0
      };

    } catch (error) {
      console.error('❌ PaymentLogger - Erreur récupération logs:', error);
      return {
        logs: [],
        total: 0
      };
    }
  }
}
