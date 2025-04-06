import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n.config";

// Créer le middleware next-intl avec la configuration de base
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip pour les ressources statiques et API
  if (
    pathname.includes("api") ||
    pathname.includes("_next") ||
    pathname.match(/\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2)$/)
  ) {
    return;
  }

  return intlMiddleware(request);
}

// Configuration plus stricte du matcher
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
