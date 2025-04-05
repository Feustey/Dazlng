import { getRequestConfig } from "next-intl/server";
import { locales } from "@/i18n.config";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    throw new Error("Locale is required");
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale,
  };
});
