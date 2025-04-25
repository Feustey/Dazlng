export const locales = ["fr", "en", "de", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
};

export const localeRoutes: Record<Locale, string> = {
  fr: "/fr",
  en: "/en",
  de: "/de",
  es: "/es",
};

export const localePaths: Record<Locale, string> = {
  fr: "/fr",
  en: "/en",
  de: "/de",
  es: "/es",
};

export const localeDomains: Record<Locale, string> = {
  fr: "fr.dazlng.com",
  en: "en.dazlng.com",
  de: "de.dazlng.com",
  es: "es.dazlng.com",
};

export const localeConfigs: Record<
  Locale,
  { name: string; flag: string; route: string; path: string; domain: string }
> = {
  fr: {
    name: "Français",
    flag: "🇫🇷",
    route: "/fr",
    path: "/fr",
    domain: "fr.dazlng.com",
  },
  en: {
    name: "English",
    flag: "🇬🇧",
    route: "/en",
    path: "/en",
    domain: "en.dazlng.com",
  },
  de: {
    name: "Deutsch",
    flag: "🇩🇪",
    route: "/de",
    path: "/de",
    domain: "de.dazlng.com",
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    route: "/es",
    path: "/es",
    domain: "es.dazlng.com",
  },
};
