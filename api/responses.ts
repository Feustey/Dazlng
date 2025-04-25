import { NextResponse } from "next/server";

type ApiResponseOptions = {
  status?: number;
  headers?: Record<string, string>;
};

/**
 * Fonction utilitaire pour créer une réponse API réussie standardisée
 */
export function successResponse<T>(data: T, options: ApiResponseOptions = {}) {
  const { status = 200, headers = {} } = options;

  return NextResponse.json({ success: true, data }, { status, headers });
}

/**
 * Fonction utilitaire pour créer une réponse d'erreur API standardisée
 */
export function errorResponse(
  error: string | Error,
  options: ApiResponseOptions = {}
) {
  const { status = 500, headers = {} } = options;
  const errorMessage = error instanceof Error ? error.message : error;

  return NextResponse.json(
    { success: false, error: errorMessage },
    { status, headers }
  );
}

/**
 * Codes de statut HTTP courants
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
