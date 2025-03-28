import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon, Cog6ToothIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';
import NodeSearch from './NodeSearch';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
          Dazlng
        </Link>
        
        <div className="flex-1 max-w-2xl mx-8">
          <NodeSearch />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <ChevronDownIcon className={`w-4 h-4 text-gray-600 dark:text-gray-300 transform transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
              {/* Mode sombre/clair */}
              <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">Mode sombre</span>
                  <div className="flex items-center space-x-2">
                    <SunIcon className="w-5 h-5 text-yellow-500" />
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                    >
                      <span
                        className={`${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
              </div>

              {/* Langue */}
              <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">Langue</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">FR</span>
                    <button
                      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                    >
                      <span
                        className={`${
                          language === 'en' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">EN</span>
                  </div>
                </div>
              </div>

              {/* Devise */}
              <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 dark:text-white">Devise</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">BTC</span>
                    <button
                      onClick={() => setCurrency(currency === 'btc' ? 'sats' : 'btc')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
                    >
                      <span
                        className={`${
                          currency === 'sats' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">SATS</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 