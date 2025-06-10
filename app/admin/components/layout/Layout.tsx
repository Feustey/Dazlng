"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      // Vérifier si l'utilisateur admin est connecté
      // Pour l'instant, on va vérifier s'il y a une session Supabase active
      // avec l'email admin@dazno.de
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (response.ok && data.user?.email === 'admin@dazno.de') {
        setIsAuthenticated(true);
      } else {
        // Rediriger vers la page d'authentification
        router.push('/admin/auth');
        return;
      }
    } catch (error) {
      console.error('Erreur vérification auth admin:', error);
      router.push('/admin/auth');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Ne pas vérifier l'authentification sur la page d'auth
    if (pathname === '/admin/auth') {
      setIsLoading(false);
      return;
    }

    checkAuthStatus();
  }, [pathname, checkAuthStatus]);

  // Page d'authentification - pas de layout
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600">Vérification des autorisations...</span>
        </div>
      </div>
    );
  }

  // Non authentifié - ne devrait pas arriver car on redirige
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Layout principal pour les pages admin authentifiées
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
} 