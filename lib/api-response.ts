export export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
    [key: string]: unknown;
  };
}

/**
 * Crée une réponse API standardisée
 */
export function createApiResponse<T>(
  response: ApiResponse<T>,
  status = 200
): Response {
  // Ajouter les métadonnées
  const responseWithMeta = {
    ...response,
    meta: {
      ...response.meta,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
  };

  return new Response(JSON.stringify(responseWithMeta), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Gère les erreurs API de manière standardisée
 */
export function handleApiError(error: unknown): Response {
  console.error('❌ API Error:', error);

  // Erreur avec code et message
  if (error instanceof Error && 'code' in error) {
    const apiError = error as Error & { code: string };
    return createApiResponse({
      success: false,
      error: {
        code: apiError.code,
        message: apiError.message
      }
    }, 500);
  }

  // Erreur standard
  if (error instanceof Error) {
    return createApiResponse({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    }, 500);
  }

  // Erreur inconnue
  return createApiResponse({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Une erreur inconnue est survenue'
    }
  }, 500);
}
