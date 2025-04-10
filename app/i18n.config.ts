import { getRequestConfig } from "next-intl/server";
import {
  locales,
  defaultLocale,
  Locale,
  localePrefix,
} from "./i18n.config.base";

export { locales, defaultLocale, localePrefix } from "./i18n.config.base";

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const currentLocale =
    locale && locales.includes(locale as Locale) ? locale : defaultLocale;

  let messages;
  try {
    // Charger les messages de manière dynamique
    messages = (await import(`./messages/${currentLocale}.json`)).default;
  } catch (error) {
    console.error(
      `Failed to load messages for locale ${currentLocale}:`,
      error
    );
    messages = {};
  }

  return {
    messages,
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
