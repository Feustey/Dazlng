import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Liste des routes protégées
const protectedRoutes = [
  "/checkout/delivery",
  "/checkout/payment",
  "/checkout/confirmation",
];

// Liste des routes d'authentification
const authRoutes = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié pour les routes protégées
  if (protectedRoutes.includes(pathname)) {
    const session = request.cookies.get("session");
    if (!session) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Empêcher l'accès aux routes d'authentification si déjà connecté
  if (authRoutes.includes(pathname)) {
    const session = request.cookies.get("session");
    if (session) {
      return NextResponse.redirect(new URL("/checkout/delivery", request.url));
    }
  }

  // Protection CSRF
  if (request.method === "POST") {
    const csrfToken = request.headers.get("x-csrf-token");
    const storedToken = request.cookies.get("csrf-token");

    if (!csrfToken || !storedToken || csrfToken !== storedToken.value) {
      return new NextResponse(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
      });
    }
  }

  // Ajouter les en-têtes de sécurité
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: ["/checkout/:path*", "/auth"],
};
