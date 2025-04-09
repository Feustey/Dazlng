import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Liste des routes protégées
const protectedRoutes = [
  "/checkout/delivery",
  "/checkout/payment",
  "/checkout/confirmation",
  "/dashboard",
  "/channels",
  "/network",
  "/bot-ia",
];

// Liste des routes d'authentification
const authRoutes = ["/auth"];

// Liste des routes publiques
const publicRoutes = ["/", "/learn"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié pour les routes protégées
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req: request });
    if (!token?.pubkey) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Empêcher l'accès aux routes d'authentification si déjà connecté
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req: request });
    if (token?.pubkey) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
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
  matcher: [
    "/checkout/:path*",
    "/auth/:path*",
    "/dashboard/:path*",
    "/channels/:path*",
    "/network/:path*",
    "/bot-ia/:path*",
    "/learn",
  ],
};
