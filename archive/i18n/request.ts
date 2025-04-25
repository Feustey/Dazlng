import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "../i18n.config";
import type { GetRequestConfigParams, RequestConfig } from "next-intl/server";
import type { Locale } from "../i18n.config.base";

export default getRequestConfig(
  async (params: GetRequestConfigParams): Promise<RequestConfig> => {
    // Ensure we have a valid locale
    const validLocale =
      params.locale && locales.includes(params.locale as Locale)
        ? (params.locale as Locale)
        : defaultLocale;

    return {
      messages: (await import(`../messages/${validLocale}.json`)).default,
      locale: validLocale,
    };
  }
);
