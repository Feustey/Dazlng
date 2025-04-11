export const locales = ["fr", "en", "es", "de"] as const;
export const defaultLocale = "fr" as const;
export const localePrefix = "always" as const;

export type Locale = (typeof locales)[number];

export const localeNames = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
} as const;

export const localeFlags = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
} as const;
