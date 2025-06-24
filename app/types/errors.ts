export export enum AuthErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  RATE_LIMIT = 'RATE_LIMIT',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: Record<string, string>;
  code?: string;
  retry?: boolean;
  retryAfter?: number;
}

export export interface ValidationErrors {
  [field: string]: string;
}
