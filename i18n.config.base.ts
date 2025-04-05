export const locales = ["fr", "en"] as const;
export const defaultLocale = "fr" as const;
export const localePrefix = "always";

export type Locale = (typeof locales)[number];
