type ErrorResponse = {
  message: string;
  code?: string;
  details?: unknown;
}

export const handleError = (error: unknown): ErrorResponse => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR'
    }
  }
  return {
    message: 'Une erreur inattendue est survenue',
    code: 'UNKNOWN_ERROR'
  }
} 