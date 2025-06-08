/**
 * Configuration centralisée pour l'application
 * Gère les variables d'environnement de manière type-safe
 */

export const config = {
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmailContact: 'DazNode Contact <contact@dazno.de>',
    fromEmailNoReply: 'DazNode <noreply@dazno.de>',
    adminEmails: ['admin@dazno.de', 'contact@dazno.de']
  },
  app: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  }
} as const;