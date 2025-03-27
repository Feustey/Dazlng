'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useSettings } from '@/contexts/SettingsContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paramètres - Lightning Manager',
  description: 'Gérez les paramètres de votre application Lightning Manager',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, currency, setCurrency } = useSettings();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Paramètres
      </h1>

      <div className="space-y-6">
        {/* Mode sombre/clair */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Apparence
          </h2>
          <div className="flex items-center justify-between">
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
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
            </span>
          </div>
        </div>

        {/* Langue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Langue
          </h2>
          <div className="flex items-center justify-between">
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
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {language === 'fr' ? 'Français' : 'English'}
            </span>
          </div>
        </div>

        {/* Devise */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Devise
          </h2>
          <div className="flex items-center justify-between">
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
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currency === 'btc' ? 'Bitcoin (BTC)' : 'Satoshis (SATS)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 