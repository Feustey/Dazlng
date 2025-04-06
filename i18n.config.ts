import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, Locale } from "./i18n.config.base";

export { locales, defaultLocale } from "./i18n.config.base";

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const currentLocale =
    locale && locales.includes(locale as Locale) ? locale : defaultLocale;

  let messages;
  try {
    // Charger les messages de manière dynamique
    const messagesModule = await import(`./messages/${currentLocale}.json`);
    messages = messagesModule.default;

    if (!messages || typeof messages !== "object") {
      console.error(`Invalid messages format for locale ${currentLocale}`);
      messages = {};
    }
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
  };
});
