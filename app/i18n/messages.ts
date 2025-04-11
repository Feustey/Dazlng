import fr from "./locales/fr.json";
import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";

export const messages = {
  fr,
  en,
  de,
  es,
};

export type Locale = keyof typeof messages;
