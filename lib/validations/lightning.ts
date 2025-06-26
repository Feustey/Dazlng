import { z } from 'zod';

/**
 * Schémas de validation pour les paiements Lightning
 */

// Validation des montants
const _MIN_AMOUNT = 1;
const _MAX_AMOUNT = 16777215; // Maximum pour un canal Lightning standard

// Validation des statuts
export const paymentStatusSchema = z.enum(['pending', 'settled', 'failed', 'expired'] as const);

// Schéma pour la création d'une facture
export const createInvoiceSchema = z.object({
  amount: z.number().min(1).max(16777215),
  description: z.string().min(1),
  metadata: z.record(z.any()).optional()
});

// Schéma pour la vérification d'une facture
export const checkInvoiceSchema = z.object({
  paymentHash: z.string().min(1)
});

// Schéma pour une facture complète
export const invoiceSchema = z.object({
  id: z.string(),
  paymentRequest: z.string(),
  paymentHash: z.string(),
  amount: z.number(),
  description: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  status: paymentStatusSchema,
  metadata: z.record(z.unknown()).optional()
});

// Schéma pour le statut d'une facture
export const invoiceStatusSchema = z.object({
  status: paymentStatusSchema,
  amount: z.number(),
  settledAt: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});

// Fonction de validation générique
export function validateData<T extends z.ZodType>(
  schema: T, 
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// Types inférés
export type CreateInvoiceRequest = z.infer<typeof createInvoiceSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
};

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface InvoiceExtended {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string;
  settledAt?: string;
  metadata?: Record<string, unknown>;
}
