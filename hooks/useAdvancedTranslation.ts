import { useTranslations } from "next-intl";
import { useMemo, useCallback } from "react";

interface TranslationOptions {
  fallback?: string;
  variables?: Record<string, any>;
}

interface AdvancedTranslationHook {
  t: (key: string, options?: TranslationOptions) => string;
  tRaw: ReturnType<typeof useTranslations>;
  hasKey: (key: string) => boolean;
}

/**
 * Hook de traduction avancé avec gestion des erreurs et fallbacks
 * @param namespace - Le namespace de traduction (ex: "commo\n, "home")
 * @returns Un objet avec les fonctions de traduction
 */
export const useAdvancedTranslation = (namespace: string): AdvancedTranslationHook => {
  const t = useTranslations(namespace);

  const translate = useCallback((key: string, options?: TranslationOptions) => {
    try {
      let translation = t(key);
      
      if (options?.variables) {
        Object.entries(options.variables).forEach(([key, value]) => {
          translation = translation.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation key "${key}" not found in namespace "${namespace}"`);
      return options?.fallback || key;
    }
  }, [t, namespace]);

  const hasKey = useCallback((key: string): boolean => {
    try {
      t(key);
      return true;
    } catch {
      return false;
    }
  }, [t]);
  
  return useMemo(() => ({
    t: translate,
    tRaw: t,
    hasKey
  }), [translate, t, hasKey]);
};

/**
 * Hook pour les traductions avec gestion des pluriels
 * @param namespace - Le namespace de traduction
 * @returns Fonction de traduction avec support des pluriels
 */
export function usePluralTranslation(namespace: string) {
  const { t } = useAdvancedTranslation(namespace);
  
  const plural = useCallback((
    key: string,
    count: number,
    options?: Omit<TranslationOptions, 'values'>
  ) => {
    const pluralKey = count === 1 ? `${key}.one` : `${key}.other`;
    return t(pluralKey, {
      ...options,
      values: { count }
    });
  }, [t]);
  
  return { t, plural };
}

/**
 * Hook pour les traductions avec formatage de dates
 * @param namespace - Le namespace de traduction
 * @returns Fonction de traduction avec formatage de dates
 */
export function useDateTranslation(namespace: string) {
  const { t } = useAdvancedTranslation(namespace);
  
  const formatDate = useCallback((
    key: string,
    date: Date | string,
    options?: Omit<TranslationOptions, 'values'>
  ) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return t(key, {
      ...options,
      values: { 
        date: dateObj,
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate()
      }
    });
  }, [t]);
  
  return { t, formatDate };
}

/**
 * Hook pour les traductions avec formatage de nombres
 * @param namespace - Le namespace de traduction
 * @returns Fonction de traduction avec formatage de nombres
 */
export function useNumberTranslation(namespace: string) {
  const { t } = useAdvancedTranslation(namespace);
  
  const formatNumber = useCallback((
    key: string,
    number: number,
    options?: Omit<TranslationOptions, 'values'>
  ) => {
    return t(key, {
      ...options,
      values: { 
        number,
        formatted: new Intl.NumberFormat().format(number)
      }
    });
  }, [t]);
  
  return { t, formatNumber };
}