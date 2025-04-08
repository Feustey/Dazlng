import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./app/i18n.config.base";

// Créer le middleware next-intl avec la configuration de base
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export default intlMiddleware;

// Configuration plus stricte du matcher
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
