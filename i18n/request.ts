import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "../i18n.config";
import type { GetRequestConfigParams, RequestConfig } from "next-intl/server";

export default getRequestConfig(
  async (params: GetRequestConfigParams): Promise<RequestConfig> => {
    // Ensure we have a valid locale
    const validLocale =
      params.locale && locales.includes(params.locale)
        ? params.locale
        : defaultLocale;

    return {
      messages: (await import(`../messages/${validLocale}.json`)).default,
      timeZone: "Europe/Paris",
      now: new Date(),
      locale: validLocale,
    };
  }
);
