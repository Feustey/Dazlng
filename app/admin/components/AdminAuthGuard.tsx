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
  user_metadata: any;
  app_metadata: any;
}

const AdminAuthGuard: FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
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
          // Erreur d'auth, rediriger vers la page d'auth admin
          router.push('/admin');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        router.push('/admin');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Vérification des droits d'accès...</p>
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