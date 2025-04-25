"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { locales, defaultLocale } from "../i18n.config.base";

export function useLocale() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    // Détection de la langue depuis le navigateur
    const browserLanguage = navigator.language.split("-")[0];

    // Vérifier si la langue du navigateur est supportée, sinon utiliser la langue par défaut
    if (locales.includes(browserLanguage as any)) {
      setLocale(browserLanguage);
    }

    // Vérifier si la langue est déjà dans l'URL
    // Format attendu: /xx/... où xx est le code de langue
    const pathSegments = pathname?.split("/") || [];
    if (pathSegments.length > 1 && locales.includes(pathSegments[1] as any)) {
      setLocale(pathSegments[1]);
    }
  }, [pathname]);

  const changeLocale = (newLocale: string) => {
    if (locales.includes(newLocale as any)) {
      setLocale(newLocale);
    }
  };

  return { locale, changeLocale };
}
