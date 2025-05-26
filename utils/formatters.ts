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
 * Formate une date en format français
 * @param date La date à formater
 * @returns La date formatée
 */
export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR");
  } catch {
    return "-";
  }
}

/**
 * Formate un montant en Sats
 * @param amount Le montant en Sats
 * @returns Le montant formaté
 */
export function formatSats(amount: any): string {
  return formatNumber(amount, "Sats");
} 