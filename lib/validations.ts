import { z } from 'zod'
import { isValidLightningPubkey, isValidEmail, isValidUUID } from '@/types/database'

// ============================================================================
// VALIDATIONS DE BASE
// ============================================================================

export const emailSchema = z.string().email('Email invalide').refine(isValidEmail, {
  message: 'Format d\'email invalide'
})

export const uuidSchema = z.string().refine(isValidUUID, {
  message: 'UUID invalide'
})

export const lightningPubkeySchema = z.string().optional().refine(
  (pubkey: string | undefined) => !pubkey || isValidLightningPubkey(pubkey),
  { message: 'Clé publique Lightning invalide (doit faire 66 caractères hexadécimaux)' }
)

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  filter: z.record(z.any()).optional()
})

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

export const sendCodeSchema = z.object({
  email: emailSchema,
  name: z.string().min(1).optional(),
  pubkey: lightningPubkeySchema
})

export const verifyCodeSchema = z.object({
  email: emailSchema,
  code: z.string().length(6, 'Le code doit contenir 6 chiffres').regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres')
})

export const createUserSchema = z.object({
  email: emailSchema,
  prenom: z.string().min(1, 'Prénom requis').max(50, 'Prénom trop long'),
  nom: z.string().min(1, 'Nom requis').max(50, 'Nom trop long'),
  pubkey: lightningPubkeySchema,
  tempToken: z.string().min(1, 'Token temporaire requis')
})

export const walletTestSchema = z.object({
  walletType: z.enum(['nwc', 'lnurl', 'algorand'], {
    errorMap: () => ({ message: 'Type de wallet non supporté' })
  }),
  connectionString: z.string().min(1, 'Chaîne de connexion requise')
})

// ============================================================================
// PROFILS UTILISATEURS
// ============================================================================

export const updateProfileSchema = z.object({
  nom: z.string().min(1).max(50).optional(),
  prenom: z.string().min(1).max(50).optional(),
  pubkey: lightningPubkeySchema,
  compte_x: z.string().max(100).optional(),
  compte_nostr: z.string().max(100).optional(),
  node_id: z.string().max(100).optional(),
  settings: z.record(z.any()).optional()
})

// ============================================================================
// COMMANDES
// ============================================================================

export const createOrderSchema = z.object({
  user_id: uuidSchema.optional(),
  product_type: z.enum(['daznode', 'dazbox', 'dazpay'], {
    errorMap: () => ({ message: 'Type de produit invalide' })
  }),
  plan: z.string().optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
  amount: z.number().positive('Le montant doit être positif'),
  payment_method: z.string().min(1, 'Méthode de paiement requise'),
  customer: z.object({
    email: emailSchema,
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    address: z.string().min(1, 'Adresse requise'),
    city: z.string().min(1, 'Ville requise'),
    postalCode: z.string().min(1, 'Code postal requis'),
    country: z.string().min(1, 'Pays requis'),
    pubkey: lightningPubkeySchema
  }),
  product: z.object({
    name: z.string().min(1, 'Nom du produit requis'),
    quantity: z.number().int().positive('La quantité doit être positive'),
    priceSats: z.number().positive('Le prix en sats doit être positif')
  }),
  metadata: z.record(z.any()).optional()
})

export const updateOrderSchema = z.object({
  payment_status: z.enum(['pending', 'paid', 'failed', 'cancelled']).optional(),
  payment_hash: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// ============================================================================
// ABONNEMENTS
// ============================================================================

export const createSubscriptionSchema = z.object({
  user_id: uuidSchema,
  plan_id: z.enum(['free', 'basic', 'premium', 'business'], {
    errorMap: () => ({ message: 'Plan d\'abonnement invalide' })
  }),
  status: z.enum(['active', 'inactive', 'cancelled', 'expired']).default('active'),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
})

export const updateSubscriptionSchema = z.object({
  plan_id: z.enum(['free', 'basic', 'premium', 'enterprise']).optional(),
  status: z.enum(['active', 'inactive', 'cancelled', 'expired']).optional(),
  end_date: z.string().datetime().optional()
})

// ============================================================================
// PAIEMENTS
// ============================================================================

export const createPaymentSchema = z.object({
  order_id: uuidSchema,
  amount: z.number().positive('Le montant doit être positif'),
  status: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
  payment_hash: z.string().optional()
})

export const updatePaymentSchema = z.object({
  status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  payment_hash: z.string().optional()
})

export const checkPaymentSchema = z.object({
  paymentHash: z.string().min(1, 'Hash de paiement requis')
})

// ============================================================================
// LIVRAISONS
// ============================================================================

export const createDeliverySchema = z.object({
  order_id: uuidSchema,
  address: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  zip_code: z.string().min(1, 'Code postal requis'),
  country: z.string().min(1, 'Pays requis'),
  shipping_status: z.enum(['pending', 'shipped', 'delivered', 'returned']).default('pending'),
  tracking_number: z.string().optional()
})

export const updateDeliverySchema = z.object({
  shipping_status: z.enum(['pending', 'shipped', 'delivered', 'returned']).optional(),
  tracking_number: z.string().optional()
})

// ============================================================================
// LIGHTNING NETWORK
// ============================================================================

export const channelParamsSchema = z.object({
  nodeId: z.string().refine(isValidLightningPubkey, {
    message: 'ID de nœud Lightning invalide'
  })
})

export const createChannelSchema = z.object({
  remotePubkey: z.string().refine(isValidLightningPubkey, {
    message: 'Clé publique distante invalide'
  }),
  amount: z.number().int().min(20000, 'Montant minimum: 20,000 sats').max(16777215, 'Montant maximum: 16,777,215 sats'),
  pushAmount: z.number().int().min(0).default(0),
  isPrivate: z.boolean().default(false)
})

export const createInvoiceSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  description: z.string().max(640, 'Description trop longue').optional(),
  expiry: z.number().int().positive().optional()
})

// ============================================================================
// CONTACT ET FORMULAIRES
// ============================================================================

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis').max(50, 'Prénom trop long'),
  lastName: z.string().min(1, 'Nom requis').max(50, 'Nom trop long'),
  email: emailSchema,
  companyName: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  companyPhone: z.string().max(20).optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  interest: z.enum(['daznode', 'dazbox', 'dazpay', 'partnership', 'other'], {
    errorMap: () => ({ message: 'Intérêt invalide' })
  }),
  message: z.string().min(10, 'Message trop court').max(1000, 'Message trop long')
})

export const sendEmailSchema = z.object({
  to: emailSchema,
  subject: z.string().min(1, 'Sujet requis').max(200, 'Sujet trop long'),
  text: z.string().optional(),
  html: z.string().optional()
}).refine((data: any) => data.text || data.html, {
  message: 'Le contenu (text ou html) est requis'
})

// ============================================================================
// ADMINISTRATION
// ============================================================================

export const adminQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().default('created_at:desc'),
  status: z.string().optional(),
  search: z.string().optional()
})

// ============================================================================
// PROSPECTS
// ============================================================================

export const createProspectSchema = z.object({
  email: emailSchema,
  pubkey: lightningPubkeySchema,
  chaos: z.string().optional(),
  source: z.string().min(1, 'Source requise'),
  prospect: z.boolean().default(true)
})

// ============================================================================
// UTILITAIRES DE VALIDATION
// ============================================================================

/**
 * Valide les données avec un schéma Zod et retourne une erreur formatée si nécessaire
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  error: {
    message: string
    details: z.ZodError['errors']
  }
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Données invalides',
          details: error.errors
        }
      }
    }
    throw error
  }
}

/**
 * Middleware pour valider les paramètres d'URL
 */
export function validateUrlParams<T>(schema: z.ZodSchema<T>, params: Record<string, string>): T {
  return schema.parse(params)
}

/**
 * Middleware pour valider les query parameters
 */
export function validateQueryParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params: Record<string, any> = {}
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value
  }
  
  return schema.parse(params)
} 