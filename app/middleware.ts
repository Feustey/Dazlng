import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config.base";

/**
 * Middleware qui gère la redirection vers la locale par défaut
 * si aucune locale n'est présente dans l'URL
 */
export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  // Ignorer les fichiers statiques et les routes API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Vérifier si le chemin commence déjà par une locale valide
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Rediriger vers la locale par défaut si aucune locale n'est présente
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);

  // Ajouter un header pour indiquer la locale
  const response = NextResponse.redirect(newUrl);
  response.headers.set("x-locale", defaultLocale);

  return response;
}

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques, api, etc.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(fr|en|es|de)/:path*",
  ],
};
