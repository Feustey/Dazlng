import fr from "./locales/fr.json";
import en from "./locales/en.json";

type TranslationKeys = Record<string, any>;

function getAllKeys(obj: TranslationKeys, prefix = ""): string[] {
  return Object.keys(obj).reduce((keys: string[], key: string) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      return [...keys, ...getAllKeys(value, newKey)];
    }

    return [...keys, newKey];
  }, []);
}

function compareTranslations() {
  const frKeys = new Set(getAllKeys(fr));
  const enKeys = new Set(getAllKeys(en));

  const missingInFr = [...enKeys].filter((key) => !frKeys.has(key));
  const missingInEn = [...frKeys].filter((key) => !enKeys.has(key));

  if (missingInFr.length > 0) {
    console.error("Keys missing in French translation:", missingInFr);
  }

  if (missingInEn.length > 0) {
    console.error("Keys missing in English translation:", missingInEn);
  }

  return missingInFr.length === 0 && missingInEn.length === 0;
}

export function validateTranslations() {
  const isValid = compareTranslations();

  if (!isValid) {
    throw new Error(
      "Translation validation failed. Check console for details."
    );
  }

  console.log("All translations are valid!");
  return true;
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateTranslations();
}
