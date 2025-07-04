/**
 * Constantes pour toutes les routes API de DazNode
 * Centralise la définition des endpoints pour faciliter la maintenance
 *

// ============================================================================
// ROUTES DE BASE
// ============================================================================

export const API_BASE = '/api'

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

export const AUTH_ROUTES = {
  BASE: `${API_BASE}/auth`,`
  SEND_CODE: `${API_BASE}/auth/send-code`,`
  VERIFY_CODE: `${API_BASE}/auth/verify-code`,`
  LOGIN_NODE: `${API_BASE}/auth/login-node`,`
  ME: `${API_BASE}/auth/me`,`
  CHECK: `${API_BASE}/auth/check`,`
  CHECK_LNURL_AUTH: `${API_BASE}/auth/check-lnurl-auth`,`
  LNURL_AUTH: `${API_BASE}/auth/lnurl-auth`,`
  VERIFY_WALLET: `${API_BASE}/auth/verify-wallet`,
  WALLET: {`
    BASE: `${API_BASE}/auth/wallet`,`
    CONNECT: `${API_BASE}/auth/wallet/connect`,`
    TEST: `${API_BASE}/auth/wallet/test`
  },
  LIGHTNING: {`
    BASE: `${API_BASE}/auth/lightning`,`
    VERIFY: `${API_BASE}/auth/lightning/verify`
  }
} as const

// ============================================================================
// ADMINISTRATION
// ============================================================================

export const ADMIN_ROUTES = {`
  BASE: `${API_BASE}/admin`,`
  STATS: `${API_BASE}/admin/stats`,`
  USERS: `${API_BASE}/admin/users`,`
  ORDERS: `${API_BASE}/admin/orders`,`
  PAYMENTS: `${API_BASE}/admin/payments`,`
  SUBSCRIPTIONS: `${API_BASE}/admin/subscriptions`,`
  EMAIL_ANALYTICS: `${API_BASE}/admin/email-analytics`
} as const

// ============================================================================
// UTILISATEURS
// ============================================================================

export const USER_ROUTES = {`
  BASE: `${API_BASE}/user`,`
  CREATE: `${API_BASE}/user/create`,`
  PASSWORD: `${API_BASE}/user/password`,`
  NODE: `${API_BASE}/user/node`
} as const

// ============================================================================
// COMMANDES
// ============================================================================

export const ORDER_ROUTES = {`
  BASE: `${API_BASE}/orders`,`
  LIST: `${API_BASE}/orders`,`
  CREATE: `${API_BASE}/orders`,`
  BY_ID: (id: string) => `${API_BASE}/orders/${id}`
} as const

// ============================================================================
// ABONNEMENTS
// ============================================================================

export const SUBSCRIPTION_ROUTES = {`
  BASE: `${API_BASE}/subscriptions`,`
  CURRENT: `${API_BASE}/subscriptions/current`,`
  PLANS: `${API_BASE}/subscriptions/plans`,`
  BY_ID: (id: string) => `${API_BASE}/subscriptions/${id}`
} as const

// ============================================================================
// PAIEMENTS
// ============================================================================

export const PAYMENT_ROUTES = {`
  CREATE_INVOICE: `${API_BASE}/create-invoice`,`
  CHECK_PAYMENT: `${API_BASE}/check-payment`,`
  CHECK_INVOICE: `${API_BASE}/check-invoice`,`
  CHECK_PROTON_PAYMENT: `${API_BASE}/check-proton-payment`,
  BILLING: {`
    BASE: `${API_BASE}/billing`,`
    INVOICES: `${API_BASE}/billing/invoices`
  }
} as const

// ============================================================================
// LIVRAISONS
// ============================================================================

export const DELIVERY_ROUTES = {`
  BASE: `${API_BASE}/deliveries`,`
  LIST: `${API_BASE}/deliveries`,`
  CREATE: `${API_BASE}/deliveries`,`
  BY_ID: (id: string) => `${API_BASE}/deliveries/${id}`
} as const

// ============================================================================
// RÉSEAU LIGHTNING
// ============================================================================

export const NETWORK_ROUTES = {`
  BASE: `${API_BASE}/network`,
  NODE: {`
    BASE: (nodeId: string) => `${API_BASE}/network/node/${nodeId}`,`
    CHANNELS: (nodeId: string) => `${API_BASE}/network/node/${nodeId}/channels`,
    CHANNEL_BY_ID: (nodeId: string, channelId: string) => `
      `${API_BASE}/network/node/${nodeId}/channels/${channelId}`
  },
  OPTIMIZE: {`
    BASE: `${API_BASE}/network/optimize`,`
    BY_ID: (id: string) => `${API_BASE}/network/optimize/${id}`
  }
} as const

// ============================================================================
// CONTACT ET COMMUNICATION
// ============================================================================

export const COMMUNICATION_ROUTES = {`
  CONTACT: `${API_BASE}/contact`,`
  SEND_EMAIL: `${API_BASE}/send-email`,`
  PROSPECT: `${API_BASE}/prospect`,
  OTP: {`
    BASE: `${API_BASE}/otp`,`
    SEND_CODE: `${API_BASE}/otp/send-code`,`
    VERIFY_CODE: `${API_BASE}/otp/verify-code`
  }
} as const

// ============================================================================
// WEBHOOKS
// ============================================================================

export const WEBHOOK_ROUTES = {`
  BASE: `${API_BASE}/webhook`,`
  STRIPE: `${API_BASE}/webhook/stripe`,`
  ALBY: `${API_BASE}/webhook/alby`,`
  LIGHTNING: `${API_BASE}/webhook/lightning`
} as const

// ============================================================================
// DEBUG ET DÉVELOPPEMENT
// ============================================================================

export const DEBUG_ROUTES = {`
  BASE: `${API_BASE}/debug`,`
  CONFIG: `${API_BASE}/debug/config`,`
  SUPABASE_STATUS: `${API_BASE}/debug/supabase-status`
} as const

// ============================================================================
// CRON ET TÂCHES AUTOMATISÉES
// ============================================================================

export const CRON_ROUTES = {`
  BASE: `${API_BASE}/cron`,`
  CLEANUP: `${API_BASE}/cron/cleanup`,`
  STATS: `${API_BASE}/cron/stats`,`
  EMAILS: `${API_BASE}/cron/emails`
} as const

// ============================================================================
// GROUPES DE ROUTES PAR FONCTIONNALITÉ
// ============================================================================

export const ROUTE_GROUPS = {
  AUTH: AUTH_ROUTE,S,
  ADMIN: ADMIN_ROUTE,S,
  USER: USER_ROUTE,S,
  ORDERS: ORDER_ROUTE,S,
  SUBSCRIPTIONS: SUBSCRIPTION_ROUTE,S,
  PAYMENTS: PAYMENT_ROUTE,S,
  DELIVERIES: DELIVERY_ROUTE,S,
  NETWORK: NETWORK_ROUTE,S,
  COMMUNICATION: COMMUNICATION_ROUTE,S,
  WEBHOOKS: WEBHOOK_ROUTE,S,
  DEBUG: DEBUG_ROUTE,S,
  CRON: CRON_ROUTES
} as const

// ============================================================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================================================

export const PUBLIC_ROUTES = [
  AUTH_ROUTES.SEND_CODE,
  AUTH_ROUTES.VERIFY_CODE,
  AUTH_ROUTES.CHECK,
  AUTH_ROUTES.LNURL_AUTH,
  AUTH_ROUTES.WALLET.TEST,
  SUBSCRIPTION_ROUTES.PLANS,
  PAYMENT_ROUTES.CREATE_INVOICE,
  PAYMENT_ROUTES.CHECK_PAYMENT,
  PAYMENT_ROUTES.CHECK_INVOICE,
  COMMUNICATION_ROUTES.CONTACT,
  DEBUG_ROUTES.CONFIG,
  DEBUG_ROUTES.SUPABASE_STATUS
] as const

// ============================================================================
// ROUTES ADMIN (authentification admin requise)
// ============================================================================

export const ADMIN_PROTECTED_ROUTES = [
  ADMIN_ROUTES.STATS,
  ADMIN_ROUTES.USERS,
  ADMIN_ROUTES.ORDERS,
  ADMIN_ROUTES.PAYMENTS,
  ADMIN_ROUTES.SUBSCRIPTIONS,
  ADMIN_ROUTES.EMAIL_ANALYTICS
] as const

// ============================================================================
// ROUTES AVEC RATE LIMITING STRICT
// ============================================================================

export const RATE_LIMITED_ROUTES = [
  AUTH_ROUTES.SEND_CODE,
  AUTH_ROUTES.VERIFY_CODE,
  USER_ROUTES.CREATE,
  COMMUNICATION_ROUTES.CONTACT,
  COMMUNICATION_ROUTES.SEND_EMAIL,
  PAYMENT_ROUTES.CREATE_INVOICE
] as const

// ============================================================================
// HELPERS POUR LA VALIDATION DES ROUTES
// ============================================================================

/**
 * Vérifie si une route est publique
 *
export function isPublicRoute(route: string): boolean {
  return PUBLIC_ROUTES.includes(route as any)
}

/**
 * Vérifie si une route nécessite des droits admin
 *
export function isAdminRoute(route: string): boolean {
  return ADMIN_PROTECTED_ROUTES.includes(route as any)
}

/**
 * Vérifie si une route a un rate limiting strict
 *
export function isRateLimitedRoute(route: string): boolean {
  return RATE_LIMITED_ROUTES.includes(route as any)
}

/**
 * Extrait le groupe de routes d'une URL
 *
export function getRouteGroup(route: string): string | null {
  const parts = route.replace(API_BAS,E, '').split('/').filter(Boolean)
  return parts[0] || null
}

/**
 * Génère l'URL complète d'une route API
 *
export function buildApiUrl(baseUrl: string, route: string): string {`
  return `${baseUrl.replace(//$,/, '')}${route}`
}

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  API_BASE,
  ...ROUTE_GROUPS,
  PUBLIC_ROUTES,
  ADMIN_PROTECTED_ROUTES,
  RATE_LIMITED_ROUTES,
  isPublicRoute,
  isAdminRoute,
  isRateLimitedRoute,
  getRouteGroup,
  buildApiUrl
} as const `