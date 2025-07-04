/**
 * Utilitaire pour nettoyer les cookies Supabase corrompus
 * Corrige les erreurs "base64-eyJ" is not valid JSON
 */
export function clearSupabaseCookies(): void {
  if (typeof window === "undefined") return;

  try {
    // Liste des cookies Supabase à nettoyer
    const supabaseCookieKeys = [
      "sb-access-token",
      "sb-refresh-token", 
      "supabase-auth-token",
      "supabase.auth.token"
    ];

    // Nettoyer les cookies corrompus
    supabaseCookieKeys.forEach(key => {
      const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith(`${key}=`))
        ?.split("=")[1];

      if (cookieValue && cookieValue.startsWith("base64-")) {
        // Cookie corrompu détecté, le supprimer
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`🧹 Cookie Supabase corrompu nettoyé: ${key}`);
      }
    });

    // Nettoyer localStorage/sessionStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes("supabase") || key.includes("sb-")) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith("base64-")) {
            localStorage.removeItem(key);
            console.log(`🧹 LocalStorage Supabase corrompu nettoyé: ${key}`);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });

  } catch (error) {
    console.warn("Erreur lors du nettoyage des cookies Supabase:", error);
  }
}

/**
 * Fix pour les cookies Supabase corrompus
 * Nettoie les cookies problématiques qui peuvent causer des erreurs d'authentification
 */
export function initSupabaseCookiesFix(): void {
  if (typeof window === 'undefined') return;

  try {
    // Liste des cookies Supabase à nettoyer
    const supabaseCookieKeys = [
      "sb-access-token",
      "sb-refresh-token", 
      "supabase-auth-token",
      "supabase.auth.token"
    ];

    // Nettoyer les cookies corrompus
    supabaseCookieKeys.forEach(cookieKey => {
      try {
        // Vérifier si le cookie existe et est corrompu
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${cookieKey}=`))
          ?.split('=')[1];

        if (cookieValue && (cookieValue.includes('undefined') || cookieValue.includes('null') || cookieValue === '')) {
          // Supprimer le cookie corrompu
          document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          console.log(`[SupabaseCookiesFix] Cookie corrompu supprimé: ${cookieKey}`);
        }
      } catch (error) {
        console.warn(`[SupabaseCookiesFix] Erreur lors du nettoyage du cookie ${cookieKey}:`, error);
      }
    });

    // Vérifier et nettoyer les cookies avec des caractères invalides
    const allCookies = document.cookie.split(';');
    allCookies.forEach(cookie => {
      try {
        const [name, value] = cookie.trim().split('=');
        if (name && value && (value.includes('\\n') || value.includes('\\r') || value.includes('\\t'))) {
          // Supprimer le cookie avec des caractères de contrôle
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          console.log(`[SupabaseCookiesFix] Cookie avec caractères invalides supprimé: ${name}`);
        }
      } catch (error) {
        console.warn('[SupabaseCookiesFix] Erreur lors de l\'analyse du cookie:', error);
      }
    });

  } catch (error) {
    console.warn('[SupabaseCookiesFix] Erreur lors du nettoyage des cookies:', error);
  }
}