import { getRequestConfig } from 'next-intl/server';
import type { GetRequestConfigParams } from 'next-intl/server';
import { locales, defaultLocale } from '../i18n.config.js';

export default getRequestConfig(async (params: GetRequestConfigParams) => {
  const locale = params.locale || defaultLocale;
  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: 'Europe/Paris'
  };
}); 