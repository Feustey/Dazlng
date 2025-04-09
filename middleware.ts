import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// Liste des routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/",
  "/fr",
  "/en",
  "/fr/login",
  "/en/login",
  "/fr/register",
  "/en/register",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/session",
  "/api/auth/me",
  "/api/auth/csrf",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/auth/callback",
  "/api/auth/verify-request",
  "/api/auth/error",
  "/api/auth/providers",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la route est publique
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Récupérer le token du header Authorization
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Si c'est une route API, renvoyer une erreur 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    // Pour les routes non-API, rediriger vers la page de connexion
    const url = new URL("/fr/login", request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Vérifier le token
    const decoded = verify(token, process.env.JWT_SECRET || "votre_secret_jwt");

    // Ajouter les informations de l'utilisateur à la requête
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(decoded));

    // Continuer avec la requête modifiée
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Si c'est une route API, renvoyer une erreur 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    // Pour les routes non-API, rediriger vers la page de connexion
    const url = new URL("/fr/login", request.url);
    return NextResponse.redirect(url);
  }
}

// Configuration des routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: [
    // Exécuter uniquement sur les routes API nécessitant une authentification
    // Exclure toutes les routes d'authentification
    "/api/:path*",
  ],
};
