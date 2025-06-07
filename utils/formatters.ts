/**
 * Formate un nombre en format français avec l'unité spécifiée
 * @param value La valeur à formater (peut être un nombre, une chaîne ou undefined)
 * @param unit L'unité à ajouter (optionnel)
 * @returns La chaîne formatée
 */
export function formatNumber(value: any, unit?: string): string {
  // Convertir en nombre
  const num = Number(value);
  
  // Vérifier si c'est un nombre valide
  if (isNaN(num) || !isFinite(num)) {
    return "0" + (unit ? " " + unit : "");
  }
  
  try {
    const formatted = num.toLocaleString("fr-FR");
    return unit ? `${formatted} ${unit}` : formatted;
  } catch {
    return "0" + (unit ? " " + unit : "");
  }
}

/**
 * Formate une date en format français complet
 * @param date La date à formater
 * @returns La date formatée
 */
export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "Date invalide";
  }
}

/**
 * Formatage des dates courtes
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    return 'Date invalide';
  }
}

/**
 * Formatage des montants en satoshis avec gestion intelligente
 */
export function formatSats(amount: number | string): string {
  const num = Number(amount);
  
  if (isNaN(num) || num === 0) return '0 sats';
  
  if (num >= 100000000) {
    // Plus de 1 BTC
    const btc = num / 100000000;
    return `${btc.toFixed(8)} BTC`;
  } else if (num >= 1000) {
    // Plus de 1000 sats
    return `${num.toLocaleString('fr-FR')} sats`;
  } else {
    return `${num} sats`;
  }
}

/**
 * Formatage des pourcentages
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatage des durées
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}j`;
  }
}

/**
 * Formatage des tailles de fichiers
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Formatage des clés publiques (tronquées)
 */
export function formatPubkey(pubkey: string, length: number = 16): string {
  if (!pubkey) return '';
  if (pubkey.length <= length) return pubkey;
  
  const half = Math.floor(length / 2);
  return `${pubkey.substring(0, half)}...${pubkey.substring(pubkey.length - half)}`;
}

/**
 * Formatage du statut avec emoji
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'active': '🟢 Actif',
    'inactive': '🔴 Inactif',
    'pending': '🟡 En attente',
    'cancelled': '⚫ Annulé',
    'completed': '✅ Terminé',
    'failed': '❌ Échoué',
    'sent': '📤 Envoyé',
    'delivered': '📬 Livré',
    'opened': '👁️ Ouvert',
    'clicked': '🖱️ Cliqué',
    'bounced': '↩️ Rebond',
    'draft': '📝 Brouillon',
    'scheduled': '⏰ Programmé',
    'sending': '📡 Envoi en cours'
  };

  return statusMap[status] || status;
} 