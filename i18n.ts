import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./i18n.config.base";

export { locales, defaultLocale } from "./i18n.config.base";

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const currentLocale = locales.includes(locale as any)
    ? locale
    : defaultLocale;

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
    timeZone: "Europe/Paris",
    now: new Date(),
    locale: currentLocale as string,
  };
});
