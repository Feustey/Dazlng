"use client";

import { useTranslations, useLocale } from "next-intl";

/**
 * Hook personnalisé pour gérer les traductions avec next-intl
 * @param namespace Namespace optionnel pour les traductions
 * @returns Object avec la fonction t pour traduire
 */
export function useTranslation(namespace: string = "common") {
  const t = useTranslations(namespace);
  const locale = useLocale();

  return {
    t,
    locale,
    changeLocale: async (newLocale: string) => {
      // Implémentation à ajouter si nécessaire
    },
  };
}
