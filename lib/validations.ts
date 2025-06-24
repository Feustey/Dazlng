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
  product_type: z.enum(['daznode', 'dazbox', 'dazpay']),
  customer: z.object({
    email: emailSchema,
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    address: z.string().min(1, 'Adresse requise'),
    city: z.string().min(1, 'Ville requise'),
    postalCode: z.string().min(1, 'Code postal requis'),
    country: z.string().min(1, 'Pays requis')
  }),
  product: z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
    priceSats: z.number().positive()
  })
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
// PROFILS UTILISATEURS AVANCÉS
// ============================================================================

export const profileUpdateSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis").max(50, "Le prénom est trop long").optional(),
  lastname: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long").optional(),
  email: z.string().email("Format d'email invalide").optional(),
  phone: z.string().regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Numéro de téléphone invalide").optional(),
  preferences: z.object({
    notifications: z.boolean().optional(),
    privacy: z.enum(["public", "private", "friends"]).optional(),
    language: z.enum(["fr", "en"]).optional(),
    timezone: z.string().optional()
  }).optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['linkedin', 'github', 'twitter', 'website']),
    url: z.string().url("URL invalide"),
    isPublic: z.boolean().optional(),
    displayName: z.string().optional()
  })).optional()
})

export const studiesSchema = z.object({
  program: z.string().min(1, "Le programme est requis").max(100, "Le programme est trop long"),
  school: z.string().min(1, "L'école est requise").max(100, "L'école est trop longue"),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear() + 10, "Année de diplôme invalide"),
  specialization: z.string().max(200, "La spécialisation est trop longue").optional(),
  degree: z.string().max(100, "Le diplôme est trop long").optional(),
  gpa: z.number().min(0).max(4).optional(),
  achievements: z.array(z.string()).optional()
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "friends"], {
    errorMap: () => ({ message: "Visibilité du profil invalide" })
  }),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showWallet: z.boolean(),
  allowMessages: z.boolean(),
  showOnlineStatus: z.boolean(),
  showLastSeen: z.boolean(),
  allowServiceRequests: z.boolean(),
  allowNotifications: z.boolean()
})

export const notificationSettingsSchema = z.object({
  email: z.object({
    newMessages: z.boolean(),
    serviceBookings: z.boolean(),
    paymentConfirmations: z.boolean(),
    systemUpdates: z.boolean(),
    marketing: z.boolean(),
    weeklyDigest: z.boolean()
  }),
  push: z.object({
    newMessages: z.boolean(),
    serviceBookings: z.boolean(),
    paymentConfirmations: z.boolean(),
    systemUpdates: z.boolean()
  }),
  inApp: z.object({
    newMessages: z.boolean(),
    serviceBookings: z.boolean(),
    paymentConfirmations: z.boolean(),
    systemUpdates: z.boolean(),
    achievements: z.boolean(),
    recommendations: z.boolean()
  })
})

// ============================================================================
// EXPÉRIENCES PROFESSIONNELLES
// ============================================================================

export const experienceSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre est trop long"),
  company: z.string().min(1, "L'entreprise est requise").max(100, "L'entreprise est trop longue"),
  role: z.string().min(1, "Le rôle est requis").max(100, "Le rôle est trop long"),
  city: z.string().min(1, "La ville est requise").max(50, "La ville est trop longue"),
  country: z.string().min(1, "Le pays est requis").max(50, "Le pays est trop long"),
  industry: z.string().max(100, "Le secteur est trop long").optional(),
  from: z.string().datetime("Date de début invalide"),
  to: z.string().datetime("Date de fin invalide").optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000, "La description est trop longue").optional()
})

// ============================================================================
// COMPÉTENCES
// ============================================================================

export const skillSchema = z.object({
  name: z.string().min(1, "Le nom de la compétence est requis").max(100, "Le nom est trop long"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    errorMap: () => ({ message: "Niveau de compétence invalide" })
  }),
  category: z.string().min(1, "La catégorie est requise").max(50, "La catégorie est trop longue"),
  description: z.string().max(500, "La description est trop longue").optional()
})

// ============================================================================
// FAVORIS
// ============================================================================

export const favoriteSchema = z.object({
  type: z.enum(["service", "provider", "benefit"], {
    errorMap: () => ({ message: "Type de favori invalide" })
  }),
  itemId: z.string().min(1, "ID de l'élément requis"),
  notes: z.string().max(500, "Les notes sont trop longues").optional()
})

// ============================================================================
// CHANGEMENT DE MOT DE PASSE
// ============================================================================

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  confirmPassword: z.string().min(1, "Confirmation du mot de passe requise")
}).refine((data: any) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
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
