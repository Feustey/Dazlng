import { useTranslations } from "next-intl";

type TranslationKey = string;

interface TranslateOptions {
  fallback?: any;
}

export function useTranslation() {
  const t = useTranslations();

  const translate = (
    key: TranslationKey,
    options?: TranslateOptions | Record<string, string | number>
  ) => {
    try {
      // Si options contient fallback, c'est le nouveau format
      if (options && "fallback" in options) {
        try {
          return t(key);
        } catch (error) {
          return options.fallback;
        }
      }
      // Sinon c'est l'ancien format avec params
      return t(key, options as Record<string, string | number>);
    } catch (error) {
      console.error(`Translation key not found: ${key}`);
      return key;
    }
  };

  return {
    t: translate,
  };
}

// Exemple d'utilisation:
// const { t } = useTranslation();
// t('common.buttons.save')
// t('pages.home.title')
// t('errors.system.unknown')
// t('list.items', { fallback: [] }) // Pour les listes avec fallback
