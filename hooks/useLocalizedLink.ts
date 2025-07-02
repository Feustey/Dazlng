import { useLocale } from 'next-intl';

/**
 * Hook personnalisé pour gérer les liens localisés
 * Ajoute automatiquement le préfixe de locale aux URLs
 */
export const useLocalizedLink = () => {
  const locale = useLocale();
  
  /**
   * Génère une URL localisée
   * @param href - Le chemin sans préfixe de locale
   * @returns L'URL complète avec le préfixe de locale
   */
  const getLocalizedHref = (href: string): string => {
    // Si l'URL commence déjà par un slash, on l'ajoute au locale
    if (href.startsWith('/')) {
      return `/${locale}${href}`;
    }
    // Sinon on ajoute le slash et le locale
    return `/${locale}/${href}`;
  };

  /**
   * Génère les props pour un composant Link de Next.js
   * @param href - Le chemin sans préfixe de locale
   * @returns Les props pour le composant Link
   */
  const getLinkProps = (href: string) => ({
    href,
    locale
  });

  return {
    locale,
    getLocalizedHref,
    getLinkProps
  };
}; 