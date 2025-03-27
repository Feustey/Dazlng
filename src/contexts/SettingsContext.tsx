'use client';

import React, { createContext, useContext, useState } from 'react';

type SettingsContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('btc');

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 