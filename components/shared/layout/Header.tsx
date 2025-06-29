import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import Image from 'next/image';

export const Header = () => {
  const t = useTranslations('navigation');

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex-shrink-0">
            <Image
              src="/assets/images/logo-daznode.svg"
              alt="DazNode"
              width={32}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </a>
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <a
              href="/dazbox"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('dazbox')}
            </a>
            <a
              href="/daznode"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('daznode')}
            </a>
            <a
              href="/dazpay"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              {t('dazpay')}
            </a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <a
            href="/login"
            className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
          >
            {t('login')}
          </a>
          <a
            href="/register"
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            {t('register')}
          </a>
        </div>
      </nav>
    </header>
  );
}; 