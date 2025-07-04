import { z } from "zod"
import { isValidLightningPubkey, isValidEmail, isValidUUID } from "@/types/database"

// ============================================================================
// VALIDATIONS DE BASE
// ============================================================================

export const emailSchema = z.string().email("Email invalide").refine(isValidEmail, {
  message: "Format d'email invalide"
})

export const uuidSchema = z.string().refine(isValidUUID, {
  message: "UUID invalide"
})

export const lightningPubkeySchema = z.string().optional().refine(
  (pubkey: string | undefined) => !pubkey || isValidLightningPubkey(pubkey),
  { message: "Clé publique Lightning invalide (doit faire 66 caractères hexadécimaux)" }
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
  code: z.string().length(6, "Le code doit contenir 6 chiffres").regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres")
})

export const createUserSchema = z.object({
  email: emailSchema,
  prenom: z.string().min(1, "Prénom requis").max(50, "Prénom trop long"),
  nom: z.string().min(1, "Nom requis").max(50, "Nom trop long"),
  pubkey: lightningPubkeySchema,
  tempToken: z.string().min(1, "Token temporaire requis")
})

export const walletTestSchema = z.object({
  walletType: z.enum(["nwc", "lnurl", "algorand"], {
    errorMap: () => ({ message: "Type de wallet non supporté" })
  }),
  connectionString: z.string().min(1, "Chaîne de connexion requise")
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
  product_type: z.enum(["daznode", "dazbox", "dazpay"]),
  customer: z.object({
    email: emailSchema,
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    address: z.string().min(1, "Adresse requise"),
    city: z.string().min(1, "Ville requise"),
    postalCode: z.string().min(1, "Code postal requis"),
    country: z.string().min(1, "Pays requis")
  }),
  product: z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
    priceSats: z.number().positive()
  })
})

export const updateOrderSchema = z.object({
  payment_status: z.enum(["pending", "paid", "failed", "cancelled"]).optional(),
  payment_hash: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

// ============================================================================
// ABONNEMENTS
// ============================================================================

export const createSubscriptionSchema = z.object({
  user_id: uuidSchema,
  plan_id: z.enum(["free", "basic", "premium", "business"], {
    errorMap: () => ({ message: "Plan d'abonnement invalide" })
  }),
  status: z.enum(["active", "inactive", "cancelled", "expired"]).default("active"),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
})

export const updateSubscriptionSchema = z.object({
  plan_id: z.enum(["free", "basic", "premium", "enterprise"]).optional(),
  status: z.enum(["active", "inactive", "cancelled", "expired"]).optional(),
  end_date: z.string().datetime().optional()
})

// ============================================================================
// PAIEMENTS
// ============================================================================

export const createPaymentSchema = z.object({
  order_id: uuidSchema,
  amount: z.number().positive("Le montant doit être positif"),
  status: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  payment_hash: z.string().optional()
})

export const updatePaymentSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  payment_hash: z.string().optional()
})

export const checkPaymentSchema = z.object({
  paymentHash: z.string().min(1, "Hash de paiement requis")
})

// ============================================================================
// LIVRAISONS
// ============================================================================

export const createDeliverySchema = z.object({
  order_id: uuidSchema,
  address: z.string().min(1, "Adresse requise"),
  city: z.string().min(1, "Ville requise"),
  zip_code: z.string().min(1, "Code postal requis"),
  country: z.string().min(1, "Pays requis"),
  shipping_status: z.enum(["pending", "shipped", "delivered", "returned"]).default("pending"),
  tracking_number: z.string().optional()
})

export const updateDeliverySchema = z.object({
  shipping_status: z.enum(["pending", "shipped", "delivered", "returned"]).optional(),
  tracking_number: z.string().optional()
})

// ============================================================================
// LIGHTNING NETWORK
// ============================================================================

export const channelParamsSchema = z.object({
  nodeId: z.string().refine(isValidLightningPubkey, {
    message: "ID de nœud Lightning invalide"
  })
})

export const createChannelSchema = z.object({
  remotePubkey: z.string().refine(isValidLightningPubkey, {
    message: "Clé publique distante invalide"
  }),
  amount: z.number().int().min(20000, "Montant minimum: 20,000 sats").max(16777215, "Montant maximum: 16,777,215 sats"),
  pushAmount: z.number().int().min(0).default(0),
  isPrivate: z.boolean().default(false)
})

export const createInvoiceSchema = z.object({
  amount: z.number().positive("Le montant doit être positif"),
  description: z.string().max(640, "Description trop longue").optional(),
  expiry: z.number().int().positive().optional()
})

// ============================================================================
// CONTACT ET FORMULAIRES
// ============================================================================

export const contactFormSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(50, "Prénom trop long"),
  lastName: z.string().min(1, "Nom requis").max(50, "Nom trop long"),
  email: emailSchema,
  companyName: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  companyPhone: z.string().max(20).optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  interest: z.enum(["daznode", "dazbox", "dazpay", "partnership", "other"], {
    errorMap: () => ({ message: "Intérêt invalide" })
  }),
  message: z.string().min(10, "Message trop court").max(1000, "Message trop long")
})

export const sendEmailSchema = z.object({
  to: emailSchema,
  subject: z.string().min(1, "Sujet requis").max(200, "Sujet trop long"),
  text: z.string().optional(),
  html: z.string().optional()
}).refine((data: any) => data.text || data.html, {
  message: "Le contenu (text ou html) est requis"
})

// ============================================================================
// PROFILS UTILISATEURS AVANCÉS
// ============================================================================

export const profileUpdateSchema = z.object({
  nom: z.string().min(1, "Nom requis").max(50, "Nom trop long").optional(),
  prenom: z.string().min(1, "Prénom requis").max(50, "Prénom trop long").optional(),
  pubkey: lightningPubkeySchema,
  compte_x: z.string().max(100, "Compte X trop long").optional(),
  compte_nostr: z.string().max(100, "Compte Nostr trop long").optional(),
  node_id: z.string().max(100, "ID de nœud trop long").optional(),
  settings: z.record(z.any()).optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(1, "Confirmation du mot de passe requise")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "friends"]),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  dataSharing: z.boolean()
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
// COMPÉTENCES ET EXPÉRIENCES
// ============================================================================

export const skillSchema = z.object({
  name: z.string().min(1, "Nom de compétence requis").max(100, "Nom trop long"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  category: z.string().min(1, "Catégorie requise").max(50, "Catégorie trop longue"),
  description: z.string().max(500, "Description trop longue").optional(),
  yearsOfExperience: z.number().int().min(0).max(50).optional()
})

export const experienceSchema = z.object({
  title: z.string().min(1, "Titre requis").max(100, "Titre trop long"),
  company: z.string().min(1, "Entreprise requise").max(100, "Nom d'entreprise trop long"),
  location: z.string().max(100, "Localisation trop longue").optional(),
  startDate: z.string().datetime("Date de début invalide"),
  endDate: z.string().datetime("Date de fin invalide").optional(),
  current: z.boolean().default(false),
  description: z.string().max(1000, "Description trop longue").optional(),
  skills: z.array(z.string()).optional()
})

export const studiesSchema = z.object({
  degree: z.string().min(1, "Diplôme requis").max(100, "Diplôme trop long"),
  institution: z.string().min(1, "Institution requise").max(100, "Institution trop longue"),
  field: z.string().min(1, "Domaine d'étude requis").max(100, "Domaine trop long"),
  startDate: z.string().datetime("Date de début invalide"),
  endDate: z.string().datetime("Date de fin invalide").optional(),
  current: z.boolean().default(false),
  description: z.string().max(500, "Description trop longue").optional(),
  gpa: z.number().min(0).max(4).optional()
})

export const favoriteSchema = z.object({
  type: z.enum(["company", "project", "technology", "person"]),
  name: z.string().min(1, "Nom requis").max(100, "Nom trop long"),
  description: z.string().max(500, "Description trop longue").optional(),
  url: z.string().url("URL invalide").optional(),
  tags: z.array(z.string()).optional()
})

// ============================================================================
// ADMINISTRATION
// ============================================================================

export const exportRequestSchema = z.object({
  dataType: z.enum(["users", "orders", "payments", "subscriptions"]),
  format: z.enum(["csv", "json", "xlsx"]),
  filters: z.record(z.any()).optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional()
})

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

export function validateUrlParams<T>(schema: z.ZodSchema<T>, params: Record<string, any>): T {
  return schema.parse(params)
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params = Object.fromEntries(searchParams.entries())
  return schema.parse(params)
}