import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import Image from 'next/image';

const Header: React.FC = () => {
  const { user, session } = useSupabase();
  const router = useRouter();
  const locale = useLocale();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" locale={locale} className="text-xl font-bold text-gray-900">
              DazNode
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/dazbox" locale={locale} className="text-gray-700 hover:text-gray-900">
              DazBox
            </Link>
            <Link href="/daznode" locale={locale} className="text-gray-700 hover:text-gray-900">
              DazNode
            </Link>
            <Link href="/dazpay" locale={locale} className="text-gray-700 hover:text-gray-900">
              DazPay
            </Link>
            <Link href="/dazflow" locale={locale} className="text-gray-700 hover:text-gray-900">
              DazFlow
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && session ? (
              <>
                <Link href="/user/dashboard" locale={locale} className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/register"
                locale={locale}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Inscription
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 