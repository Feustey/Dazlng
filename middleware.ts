import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./app/i18n.config.base";

// Créer le middleware pour next-intl
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

// Combiner les middlewares
export default auth((req) => {
  // Appliquer d'abord le middleware next-intl
  const response = intlMiddleware(req);
  if (response) return response;

  const isAuthenticated = !!req.auth;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/daznode",
    "/daz-ia",
    "/network",
    "/channels",
    "/login",
    "/register",
    "/api/public",
  ];

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Protéger les routes spécifiées
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/api/protected");

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/login`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/daznode/:path*",
    "/daz-ia/:path*",
    "/network/:path*",
    "/channels/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
