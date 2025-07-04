"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { IconRegistry } from '@/components/shared/ui/IconRegistry';

const CustomHeader: React.FC = () => {
  const { user, session } = useSupabase();
  const router = useRouter();
  const locale = useLocale();

  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push(`/${locale}`);
        router.refresh();
      } else {
        console.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la déconnexion:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" locale={locale} aria-label="Accueil">
              <Image 
                src="/assets/images/logo-daznode.svg"
                alt="CustomHeader.customheaderfooterdaz3_logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
                style={{ height: "auto" }}
                priority 
              />
            </Link>
          </div>

          {/* Navigation simple */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/daznode" locale={locale} className="text-gray-700 hover:text-indigo-600 font-medium">
              DazNode
            </Link>
            <Link href="/dazbox" locale={locale} className="text-gray-700 hover:text-indigo-600 font-medium">
              DazBox
            </Link>
            <Link href="/dazpay" locale={locale} className="text-gray-700 hover:text-indigo-600 font-medium">
              DazPay
            </Link>
            <Link href="/dazflow" locale={locale} className="text-gray-700 hover:text-indigo-600 font-medium flex items-center">
              <IconRegistry.Gauge className="h-4 w-4 mr-1" />
              DazFlow Index
            </Link>
            <Link href="/contact" locale={locale} className="text-gray-700 hover:text-indigo-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Boutons d'authentification adaptatifs */}
          <div className="flex items-center space-x-4">
            {user && session ? (
              // Utilisateur connecté
              <div className="flex items-center space-x-4">
                <Link 
                  href="/user/dashboard" 
                  locale={locale}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Mon Compte
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-block px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              // Utilisateur non connecté
              <Link 
                href="/auth/login" 
                locale={locale}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader; 