'use client';

import React, { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';

export interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ CORRECTIF : Protection côté client aussi
  React.useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // Fonction de déconnexion
  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Rediriger vers la page d'accueil
        router.push('/');
        router.refresh();
      } else {
        console.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la déconnexion:', error);
    }
  };

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
  );
  }

  // Rediriger si pas authentifié
  if (!user) {
    return null; // Le useEffect va rediriger
  }

  const navItems = [
    { href: '/user/dashboard', label: 'Dashboard', color: 'indigo' },
    { href: '/user/node', label: 'Mon Nœud', color: 'purple' },
    { href: '/user/dazia', label: 'Dazia IA', color: 'yellow' },
    { href: '/user/subscriptions', label: 'Abonnements', color: 'green' },
    { href: '/user/settings', label: 'Paramètres', color: 'blue' }
  ];

  const getTabStyles = (item: typeof navItems[0], isActive: boolean): string => {
    if (isActive) {
      switch (item.color) {
        case 'indigo':
          return 'text-indigo-600 bg-indigo-50';
        case 'purple':
          return 'text-purple-600 bg-purple-50';
        case 'green':
          return 'text-green-600 bg-green-50';
        case 'yellow':
          return 'text-yellow-600 bg-yellow-50';
        case 'blue':
          return 'text-blue-600 bg-blue-50';
        default:
          return 'text-indigo-600 bg-indigo-50';
      }
    }
    return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
  };

  const getIndicatorStyles = (color: string): string => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-600';
      case 'purple':
        return 'bg-purple-600';
      case 'green':
        return 'bg-green-600';
      case 'yellow':
        return 'bg-yellow-400';
      case 'blue':
        return 'bg-blue-600';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sans padding-top car le header global est masqué */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <nav className="flex space-x-8">
              {navItems.map((item: any) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${getTabStyles(item, isActive)}`}
                  >
                    {item.label}
                    {isActive && (
                      <div 
                        className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${getIndicatorStyles(item.color)}`}
                      />
                    )}
                  </a>
  );
              })}
            </nav>
            
            {/* Section droite avec email utilisateur et déconnexion */}
            <div className="flex items-center space-x-4">
              {/* Email utilisateur */}
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.email}
              </span>
              
              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                title="Se déconnecter"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
