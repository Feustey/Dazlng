import { useTranslations } from 'next-intl';
import { useMemo, useCallback } from 'react';

interface TranslationOptions {
  fallback?: string;
  values?: Record<string, any>;
}

interface AdvancedTranslationHook {
  t: (key: string, options?: TranslationOptions) => string;
  tRaw: ReturnType<typeof useTranslations>;
  hasKey: (key: string) => boolean;
}

/**
 * Hook de traduction avancé avec gestion des erreurs et fallbacks
 * @param namespace - Le namespace de traduction (ex: 'common', 'home')
 * @returns Un objet avec les fonctions de traduction
 */
export function useAdvancedTranslation(namespace: string): AdvancedTranslationHook {
  const tRaw = useTranslations(namespace);
  
  const t = useCallback((key: string, options: TranslationOptions = {}) => {
    const { fallback, values } = options;
    
    try {
      return tRaw(key, values);
    } catch (error) {
      // Log l'erreur en développement
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🌐 Translation key missing: ${namespace}.${key}`, {
          fallback,
          values,
          error
        });
      }
      
      // Retourner le fallback ou la clé
      return fallback || key;
    }
  }, [tRaw, namespace]);
  
  const hasKey = useCallback((key: string): boolean => {
    try {
      tRaw(key);
      return true;
    } catch {
      return false;
    }
  }, [tRaw]);
  
  return useMemo(() => ({
    t,
    tRaw,
    hasKey
  }), [t, tRaw, hasKey]);
}

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
    const dateObj = typeof date === 'string' ? new Date(date) : date;
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