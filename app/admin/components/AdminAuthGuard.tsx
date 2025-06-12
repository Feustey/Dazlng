'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { FC, ReactNode } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

interface AuthUser {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}

const AdminAuthGuard: FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDevelopment, setIsDevelopment] = useState<boolean>(false);

  useEffect(() => {
    // Détecter l'environnement côté client uniquement pour éviter l'hydratation mismatch
    setIsDevelopment(!process.env.NODE_ENV || process.env.NODE_ENV !== 'production');
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // En mode développement, bypasser l'authentification admin
      if (isDevelopment) {
        console.log('[AdminAuthGuard] Mode développement - accès admin autorisé');
        setIsAuthenticated(true);
        setUser({ id: 'dev-admin', email: 'dev@dazno.de', user_metadata: {}, app_metadata: {} });
        setIsLoading(false);
        return;
      }

      // Si on est déjà sur la page d'auth admin, ne pas faire de redirection
      if (pathname === '/admin') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.user) {
            const user = data.user;
            setUser(user);

            // Vérifier si l'utilisateur est admin (@dazno.de)
            if (user.email?.includes('@dazno.de')) {
              setIsAuthenticated(true);
            } else {
              // Pas admin, rediriger vers l'accueil
              router.push('/?error=access_denied');
              return;
            }
          } else {
            // Pas authentifié, rediriger vers la page d'auth admin
            router.push('/admin');
            return;
          }
        } else {
          // En cas d'erreur 500 en développement, bypasser l'auth
          if (isDevelopment && response.status === 500) {
            console.warn('[AdminAuthGuard] Erreur API en dev - bypass activé');
            setIsAuthenticated(true);
            setUser({ id: 'dev-admin-fallback', email: 'dev@dazno.de', user_metadata: {}, app_metadata: {} });
            setIsLoading(false);
            return;
          }
          
          // Erreur d'auth, rediriger vers la page d'auth admin
          console.error('[AdminAuthGuard] Erreur API:', response.status, response.statusText);
          router.push('/admin');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        
        // En développement, bypass en cas d'erreur réseau
        if (isDevelopment) {
          console.warn('[AdminAuthGuard] Erreur réseau en dev - bypass activé');
          setIsAuthenticated(true);
          setUser({ id: 'dev-admin-error', email: 'dev@dazno.de', user_metadata: {}, app_metadata: {} });
          setIsLoading(false);
          return;
        }
        
        router.push('/admin');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    // Attendre que isDevelopment soit détecté côté client
    if (isDevelopment !== undefined) {
      checkAuth();
    }
  }, [router, pathname, isDevelopment]);

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Vérification des droits d'accès...</p>
          {isDevelopment && (
            <p className="text-xs text-gray-400">Mode développement actif</p>
          )}
        </div>
      </div>
    );
  }

  // Si pas authentifié ou pas admin, ne rien afficher (la redirection est en cours)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Utilisateur authentifié et admin, afficher le contenu
  return <>{children}</>;
};

export default AdminAuthGuard; 