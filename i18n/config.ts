export const i18nConfig = {
  defaultLocale: 'fr',
  locales: ['fr', 'en'] as const,
  localeDetection: true,
  localePrefix: 'always',
  timeZone: 'Europe/Paris'
} as const;

export type Locale = typeof i18nConfig.locales[number];

export const getStaticParams = () => i18nConfig.locales.map((locale) => ({ locale }));

export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale);
}

// Fonction utilitaire pour obtenir la configuration next-intl
export function getNextIntlConfig() {
  return {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    localeDetection: i18nConfig.localeDetection,
    localePrefix: i18nConfig.localePrefix
  };
} 