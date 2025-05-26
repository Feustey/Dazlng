import { NextResponse } from 'next/server'
import { ApiResponse, ErrorCode, ErrorCodes } from '@/types/database'

/**
 * Utilitaire pour créer des réponses API standardisées
 */
export class ApiResponseBuilder<T = any> {
  private response: ApiResponse<T> = {
    success: false,
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  }

  /**
   * Marque la réponse comme réussie avec des données
   */
  success(data: T): this {
    this.response.success = true
    this.response.data = data
    delete this.response.error
    return this
  }

  /**
   * Marque la réponse comme échouée avec une erreur
   */
  error(code: ErrorCode, message: string, details?: any): this {
    this.response.success = false
    this.response.error = {
      code,
      message,
      details
    }
    delete this.response.data
    return this
  }

  /**
   * Ajoute des métadonnées de pagination
   */
  pagination(total: number, page: number, limit: number): this {
    if (!this.response.meta) {
      this.response.meta = {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }
    this.response.meta.pagination = { total, page, limit }
    return this
  }

  /**
   * Ajoute des métadonnées personnalisées
   */
  metadata(meta: Record<string, any>): this {
    this.response.meta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...this.response.meta,
      ...meta
    }
    return this
  }

  /**
   * Construit la réponse NextResponse avec le bon code de statut
   */
  build(statusCode?: number): NextResponse {
    let status = statusCode

    if (!status) {
      if (this.response.success) {
        status = 200
      } else if (this.response.error) {
        switch (this.response.error.code) {
          case ErrorCodes.BAD_REQUEST:
          case ErrorCodes.VALIDATION_ERROR:
            status = 400
            break
          case ErrorCodes.UNAUTHORIZED:
            status = 401
            break
          case ErrorCodes.FORBIDDEN:
            status = 403
            break
          case ErrorCodes.NOT_FOUND:
            status = 404
            break
          case ErrorCodes.RATE_LIMIT_EXCEEDED:
            status = 429
            break
          case ErrorCodes.INTERNAL_ERROR:
          case ErrorCodes.DATABASE_ERROR:
          case ErrorCodes.EXTERNAL_API_ERROR:
          default:
            status = 500
            break
        }
      } else {
        status = 500
      }
    }

    return NextResponse.json(this.response, { status })
  }

  /**
   * Retourne l'objet de réponse brut
   */
  toJSON(): ApiResponse<T> {
    return this.response
  }
}

/**
 * Créateur rapide de réponses de succès
 */
export function successResponse<T>(data: T, statusCode?: number): NextResponse {
  return new ApiResponseBuilder<T>().success(data).build(statusCode)
}

/**
 * Créateur rapide de réponses d'erreur
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: any,
  statusCode?: number
): NextResponse {
  return new ApiResponseBuilder().error(code, message, details).build(statusCode)
}

/**
 * Créateur rapide de réponses paginées
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return new ApiResponseBuilder<T[]>()
    .success(data)
    .pagination(total, page, limit)
    .build()
}

/**
 * Gestionnaire d'erreurs standardisé pour les routes API
 */
export function handleApiError(error: any, context?: string): NextResponse {
  console.error(`Erreur API${context ? ` (${context})` : ''}:`, error)

  // Erreur de validation Zod
  if (error.name === 'ZodError') {
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      'Données invalides',
      error.errors
    )
  }

  // Erreur de base de données
  if (error.code && error.code.startsWith('23')) {
    return errorResponse(
      ErrorCodes.DATABASE_ERROR,
      'Erreur de base de données',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }

  // Erreur par défaut
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    'Erreur interne du serveur',
    process.env.NODE_ENV === 'development' ? error.message : undefined
  )
}

/**
 * Middleware de validation des paramètres de pagination
 */
export function validatePaginationParams(
  page?: string | null,
  limit?: string | null
): { page: number; limit: number } {
  const parsedPage = Math.max(1, parseInt(page || '1', 10))
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit || '20', 10)))
  
  return {
    page: isNaN(parsedPage) ? 1 : parsedPage,
    limit: isNaN(parsedLimit) ? 20 : parsedLimit
  }
}

/**
 * Gestionnaire pour les erreurs d'authentification
 */
export function unauthorizedResponse(message = 'Non autorisé'): NextResponse {
  return errorResponse(ErrorCodes.UNAUTHORIZED, message)
}

/**
 * Gestionnaire pour les erreurs de permission
 */
export function forbiddenResponse(message = 'Accès interdit'): NextResponse {
  return errorResponse(ErrorCodes.FORBIDDEN, message)
}

/**
 * Gestionnaire pour les ressources non trouvées
 */
export function notFoundResponse(resource = 'ressource'): NextResponse {
  return errorResponse(ErrorCodes.NOT_FOUND, `${resource} non trouvée`)
}

/**
 * Gestionnaire pour le rate limiting
 */
export function rateLimitResponse(
  message = 'Trop de requêtes',
  resetTime?: Date
): NextResponse {
  const response = errorResponse(ErrorCodes.RATE_LIMIT_EXCEEDED, message)
  
  if (resetTime) {
    response.headers.set('X-RateLimit-Reset', resetTime.toISOString())
  }
  
  return response
}

/**
 * Wrapper pour les routes API avec gestion d'erreurs automatique
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse | R>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(...args)
      return result instanceof NextResponse ? result : NextResponse.json(result)
    } catch (error) {
      return handleApiError(error, handler.name)
    }
  }
}

/**
 * Utilitaire pour logger les requêtes API
 */
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  metadata?: Record<string, any>
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    method,
    path,
    userId,
    ...metadata
  }
  
  console.log('[API]', JSON.stringify(logData))
} 