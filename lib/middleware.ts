import { NextRequest } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { createApiResponse } from '@/lib/api-response'
import { ErrorCodes } from '@/types/database'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

/**
 * Récupère l'utilisateur depuis le token Authorization
 */
export async function getUserFromRequest(req: NextRequest): Promise<SupabaseUser | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  try {
    const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token)
    return user
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}

/**
 * Middleware d'authentification requise
 */
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
      response: createApiResponse({ success: false, error: { code: ErrorCodes.UNAUTHORIZED, message: 'Token d\'authentification requis' } }, 401)
    }
  }
  
  return {
    success: true,
    user
  }
}

/**
 * Middleware d'authentification optionnelle
 */
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
 * Vérifie si l'utilisateur a les droits d'administration
 */
export async function isAdmin(user: SupabaseUser): Promise<boolean> {
  try {
    // Récupérer les paramètres de l'utilisateur pour vérifier le rôle admin
    const { data: profile } = await getSupabaseAdminClient()
      .from('profiles')
      .select('settings')
      .eq('id', user.id)
      .single()
    
    return profile?.settings?.role === 'admin' || false
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error)
    return false
  }
}

/**
 * Middleware pour les routes admin
 */
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
      response: createApiResponse({ success: false, error: { code: ErrorCodes.FORBIDDEN, message: 'Droits d\'administration requis' } }, 403)
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

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Middleware de rate limiting
 */
export async function rateLimit(
  req: NextRequest, 
  config: RateLimitConfig
): Promise<{
  success: true
} | {
  success: false
  response: Response
}> {
  const key = config.keyGenerator 
    ? config.keyGenerator(req)
    : req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  
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
      response: createApiResponse({ success: false, error: { code: ErrorCodes.RATE_LIMIT_EXCEEDED, message: 'Trop de requêtes, veuillez réessayer plus tard' }, meta: { resetTime: new Date(current.resetTime) } }, 429)
    }
  }
  
  // Incrémenter le compteur
  current.count++
  rateLimitStore.set(key, current)
  
  return { success: true }
}

/**
 * Créateur de middleware de rate limiting par email
 */
export function createEmailRateLimit(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  return (req: NextRequest, email: string) => 
    rateLimit(req, {
      maxAttempts,
      windowMs,
      keyGenerator: () => `email:${email}`
    })
}

/**
 * Créateur de middleware de rate limiting par IP
 */
export function createIPRateLimit(maxAttempts = 100, windowMs = 60 * 60 * 1000) {
  return (req: NextRequest) => 
    rateLimit(req, {
      maxAttempts,
      windowMs,
      keyGenerator: (req: any) => `ip:${req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'}`
    })
}

// ============================================================================
// VALIDATION DE PROPRIÉTAIRE DE RESSOURCE
// ============================================================================

/**
 * Vérifie que l'utilisateur est propriétaire d'une ressource
 */
export async function requireOwnership<T extends { user_id: string }>(
  user: SupabaseUser,
  table: string,
  resourceId: string,
  field = 'id'
): Promise<{
  success: true
  resource: T
} | {
  success: false
  response: Response
}> {
  try {
    const { data: resource, error } = await getSupabaseAdminClient()
      .from(table)
      .select('*')
      .eq(field, resourceId)
      .single()
    
    if (error || !resource) {
      return {
        success: false,
        response: createApiResponse({ success: false, error: { code: ErrorCodes.NOT_FOUND, message: 'Ressource non trouvée', details: error } }, 404)
      }
    }
    
    if (resource.user_id !== user.id) {
      return {
        success: false,
        response: createApiResponse({ success: false, error: { code: ErrorCodes.FORBIDDEN, message: "Vous n'êtes pas autorisé à accéder à cette ressource" } }, 403)
      }
    }
    
    return {
      success: true,
      resource: resource as T
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de propriété:', error)
    return {
      success: false,
      response: createApiResponse({ success: false, error: { code: ErrorCodes.DATABASE_ERROR, message: 'Erreur de base de données', details: error } }, 500)
    }
  }
}

// ============================================================================
// HELPERS POUR LES ROUTES API
// ============================================================================

/**
 * Wrapper pour créer des routes API avec middleware d'authentification
 */
export function withAuth<T extends any[]>(
  handler: (req: NextRequest, user: SupabaseUser, ...args: T) => Promise<Response>
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const authResult = await requireAuth(req)
    if (!authResult.success) {
      return (authResult as { success: false; response: Response }).response
    }
    return handler(req, authResult.user, ...args)
  }
}

/**
 * Wrapper pour créer des routes API admin
 */
export function withAdmin<T extends any[]>(
  handler: (req: NextRequest, user: SupabaseUser, ...args: T) => Promise<Response>
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const adminResult = await requireAdmin(req)
    if (!adminResult.success) {
      return (adminResult as { success: false; response: Response }).response
    }
    return handler(req, adminResult.user, ...args)
  }
}

/**
 * Wrapper pour créer des routes API avec rate limiting
 */
export function withRateLimit<T extends any[]>(
  config: RateLimitConfig,
  handler: (req: NextRequest, ...args: T) => Promise<Response>
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const rateLimitResult = await rateLimit(req, config)
    if (!rateLimitResult.success) {
      return (rateLimitResult as { success: false; response: Response }).response
    }
    return handler(req, ...args)
  }
}

/**
 * Wrapper combiné pour auth + rate limiting
 */
export function withAuthAndRateLimit<T extends any[]>(
  rateLimitConfig: RateLimitConfig,
  handler: (req: NextRequest, user: SupabaseUser, ...args: T) => Promise<Response>
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const rateLimitResult = await rateLimit(req, rateLimitConfig)
    if (!rateLimitResult.success) {
      return (rateLimitResult as { success: false; response: Response }).response
    }
    const authResult = await requireAuth(req)
    if (!authResult.success) {
      return (authResult as { success: false; response: Response }).response
    }
    return handler(req, authResult.user, ...args)
  }
}
