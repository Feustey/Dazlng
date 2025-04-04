import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return {
      messages: (await import(`./app/locale/en.json`)).default,
      locale: "en" as Locale,
    };
  }

  return {
    messages: (await import(`./app/locale/${locale}.json`)).default,
    locale: locale as Locale,
  };
});
