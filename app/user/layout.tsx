'use client';

import React, { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import Image from 'next/image';
import MobileBurgerMenu from './components/ui/MobileBurgerMenu';

export interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, signOut } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Page de chargement
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('user.chargement')}</p>
        </div>
      </div>
    );
  }

  // Rediriger si pas authentifié
  if (!user) {
    return null;
  }

  const navItems = [
    { href: '/user/dashboard', label: 'Dashboard', color: 'indigo', icon: '📊' },
    { href: '/user/node', label: "user.userusermon_nud", color: 'purple', icon: '⚡' },
    { href: '/user/dazia', label: "user.useruserdazia_ia", color: 'yellow', icon: '🤖' },
    { href: '/user/simulation', label: 'Simulation', color: 'orange', icon: '🔬' },
    { href: '/user/rag-insights', label: "user.useruserrag_insights", color: 'blue', icon: '🧠' },
    { href: '/user/optimize', label: 'Optimisation', color: 'emerald', icon: '🚀' }
  ];

  const accountMenuItems = [
    { href: '/user/subscriptions', label: 'Abonnements', icon: '💳', color: 'blue' },
    { href: '/user/settings', label: "user.useruserparamtres", icon: '⚙️', color: 'gray' }
  ];

  const getTabStyles = (item: typeof navItems[0], isActive: boolean): string => {
    if (isActive) {
      switch (item.color) {
        case 'indigo':
          return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        case 'purple':
          return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'green':
          return 'text-green-600 bg-green-50 border-green-200';
        case 'emerald':
          return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        case 'yellow':
          return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'blue':
          return 'text-blue-600 bg-blue-50 border-blue-200';
        default:
          return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      }
    }
    return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent';
  };

  const isAccountActive = pathname === '/user/subscriptions' || pathname === '/user/settings';

  const getIndicatorStyles = (color: string): string => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-600';
      case 'purple':
        return 'bg-purple-600';
      case 'green':
        return 'bg-green-600';
      case 'emerald':
        return 'bg-emerald-600';
      case 'yellow':
        return 'bg-yellow-400';
      case 'blue':
          return 'bg-blue-600';
        case 'orange':
          return 'bg-orange-600';
        case 'red':
          return 'bg-red-600';
        case 'pink':
          return 'bg-pink-600';
        default:
          return 'bg-indigo-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header redesigné avec logo et navigation moderne */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Section gauche : Menu burger + Logo */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Menu burger mobile */}
              <MobileBurgerMenu
                navItems={navItems}
                accountMenuItems={accountMenuItems}
                isAccountActive={isAccountActive}
                onLogout={handleLogout}
                userEmail={user?.email}
              />
              
              {/* Logo et branding */}
              <div className="flex items-center space-x-3">
                <Image
                  src="/assets/images/logo-daznode.svg"
                  alt="DazNode"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    DazNode
                  </h1>
                  <p className="text-xs text-gray-500">{t('user.lightning_network_dashboard')}</p>
                </div>
              </div>
              
              {/* Navigation principale - Desktop uniquement */}
              <nav className="hidden lg:flex space-x-2">
                {navItems.map((item: any) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${getTabStyles(item, isActive)}`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <div 
                          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${getIndicatorStyles(item.color)}`}
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>
            
            {/* Section droite avec Mon compte - Desktop uniquement */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Profil utilisateur compact */}
              <div className="hidden lg:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-medium max-w-32 truncate">
                  {user?.email}
                </span>
              </div>
              
              {/* Menu Mon compte - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isAccountActive 
                      ? 'text-blue-600 bg-blue-50 border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <span className="text-base">👤</span>
                  <span className="hidden lg:inline">{t('user.mon_compte')}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isAccountMenuOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Menu déroulant */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {accountMenuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    ))}
                    
                    <hr className="my-2 border-gray-200" />
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
                    >
                      <span className="text-base">🚪</span>
                      <span>{t('user.se_dconnecter')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content optimisé */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;

export const dynamic = "force-dynamic";
