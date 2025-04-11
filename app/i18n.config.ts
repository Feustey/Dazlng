import { getRequestConfig } from "next-intl/server";
import {
  locales,
  defaultLocale,
  Locale,
  localePrefix,
} from "./i18n.config.base";

export { locales, defaultLocale, localePrefix } from "./i18n.config.base";

export default getRequestConfig(async ({ requestLocale }) => {
  // Vérifier si la locale est valide
  const currentLocale = (
    locales.includes(requestLocale as any) ? requestLocale : defaultLocale
  ) as string;

  return {
    messages: (await import(`./messages/${currentLocale}.json`)).default,
    locale: currentLocale,
    timeZone: "Europe/Paris",
    now: new Date(),
    // Configuration avancée pour next-intl
    defaultTranslationValues: {
      appName: "Daznode",
    },
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
      number: {
        currency: {
          style: "currency",
          currency: "EUR",
        },
      },
    },
    onError: (error) => {
      console.error("i18n error:", error);
    },
    getMessageFallback: ({ key, namespace }) => {
      return `${namespace ? namespace + "." : ""}${key}`;
    },
  };
});
