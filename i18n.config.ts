import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, Locale } from "./i18n.config.base";

export { locales, defaultLocale } from "./i18n.config.base";

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const currentLocale =
    locale && locales.includes(locale as Locale) ? locale : defaultLocale;

  let messages;
  try {
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
  };
});
