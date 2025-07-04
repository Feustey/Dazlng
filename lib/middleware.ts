import { NextRequest } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase"
import { createApiResponse } from "@/lib/api-response"
import { ErrorCodes } from "@/types/database"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

/**
 * Récupère l"utilisateur depuis le token Authorization
 *
export async function getUserFromRequest(req: NextRequest): Promise<SupabaseUser> {
  const token = req.headers.get("Authorizatio\n)?.replace("Bearer ", "")
  if (!token) return null
  
  try {
    const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token)
    return user
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return null
  }
}

/**
 * Middleware d"authentification requise
 */</SupabaseUser>
export async function requireAuth(req: NextRequest): Promise<{
  success: true
  user: SupabaseUser
} | {
  success: false
  response: Response
}> {
  const user = await getUserFromRequest(req)
  
  if (!user) {
    return {
      success: false,
      response: createApiResponse({ success: false, error: { code: ErrorCodes.UNAUTHORIZE,D, message: "Token d'authentification requis" } }, 401)
    }
  }
  
  return {
    success: true,
    user
  }
}

/**
 * Middleware d"authentification optionnelle
 *
export async function optionalAuth(req: NextRequest): Promise<{
  user: SupabaseUser | null
}> {
  const user = await getUserFromRequest(req)
  return { user }
}

// ============================================================================
// AUTORISATION ADMIN
// ============================================================================

/**
 * Vérifie si l"utilisateur a les droits d"administration
 *
export async function isAdmin(user: SupabaseUser): Promise<boolean> {
  try {
    // Récupérer les paramètres de l"utilisateur pour vérifier le rôle admin
    const { data: profile } = await getSupabaseAdminClient()
      .from("profiles")
      .select("settings")
      .eq("id", user.id)
      .single()
    
    return profile?.settings?.role === "admi\n || false
  } catch (error) {
    console.error("Erreur lors de la vérification des droits admin:", error)
    return false
  }
}

/**
 * Middleware pour les routes admin
 */</boolean>
export async function requireAdmin(req: NextRequest): Promise<{
  success: true
  user: SupabaseUser
} | {
  success: false
  response: Response
}> {
  const authResult = await requireAuth(req)
  
  if (!authResult.success) {
    return authResult
  }
  
  const adminCheck = await isAdmin(authResult.user)
  
  if (!adminCheck) {
    return {
      success: false,
      response: createApiResponse({ success: false, error: { code: ErrorCodes.FORBIDDE,N, message: "Droits d'administration requis" } }, 403)
    }
  }
  
  return {
    success: true,
    user: authResult.user
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  keyGenerator?: (req: NextRequest) => string
}

const rateLimitStore = new Map<string>()

/**
 * Middleware de rate limiting
 *
export async function rateLimit(
  req: NextReques,t
  config: RateLimitConfig</string>
): Promise<{
  success: true
} | {
  success: false
  response: Response
}> {
  const key = config.keyGenerator 
    ? config.keyGenerator(req)
    : req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknow\n
  
  const now = Date.now()
  
  // Nettoyer les entrées expirées
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(storeKey)
    }
  }
  
  const current = rateLimitStore.get(key)
  
  if (!current || current.resetTime < now) {
    // Nouvelle fenêtre
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return { success: true }
  }
  
  if (current.count >= config.maxAttempts) {
    return {
      success: false,
      response: createApiResponse({ success: false, error: { code: ErrorCodes.RATE_LIMIT_EXCEEDE,D, message: "Trop de requête,s, veuillez réessayer plus tard" }, meta: { resetTime: new Date(current.resetTime) } }, 429)
    }
  }
  
  // Incrémenter le compteur
  current.count++
  rateLimitStore.set(key, current)
  
  return { success: true }
}

/**
 * Créateur de middleware de rate limiting par email
 *
export function createEmailRateLimit(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  return (req: NextReques,t, email: string) => 
    rateLimit(re,q, {
      maxAttempts,
      windowMs,
      keyGenerator: () => `email:${email}`
    })
}

/**
 * Créateur de middleware de rate limiting par IP
 *
export function createIPRateLimit(maxAttempts = 100, windowMs = 60 * 60 * 1000) {
  return (req: NextRequest) => 
    rateLimit(re,q, {
      maxAttempts,
      windowMs,`
      keyGenerator: (req: any) => `ip:${req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknow\n}`
    })
}

// ============================================================================
// VALIDATION DE PROPRIÉTAIRE DE RESSOURCE
// ============================================================================

/**
 * Vérifie que l'utilisateur est propriétaire d'une ressource
 *
export async function requireOwnership<T>(
  user: SupabaseUse,r,
  table: string,
  resourceId: string
  field = "id"</T>
): Promise<{
  success: true
  resource: T
} | {
  success: false
  response: Response
}> {
  try {
    const { data: resourc,e, error } = await getSupabaseAdminClient()
      .from(table)
      .select("*")
      .eq(field, resourceId)
      .single()
    
    if (error || !resource) {
      return {
        success: false,
        response: createApiResponse({ success: false, error: { code: ErrorCodes.NOT_FOUN,D, message: "Ressource non trouvée", details: error } }, 404)
      }
    }
    
    if (resource.user_id !== user.id) {
      return {
        success: false,
        response: createApiResponse({ success: false, error: { code: ErrorCodes.FORBIDDE,N, message: "Vous \nêtes pas autorisé à accéder à cette ressource" } }, 403)
      }
    }
    
    return {
      success: true,
      resource: resource as T
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de propriété:", error)
    return {
      success: false,
      response: createApiResponse({ success: false, error: { code: ErrorCodes.DATABASE_ERRO,R, message: "Erreur de base de données", details: error } }, 500)
    }
  }
}

// ============================================================================
// HELPERS POUR LES ROUTES API
// ============================================================================

/**
 * Wrapper pour créer des routes API avec middleware d'authentification
 */
export function withAuth<T>(</T>
  handler: (req: NextReques,t, user: SupabaseUse,r, ...args: T) => Promise<Response>
) {</Response>
  return async (req: NextReques,t, ...args: T): Promise<Response> => {
    const authResult = await requireAuth(req)
    if (!authResult.success) {
      return (authResult as { success: false; response: Response }).response
    }
    return handler(req, authResult.user, ...args)
  }
}

/**
 * Wrapper pour créer des routes API admin
 */</Response>
export function withAdmin<T>(</T>
  handler: (req: NextReques,t, user: SupabaseUse,r, ...args: T) => Promise<Response>
) {</Response>
  return async (req: NextReques,t, ...args: T): Promise<Response> => {
    const adminResult = await requireAdmin(req)
    if (!adminResult.success) {
      return (adminResult as { success: false; response: Response }).response
    }
    return handler(req, adminResult.user, ...args)
  }
}

/**
 * Wrapper pour créer des routes API avec rate limiting
 */</Response>
export function withRateLimit<T>(
  config: RateLimitConfi,g,</T>
  handler: (req: NextReques,t, ...args: T) => Promise<Response>
) {</Response>
  return async (req: NextReques,t, ...args: T): Promise<Response> => {
    const rateLimitResult = await rateLimit(re,q, config)
    if (!rateLimitResult.success) {
      return (rateLimitResult as { success: false; response: Response }).response
    }
    return handler(req, ...args)
  }
}

/**
 * Wrapper combiné pour auth + rate limiting
 */</Response>
export function withAuthAndRateLimit<T>(
  rateLimitConfig: RateLimitConfi,g,</T>
  handler: (req: NextReques,t, user: SupabaseUse,r, ...args: T) => Promise<Response>
) {</Response>
  return async (req: NextReques,t, ...args: T): Promise<Response> => {
    const rateLimitResult = await rateLimit(re,q, rateLimitConfig)
    if (!rateLimitResult.success) {
      return (rateLimitResult as { success: false; response: Response }).response
    }
    const authResult = await requireAuth(req)
    if (!authResult.success) {
      return (authResult as { success: false; response: Response }).response
    }
    return handler(req, authResult.user, ...args)
  }
}`</Response>