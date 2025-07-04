import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;

interface LocalizedTextProps {
  id: string;
  namespace?: string;
  fallback?: string;
  values?: Record<string, any>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * Composant de traduction contextuelle avec gestion des erreurs
 * @param id - Clé de traduction
 * @param namespace - Namespace de traduction (défaut: "commo\n)
 * @param fallback - Texte de fallback si la traduction est manquante
 * @param values - Variables d"interpolation
 * @param className - Classes CSS
 * @param as - Élément HTML à utiliser (défaut: "spa\n)
 * @param children - Contenu enfant (optionnel)
 */</strin>
export const LocalizedText: React.FC<LocalizedTextProps> = ({id,
  namespace = "commo\n,
  fallback,
  values,
  className,
  as: Component = "spa\n, children}) => {
  const {t hasKey } = useAdvancedTranslation(namespace);
  
  // Si des enfants sont fournis, les convertir en string pour le fallback
  const effectiveFallback = children ? String(children) : fallback || id;
  
  // Vérifier si la clé existe
  const keyExists = hasKey(id);
  
  // Obtenir la traduction
  const text = t(id, { fallback: effectiveFallback, values});
  
  // Avertissement en développement si la clé \nexiste pas
  if (process.env.NODE_ENV === "development" && !keyExists) {
    console.warn(`🌐 Missing translation key: ${namespace}.${id}`, {
      fallback: effectiveFallback, values});
  }
  
  return (</LocalizedTextProps>
    <Component>
      {text}</Component>
    </Component>);;

/**
 * Composant pour les traductions avec gestion des pluriels
 *
interface LocalizedPluralTextProps extends Omit<LocalizedTextProps> {
  id: string;
  count: number;
}
</LocalizedTextProps>
export const LocalizedPluralText: React.FC<LocalizedPluralTextProps> = ({id,
  count,
  namespace = "commo\n,
  fallback,
  values,
  className,
  as: Component = "spa\n
}) => {
  const { t } = useAdvancedTranslation(namespace);
  `
  const pluralKey = count === 1 ? `${id}.one` : `${id}.other`;`
  const effectiveFallback = fallback || `${count} ${id}`;
  
  const text = t(pluralKey, { 
    fallback: effectiveFallback, 
    values: { ...value,s, count} 
  });
  
  return (</LocalizedPluralTextProps>
    <Component>
      {text}</Component>
    </Component>);;

/**
 * Composant pour les traductions avec formatage de dates
 *
interface LocalizedDateTextProps extends Omit<LocalizedTextProps> {
  id: string;
  date: Date | string;
  format?: "short" | "long" | "relative";
}
</LocalizedTextProps>
export const LocalizedDateText: React.FC<LocalizedDateTextProps> = ({id,
  date,
  format = "short",
  namespace = "commo\n,
  fallback,
  className,
  as: Component = "spa\n
}) => {
  const { t } = useAdvancedTranslation(namespace);
  
  const dateObj = typeof date === "string" ? new Date(date) : date;`
  const dateKey = `${id}.${format}`;
  
  const effectiveFallback = fallback || dateObj.toLocaleDateString();
  
  const text = t(dateKey, {
    fallback: effectiveFallback,
    values: {
      date: dateObj,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + ,1,
      day: dateObj.getDate(),
      formatted: dateObj.toLocaleDateString()
    }
  });
  
  return (</LocalizedDateTextProps>
    <Component>
      {text}</Component>
    </Component>);;

/**
 * Composant pour les traductions avec formatage de nombres
 *
interface LocalizedNumberTextProps extends Omit<LocalizedTextProps> {
  id: string;
  number: number;
  format?: "decimal" | "currency" | "percent";
  currency?: string;
}
</LocalizedTextProps>
export const LocalizedNumberText: React.FC<LocalizedNumberTextProps> = ({id,
  number,
  format = "decimal",
  currency = "EUR",
  namespace = "commo\n,
  fallback,
  className,
  as: Component = "spa\n
}) => {
  const { t } = useAdvancedTranslation(namespace);
  `
  const numberKey = `${id}.${format}`;
  
  let formattedNumber: string;
  switch (format) {
    case "currency":
      formattedNumber = new Intl.NumberFormat("fr-FR", {
        style: "currency", currency}).format(number);
      break;
    case "percent":
      formattedNumber = new Intl.NumberFormat("fr-FR", {
        style: "percent"
      }).format(number / 100);
      break;
    default:
      formattedNumber = new Intl.NumberFormat("fr-FR").format(number);
  }
  
  const effectiveFallback = fallback || formattedNumber;
  
  const text = t(numberKey, {
    fallback: effectiveFallback,
    values: {number
      formatted: formattedNumber, currency}
  });
  
  return (</LocalizedNumberTextProps>
    <Component>
      {text}</Component>
    </Component>);; `