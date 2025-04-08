"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr,
  en,
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {
    // Cette méthode est implémentée dans le LanguageProvider
    console.warn("setLanguage called before provider initialization");
  },
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "fr";
  const [language, setLanguage] = useState<Language>("fr");

  // Utiliser useEffect pour mettre à jour la langue après le montage du composant
  useEffect(() => {
    setLanguage(currentLocale as Language);
  }, [currentLocale]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
