import React from 'react';
import { useAdvancedTranslation } from '@/hooks/useAdvancedTranslation';

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
 * @param namespace - Namespace de traduction (défaut: 'common')
 * @param fallback - Texte de fallback si la traduction est manquante
 * @param values - Variables d'interpolation
 * @param className - Classes CSS
 * @param as - Élément HTML à utiliser (défaut: 'span')
 * @param children - Contenu enfant (optionnel)
 */
export const LocalizedText: React.FC<LocalizedTextProps> = ({
  id,
  namespace = 'common',
  fallback,
  values,
  className,
  as: Component = 'span',
  children
}) => {
  const { t, hasKey } = useAdvancedTranslation(namespace);
  
  // Si des enfants sont fournis, les convertir en string pour le fallback
  const effectiveFallback = children ? String(children) : fallback || id;
  
  // Vérifier si la clé existe
  const keyExists = hasKey(id);
  
  // Obtenir la traduction
  const text = t(id, { fallback: effectiveFallback, values });
  
  // Avertissement en développement si la clé n'existe pas
  if (process.env.NODE_ENV === 'development' && !keyExists) {
    console.warn(`🌐 Missing translation key: ${namespace}.${id}`, {
      fallback: effectiveFallback,
      values
    });
  }
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
};

/**
 * Composant pour les traductions avec gestion des pluriels
 */
interface LocalizedPluralTextProps extends Omit<LocalizedTextProps, 'id'> {
  id: string;
  count: number;
}

export const LocalizedPluralText: React.FC<LocalizedPluralTextProps> = ({
  id,
  count,
  namespace = 'common',
  fallback,
  values,
  className,
  as: Component = 'span'
}) => {
  const { t } = useAdvancedTranslation(namespace);
  
  const pluralKey = count === 1 ? `${id}.one` : `${id}.other`;
  const effectiveFallback = fallback || `${count} ${id}`;
  
  const text = t(pluralKey, { 
    fallback: effectiveFallback, 
    values: { ...values, count } 
  });
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
};

/**
 * Composant pour les traductions avec formatage de dates
 */
interface LocalizedDateTextProps extends Omit<LocalizedTextProps, 'id' | 'values'> {
  id: string;
  date: Date | string;
  format?: 'short' | 'long' | 'relative';
}

export const LocalizedDateText: React.FC<LocalizedDateTextProps> = ({
  id,
  date,
  format = 'short',
  namespace = 'common',
  fallback,
  className,
  as: Component = 'span'
}) => {
  const { t } = useAdvancedTranslation(namespace);
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dateKey = `${id}.${format}`;
  
  const effectiveFallback = fallback || dateObj.toLocaleDateString();
  
  const text = t(dateKey, {
    fallback: effectiveFallback,
    values: {
      date: dateObj,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
      formatted: dateObj.toLocaleDateString()
    }
  });
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
};

/**
 * Composant pour les traductions avec formatage de nombres
 */
interface LocalizedNumberTextProps extends Omit<LocalizedTextProps, 'id' | 'values'> {
  id: string;
  number: number;
  format?: 'decimal' | 'currency' | 'percent';
  currency?: string;
}

export const LocalizedNumberText: React.FC<LocalizedNumberTextProps> = ({
  id,
  number,
  format = 'decimal',
  currency = 'EUR',
  namespace = 'common',
  fallback,
  className,
  as: Component = 'span'
}) => {
  const { t } = useAdvancedTranslation(namespace);
  
  const numberKey = `${id}.${format}`;
  
  let formattedNumber: string;
  switch (format) {
    case 'currency':
      formattedNumber = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency
      }).format(number);
      break;
    case 'percent':
      formattedNumber = new Intl.NumberFormat('fr-FR', {
        style: 'percent'
      }).format(number / 100);
      break;
    default:
      formattedNumber = new Intl.NumberFormat('fr-FR').format(number);
  }
  
  const effectiveFallback = fallback || formattedNumber;
  
  const text = t(numberKey, {
    fallback: effectiveFallback,
    values: {
      number,
      formatted: formattedNumber,
      currency
    }
  });
  
  return (
    <Component className={className}>
      {text}
    </Component>
  );
}; 