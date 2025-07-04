import { z } from 'zod';

// Schéma pour la création de facture
export const createInvoiceSchema = z.object({
  amount: z.number().min(1).max(16777215), // 1 sat à 16.7M sats
  description: z.string().min(1).max(1000),
  metadata: z.record(z.any()).optional(),
  expiry: z.number().min(60).max(86400).optional() // 1 minute à 24 heures
});

// Schéma pour la vérification de facture
export const checkInvoiceSchema = z.object({
  paymentHash: z.string().min(1)
});

// Types exportés
export type CreateInvoiceParams = z.infer<typeof createInvoiceSchema>;
export type CheckInvoiceParams = z.infer<typeof checkInvoiceSchema>;

// Fonction de validation générique
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}