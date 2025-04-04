import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./i18n.config";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
});

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
