import React from 'react';
import { formatSatsPrice } from '../../../utils/formatters';

interface PriceDisplayProps {
  /** Prix en satoshis */
  sats: number;
  /** Classe CSS personnalisée */
  className?: string;
  /** Taille d'affichage */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Couleur du prix */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Afficher l'unité "sats" */
  showUnit?: boolean;
  /** Afficher le prix comme "gratuit" si 0 */
  showFreeLabel?: boolean;
  /** Période (ex: /mois, /an) */
  period?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  sats,
  className = '',
  size = 'md',
  color = 'default',
  showUnit = true,
  showFreeLabel = true,
  period
}) => {
  // Styles selon la taille
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl font-bold'
  };

  // Styles selon la couleur
  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-indigo-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  // Affichage gratuit
  if (sats === 0 && showFreeLabel) {
    return (
      <span className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
        Gratuit{period ? period : ''}
      </span>
    );
  }

  // Formatage du prix
  const formattedPrice = formatSatsPrice(sats, showUnit);

  return (
    <span className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      {formattedPrice}{period ? period : ''}
    </span>
  );
};

export default PriceDisplay;

// Composant spécialisé pour les plans d'abonnement
interface SubscriptionPriceProps {
  /** Prix mensuel en satoshis */
  monthlyPrice: number;
  /** Prix annuel en satoshis (optionnel) */
  yearlyPrice?: number;
  /** Période sélectionnée */
  billingCycle: 'monthly' | 'yearly';
  /** Classe CSS */
  className?: string;
  /** Taille */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SubscriptionPrice: React.FC<SubscriptionPriceProps> = ({
  monthlyPrice,
  yearlyPrice,
  billingCycle,
  className = '',
  size = 'xl'
}) => {
  const currentPrice = billingCycle === 'yearly' && yearlyPrice ? yearlyPrice : monthlyPrice;
  const period = billingCycle === 'yearly' ? '/an' : '/mois';
  
  const savings = yearlyPrice && billingCycle === 'yearly' 
    ? monthlyPrice * 12 - yearlyPrice 
    : 0;

  return (
    <div className={className}>
      <PriceDisplay 
        sats={currentPrice}
        size={size}
        color="success"
        period={period}
      />
      {savings > 0 && (
        <div className="text-sm text-green-600 font-semibold mt-1">
          Économisez {formatSatsPrice(savings, true)}/an
        </div>
      )}
    </div>
  );
};

// Composant pour comparer les prix
interface PriceComparisonProps {
  /** Prix original en satoshis */
  originalPrice: number;
  /** Prix avec remise en satoshis */
  discountedPrice: number;
  /** Classe CSS */
  className?: string;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  originalPrice,
  discountedPrice,
  className = ''
}) => {
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PriceDisplay sats={discountedPrice} size="xl" color="success" />
      <div className="text-right">
        <div className="text-lg text-gray-400 line-through">
          <PriceDisplay sats={originalPrice} size="md" color="default" />
        </div>
        <div className="text-sm font-bold text-red-500">
          -{discountPercent}%
        </div>
      </div>
    </div>
  );
}; 