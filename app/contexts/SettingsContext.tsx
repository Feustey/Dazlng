'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  language: 'fr',
  setLanguage: () => {},
  currency: 'btc',
  setCurrency: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('btc');

  return (
    <SettingsContext.Provider value={{ language, setLanguage, currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}; 