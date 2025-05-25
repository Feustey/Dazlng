'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/user/dashboard', label: 'Dashboard', color: 'indigo' },
    { href: '/user/node', label: 'Mon Nœud', color: 'purple' },
    { href: '/user/subscriptions', label: 'Abonnements', color: 'green' },
    { href: '/user/billing', label: 'Factures', color: 'yellow' },
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
      {/* Header avec padding-top pour éviter la superposition avec le header global */}
      <header className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-left h-16">
            <nav className="flex space-x-8">
              {navItems.map((item) => {
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
