"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "../hooks/useAuth";
import { isPublicRoute } from "../config/protected-routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    console.log("=== ProtectedRoute Debug ===");
    console.log("État d'authentification:", { isAuthenticated, loading });
    console.log("Locale actuelle:", locale);

    if (!loading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      console.log("Chemin actuel:", currentPath);

      // Si nous sommes déjà sur une route publique, ne pas rediriger
      if (isPublicRoute(currentPath)) {
        console.log("Route publique détectée, pas de redirection");
        return;
      }

      console.log("Redirection vers la page d'authentification");
      router.push(`/${locale}/auth`);
    }
  }, [loading, isAuthenticated, router, locale]);

  if (loading) {
    console.log("Affichage du loader");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Utilisateur non authentifié, rendu null");
    return null;
  }

  console.log("Rendu du contenu protégé");
  return <>{children}</>;
}
