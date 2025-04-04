import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./i18n.config";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: Request): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = ["fr", "en"];

  return match(languages, locales, defaultLocale);
}

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
