// ⚠️ DÉPRÉCIÉ: Utilisez i18n/config.ts à la place
// Ce fichier est conservé pour la compatibilité mais sera supprimé dans la v2

import { i18nConfig, getStaticParams, isValidLocale, type Locale } from './config';

// Exports pour compatibilité
export const locales = i18nConfig.locales;
export const defaultLocale = i18nConfig.defaultLocale;
export type { Locale };
export { getStaticParams, isValidLocale };

// Avertissement en développement
if (process.env.NODE_ENV === 'development') {
  console.warn('⚠️ i18n/settings.ts est déprécié. Utilisez i18n/config.ts à la place.');
} 