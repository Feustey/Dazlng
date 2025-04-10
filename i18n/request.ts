import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: "Europe/Paris",
  };
});
