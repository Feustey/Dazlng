import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "fr"],

  // Used when no locale matches
  defaultLocale: "en",
});

export const config = {
  // Ajuster le matcher pour exécuter le middleware uniquement sur les chemins prévus
  // et exclure explicitement /api, /_next/static, /_next/image, favicon.ico, etc.
  matcher: [
    // Activer pour les chemins racine et internationalisés
    "/",
    "/(fr|en)/:path*",

    // Exclure les chemins qui ne devraient PAS être internationalisés
    // (Ajoutez d'autres motifs si nécessaire)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
