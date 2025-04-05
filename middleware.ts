import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute } from "./app/config/protected-routes";

// Create the middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "fr",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.includes(".") || // Static files
    pathname.startsWith("/api/") || // API routes
    pathname.startsWith("/_next/") || // Next.js internals
    pathname.startsWith("/static/") // Static directory
  ) {
    return NextResponse.next();
  }

  // Get current locale from path or use default
  const locale = pathname.split("/")[1] || "fr";

  // Handle root paths with a single redirect
  if (pathname === "/" || pathname === `/${locale}`) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply the intl middleware
  const response = await intlMiddleware(request);
  if (response) return response;

  // Get the path without locale prefix for protected routes check
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");

  // Check for protected routes
  if (isProtectedRoute(pathWithoutLocale)) {
    const sessionId = request.cookies.get("sessionId")?.value;
    if (!sessionId) {
      const url = new URL(`/${locale}/auth`, request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
