"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

const CustomHeader: React.FC = () => {
  const { user, session } = useSupabase();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fermer le menu mobile lors d'un clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const handleLogout = async (): Promise<void> => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-mobile-menu>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" aria-label="Accueil">
              <Image 
                src="/assets/images/logo-daznode.svg"
                alt="Daz3 Logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
                style={{ height: "auto" }}
                priority 
              />
            </a>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/daznode" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazNode
            </a>
            <a href="/dazbox" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazBox
            </a>
            <a href="/dazpay" className="text-gray-700 hover:text-indigo-600 font-medium">
              DazPay
            </a>
            <a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
              Contact
            </a>
          </nav>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu de navigation"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Boutons d'authentification adaptatifs */}
          <div className="flex items-center space-x-4">
            {user && session ? (
              // Utilisateur connecté
              <div className="flex items-center space-x-4">
                <a 
                  href="/user/dashboard" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Mon Compte
                </a>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-block px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              // Utilisateur non connecté
              <a 
                href="/auth/login" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Connexion
              </a>
            )}
          </div>
        </div>

        {/* Menu mobile overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <nav className="px-6 py-4 space-y-4">
              <a 
                href="/daznode" 
                className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🚀 DazNode
              </a>
              <a 
                href="/dazbox" 
                className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                📦 DazBox
              </a>
              <a 
                href="/dazpay" 
                className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚡ DazPay
              </a>
              <a 
                href="/contact" 
                className="block py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors border-t border-gray-100 pt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                📞 Contact & Telegram
              </a>
              
              {/* Liens sociaux rapides en mobile */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3 px-4">Rejoignez-nous</p>
                <div className="flex items-center space-x-4 px-4">
                  <a 
                    href="https://t.me/+_tiT3od1q_Q0MjI0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.292 0.9-4.2 0.9-1.292 0.9-4.2-0.9-1.292 0.9-4.2-0.9s-1.223-1.223-1.292-1.292z"/>
                    </svg>
                    <span className="text-sm font-medium text-blue-600">Telegram</span>
                  </a>
                  <a 
                    href="nostr:d2d8186182cce5d40e26e7db23ea38d3bf4e10dd98642cc4f5b1fb38efaf438e" 
                    className="flex items-center space-x-2 py-2 px-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-purple-600 font-bold text-sm">N</span>
                    <span className="text-sm font-medium text-purple-600">Nostr</span>
                  </a>
                </div>
              </div>

              {/* Boutons d'authentification mobile */}
              {user && session ? (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <a 
                    href="/user/dashboard" 
                    className="block w-full py-3 px-4 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon Compte
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-3 px-4 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <a 
                    href="/auth/login" 
                    className="block w-full py-3 px-4 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomHeader; 