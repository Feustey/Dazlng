import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

async function importMessages(locale: string, section: string) {
  try {
    return (await import(`./app/locale/${section}/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load ${locale} messages for ${section}:`, error);
    return (await import(`./app/locale/${section}/en.json`)).default;
  }
}

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = (
    locales.includes(locale as Locale) ? locale : "en"
  ) as Locale;

  const sections = [
    "home",
    "bot-ia",
    "messages",
    "settings",
    "channels",
    "review",
    "help",
    "about",
  ] as const;

  const messages = await Promise.all(
    sections.map(async (section) => ({
      [section]: await importMessages(currentLocale, section),
    }))
  ).then((results) => results.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

  return {
    messages,
    locale: currentLocale,
  };
});
