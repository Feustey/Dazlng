export const protectedRoutes = [
  "/dashboard",
  "/node",
  "/settings",
  "/api/protected",
];

export const publicRoutes = [
  "/",
  "/fr",
  "/en",
  "/auth",
  "/about",
  "/contact",
  "/help",
  "/api/auth",
  "/fr/auth",
  "/en/auth",
  "/fr/about",
  "/en/about",
  "/fr/contact",
  "/en/contact",
  "/fr/help",
  "/en/help",
];

export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path === route || path.startsWith(route));
}
