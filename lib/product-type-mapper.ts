/**
 * Utilitaire temporaire pour mapper les product_types 
 * vers les valeurs acceptées par la contrainte de base de données
 * 
 * À supprimer après l'harmonisation de la base de données
 */

export const PRODUCT_TYPE_MAPPING = {
  'dazbox': 'DazBox',
  'daznode': 'DazNode', 
  'dazpay': 'DazPay'
} as const;

export type CodeProductType = keyof typeof PRODUCT_TYPE_MAPPING;
export type DbProductType = typeof PRODUCT_TYPE_MAPPING[CodeProductType];

/**
 * Convertit un product_type du code vers la valeur DB
 * @param codeType - Le type de produit utilisé dans le code ('dazbox', 'daznode', 'dazpay')
 * @returns Le type de produit pour la DB ('DazBox', 'DazNode', 'DazPay')
 */
export function mapProductTypeForDb(codeType: CodeProductType): DbProductType {
  return PRODUCT_TYPE_MAPPING[codeType];
}

/**
 * Convertit un product_type de la DB vers le code
 * @param dbType - Le type de produit de la DB ('DazBox', 'DazNode', 'DazPay')
 * @returns Le type de produit pour le code ('dazbox', 'daznode', 'dazpay')
 */
export function mapProductTypeFromDb(dbType: string): CodeProductType | string {
  const entries = Object.entries(PRODUCT_TYPE_MAPPING) as [CodeProductType, DbProductType][];
  const found = entries.find(([, db]) => db === dbType);
  return found ? found[0] : dbType.toLowerCase();
}

/**
 * Vérifie si un product_type est valide
 * @param productType - Le type de produit à vérifier
 * @returns true si le type est valide
 */
export function isValidProductType(productType: string): productType is CodeProductType {
  return productType in PRODUCT_TYPE_MAPPING;
} 