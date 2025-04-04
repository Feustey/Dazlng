"use client";

import * as React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface SettingsContextType {
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  language: "fr",
  setLanguage: () => {
    // Cette méthode est implémentée dans le SettingsProvider
    console.warn("setLanguage called before provider initialization");
  },
  currency: "btc",
  setCurrency: () => {
    // Cette méthode est implémentée dans le SettingsProvider
    console.warn("setCurrency called before provider initialization");
  },
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "fr";

  const [language, setLanguage] = useState("fr");
  const [currency, setCurrency] = useState("btc");

  // Utiliser useEffect pour mettre à jour la langue après le montage du composant
  useEffect(() => {
    setLanguage(currentLocale);
  }, [currentLocale]);

  return (
    <SettingsContext.Provider
      value={{ language, setLanguage, currency, setCurrency }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
