// Configuration Supabase pour sessions d'1 heure
export const SUPABASE_SESSION_CONFIG = {
  // Durée de session en secondes (1 heure = 3600 secondes)
  SESSION_DURATION: 3600,
  
  // Configuration des tokens JWT
  JWT_EXPIRY: '1h',
  
  // Configuration refresh token (optionnel, peut être plus long)
  REFRESH_TOKEN_EXPIRY: '1h',
  
  // Auto-refresh avant expiration (en secondes)
  AUTO_REFRESH_BEFORE_EXPIRY: 300, // 5 minutes avant expiration
} as const;

// Configuration pour createClient
export const supabaseClientConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    // Configuration personnalisée pour 1h
    sessionTimeoutMs: SUPABASE_SESSION_CONFIG.SESSION_DURATION * 1000,
  }
};

/**
 * IMPORTANT: Configuration côté Supabase Dashboard
 * 
 * Pour configurer la durée de session à 1 heure dans Supabase:
 * 
 * 1. Aller sur https://supabase.com/dashboard
 * 2. Sélectionner votre projet
 * 3. Aller dans Authentication > Settings
 * 4. Dans la section "JWT Settings":
 *    - JWT expiry time: 3600 (secondes) = 1 heure
 *    - Refresh token expiry time: 3600 (secondes) = 1 heure
 * 
 * 5. Variables d'environnement à ajouter (optionnel):
 *    SUPABASE_JWT_EXPIRY=3600
 *    SUPABASE_REFRESH_TOKEN_EXPIRY=3600
 * 
 * Note: Les changements dans le dashboard Supabase peuvent prendre 
 * quelques minutes à se propager.
 */ 