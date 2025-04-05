export const protectedRoutes = [
  "/dashboard",
  "/node",
  "/settings",
  "/api/protected",
];

export const publicRoutes = ["/", "/auth", "/about", "/contact", "/api/auth"];

export function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path.startsWith(route));
}
