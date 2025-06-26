// Utilitaires pour la gestion des cookies de pubkey
export interface PubkeyData {
  pubkey: string;
  alias?: string;
  savedAt: string;
}

// Nom du cookie pour la pubkey
const PUBKEY_COOKIE_NAME = 'daznode_user_pubkey';

// Durée de vie du cookie (30 jours)
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Sauvegarde la pubkey dans un cookie
 */
export function savePubkeyToCookie(pubkey: string, alias?: string): void {
  if (typeof window === 'undefined') return;

  const data: PubkeyData = {
    pubkey,
    alias,
    savedAt: new Date().toISOString()
  };

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);

  document.cookie = `${PUBKEY_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
  console.log('Pubkey sauvegardée dans le cookie:', pubkey.slice(0, 16) + '...');
}

/**
 * Récupère la pubkey depuis le cookie
 */
export function getPubkeyFromCookie(): PubkeyData | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const pubkeyCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${PUBKEY_COOKIE_NAME}=`)
  );
  if (!pubkeyCookie) return null;

  try {
    const cookieValue = pubkeyCookie.split('=')[1];
    const data = JSON.parse(decodeURIComponent(cookieValue));
    
    // Vérifier que les données sont valides
    if (data.pubkey && typeof data.pubkey === 'string') {
      return data;
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du cookie pubkey:', error);
    // Supprimer le cookie corrompu
    clearPubkeyCookie();
  }

  return null;
}

/**
 * Supprime le cookie de pubkey
 */
export function clearPubkeyCookie(): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${PUBKEY_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log('Cookie pubkey supprimé');
}

/**
 * Vérifie si une pubkey est valide (format Lightning Network)
 */
export function isValidPubkey(pubkey: string): boolean {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

/**
 * Récupère la pubkey avec validation
 */
export function getValidPubkeyFromCookie(): string | null {
  const data = getPubkeyFromCookie();
  
  if (data && isValidPubkey(data.pubkey)) {
    return data.pubkey;
  }
  
  // Si la pubkey n'est pas valide, supprimer le cookie
  if (data) {
    clearPubkeyCookie();
  }
  
  return null;
}

/**
 * Met à jour l'alias dans le cookie existant
 */
export function updatePubkeyAlias(alias: string): void {
  const existingData = getPubkeyFromCookie();
  
  if (existingData) {
    savePubkeyToCookie(existingData.pubkey, alias);
  }
}
