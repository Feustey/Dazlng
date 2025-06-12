/**
 * Utilitaire pour nettoyer les cookies Supabase corrompus
 * Corrige les erreurs "base64-eyJ" is not valid JSON
 */

export function clearSupabaseCookies(): void {
  if (typeof window === 'undefined') return;

  try {
    // Liste des cookies Supabase à nettoyer
    const supabaseCookieKeys = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'supabase.auth.token'
    ];

    // Nettoyer les cookies corrompus
    supabaseCookieKeys.forEach(key => {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
        ?.split('=')[1];

      if (cookieValue && cookieValue.startsWith('base64-')) {
        // Cookie corrompu détecté, le supprimer
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log(`🧹 Cookie Supabase corrompu nettoyé: ${key}`);
      }
    });

    // Nettoyer localStorage/sessionStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('base64-')) {
            localStorage.removeItem(key);
            console.log(`🧹 LocalStorage Supabase corrompu nettoyé: ${key}`);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });

  } catch (error) {
    console.warn('Erreur lors du nettoyage des cookies Supabase:', error);
  }
}

/**
 * Fonction à appeler au démarrage de l'application
 */
export function initSupabaseCookiesFix(): void {
  if (typeof window === 'undefined') return;

  // Nettoyer au chargement
  clearSupabaseCookies();

  // Écouter les erreurs de parsing JSON
  const originalParse = JSON.parse;
  JSON.parse = function(text: string, reviver?: any) {
    try {
      return originalParse.call(this, text, reviver);
    } catch (error) {
      if (text && text.startsWith('base64-')) {
        console.warn('🚨 Cookie Supabase corrompu détecté, nettoyage en cours...');
        clearSupabaseCookies();
        // Retourner un objet vide pour éviter l'erreur
        return {};
      }
      throw error;
    }
  };
} 