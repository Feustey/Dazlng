import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/settings';

const languageConfig = {
  fr: {
    flag: '🇫🇷',
    name: 'Français'
  },
  en: {
    flag: '🇺🇸',
    name: 'English'
  }
} as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Remplace la langue dans le chemin
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-1">
      {locales.map((loc) => {
        const config = languageConfig[loc];
        const isActive = locale === loc;
        
        return (
          <button
            key={loc}
            onClick={() => switchLanguage(loc)}
            className={`
              flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium 
              transition-all duration-200 hover:scale-105
              ${isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600'
              }
            `}
            aria-label={`Changer la langue en ${config.name}`}
            title={config.name}
          >
            <span className="text-base">{config.flag}</span>
            <span className="hidden sm:inline">{loc.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}; 