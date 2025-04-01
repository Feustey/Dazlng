"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Dictionnaires de traduction simplifiés
const translations: Record<Language, Record<string, string>> = {
  fr: {
    "header.home": "Accueil",
    "header.actions": "Actions",
    "header.messages": "Messages",
    "header.settings": "Paramètres",
    "settings.darkMode": "Mode sombre",
    "settings.language": "Langue",
    "settings.currency": "Devise",
  },
  en: {
    "header.home": "Home",
    "header.actions": "Actions",
    "header.messages": "Messages",
    "header.settings": "Settings",
    "settings.darkMode": "Dark Mode",
    "settings.language": "Language",
    "settings.currency": "Currency",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
