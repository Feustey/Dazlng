import { getRequestConfig } from 'next-intl/server';
import type { GetRequestConfigParams } from 'next-intl/server';
import { i18nConfig } from './config';

export default getRequestConfig(async (params: GetRequestConfigParams) => {
  const locale = params.locale || i18nConfig.defaultLocale;
  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
    timeZone: i18nConfig.timeZone
  };
}); 