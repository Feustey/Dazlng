import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

async function importMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load ${locale} messages:`, error);
    return (await import(`./messages/en.json`)).default;
  }
}

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = (
    locales.includes(locale as Locale) ? locale : "en"
  ) as Locale;

  const messages = await importMessages(currentLocale);

  return {
    messages,
    locale: currentLocale,
  };
});
