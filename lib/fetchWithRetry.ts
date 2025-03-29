/**
 * Utilitaire pour effectuer des appels fetch avec retry
 */

type FetchOptions = RequestInit & {
  maxRetries?: number;
  retryDelay?: number;
};

/**
 * Fonction fetch avec retry automatique en cas d'erreurs temporaires (503)
 * @param url URL à appeler
 * @param options Options de fetch et de retry
 * @returns Promise avec la réponse
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let retries = 0;
  let lastError: Error = new Error("Une erreur inconnue s'est produite");

  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        // Ajouter un timeout pour éviter d'attendre trop longtemps
        signal: options.signal || AbortSignal.timeout(10000),
      });

      // Si le service est indisponible, on réessaie
      if (response.status === 503) {
        throw new Error(`Service temporairement indisponible (503)`);
      }

      // Pour les autres erreurs, on renvoie la réponse
      if (!response.ok) {
        return response; // Le composant appelant gérera l'erreur
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      retries++;

      // Si on a atteint le nombre maximum de tentatives, on arrête
      if (retries > maxRetries) {
        break;
      }

      // Attendre avant de réessayer avec un délai exponentiel
      const backoffDelay = retryDelay * Math.pow(2, retries - 1);
      console.log(`Erreur ${lastError.message}. Tentative ${retries}/${maxRetries} dans ${backoffDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError;
}

/**
 * Fonction fetchJSON avec retry automatique
 * @param url URL à appeler
 * @param options Options de fetch et de retry
 * @returns Promise avec les données JSON
 */
export async function fetchJSONWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`
    );
  }
  
  return response.json();
} 