import { useTranslations } from "next-intl";

type TranslationKey = string;

export function useTranslation() {
  const t = useTranslations();

  const translate = (
    key: TranslationKey,
    params?: Record<string, string | number>
  ) => {
    try {
      return t(key, params);
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
