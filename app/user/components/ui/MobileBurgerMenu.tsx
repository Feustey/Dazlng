'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MenuItem {
  href: string;
  label: string;
  icon: string;
  color: string;
}

interface MobileBurgerMenuProps {
  navItems: MenuItem[];
  accountMenuItems: MenuItem[];
  isAccountActive: boolean;
  onLogout: () => void;
  userEmail?: string;
}

const MobileBurgerMenu: React.FC<MobileBurgerMenuProps> = ({
  navItems,
  accountMenuItems,
  isAccountActive,
  onLogout,
  userEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'indigo':
          return 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500';
        case 'purple':
          return 'bg-purple-50 text-purple-700 border-l-4 border-purple-500';
        case 'green':
          return 'bg-green-50 text-green-700 border-l-4 border-green-500';
        case 'emerald':
          return 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500';
        case 'yellow':
          return 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500';
        case 'blue':
          return 'bg-blue-50 text-blue-700 border-l-4 border-blue-500';
        default:
          return 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500';
      }
    }
    return 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent';
  };

  return (
    <>
      {/* Bouton burger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="Menu de navigation"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
          }`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
          }`}></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu mobile */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header du menu */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">D</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">DazNode</h2>
                <p className="text-purple-100 text-xs">Lightning Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profil utilisateur */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userEmail}
                </p>
                <p className="text-xs text-gray-500">Utilisateur connecté</p>
              </div>
            </div>
          </div>

          {/* Navigation principale */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Navigation
                </h3>
              </div>
              
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-4 px-6 py-4 text-base font-medium transition-all duration-200 ${getColorClasses(item.color, isActive)}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Section Mon compte */}
            <div className="py-2 border-t border-gray-200">
              <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mon compte
                </h3>
              </div>
              
              {accountMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-4 px-6 py-4 text-base font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bouton de déconnexion */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
            >
              <span className="text-2xl">🚪</span>
              <span>Se déconnecter</span>
              <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileBurgerMenu;