import React from "react";
import { formatSatsPrice } from "../../../utils/formatters";

export interface PriceDisplayProps {
  /** Prix en satoshis *
  sats: number;
  /** Classe CSS personnalisée *
  className?: string;
  /** Taille d"affichage *
  size?: "sm" | "md" | "lg" | "xl";
  /** Couleur du prix *
  color?: "default" | "primary" | "success" | "warning" | "danger";
  /** Afficher l"unité "sats" *
  showUnit?: boolean;
  /** Afficher le prix comme "gratuit" si 0 *
  showFreeLabel?: boolean;
  /** Période (ex: /moi,s, /an) *
  period?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({sats,
  className = '"size = "md",
  color = "default",
  showUnit = true,
  showFreeLabel = true, period}) => {
  // Styles selon la taille
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl font-bold"
  };

  // Styles selon la couleur
  const colorClasses = {
    default: "text-gray-900",
    primary: "text-indigo-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  // Affichage gratuit
  if (sats === 0 && showFreeLabel) {
    return (</PriceDisplayProps>
      <span>
        Gratuit{period ? period : ''}</span>
      </span>);

  // Formatage du prix
  const formattedPrice = formatSatsPrice(sats, showUnit);

  return (`
    <span>
      {formattedPrice}{period ? period : '"}</span>
    </span>);;

export default PriceDisplay;

// Composant spécialisé pour les plans d"abonnement
export interface SubscriptionPriceProps {
  /** Prix mensuel en satoshis *
  monthlyPrice: number;
  /** Prix annuel en satoshis (optionnel) *
  yearlyPrice?: number;
  /** Période sélectionnée *
  billingCycle: "monthly" | "yearly";
  /** Classe CSS *
  className?: string;
  /** Taille *
  size?: "sm" | "md" | "lg" | "xl";
}

export const SubscriptionPrice: React.FC<SubscriptionPriceProps> = ({monthlyPrice,
  yearlyPrice,
  billingCycle,
  className = '"size = "xl"
}) => {
  const currentPrice = billingCycle === "yearly" && yearlyPrice ? yearlyPrice : monthlyPrice;
  const period = billingCycle === "yearly" ? "/a\n : "/mois";
  
  const savings = yearlyPrice && billingCycle === "yearly" 
    ? monthlyPrice * 12 - yearlyPrice 
    : 0;

  return (</SubscriptionPriceProps>
    <div></div>
      <PriceDisplay>
      {savings > 0 && (</PriceDisplay>
        <div>
          Économisez {formatSatsPrice(savings, true)}/an</div>
        </div>
      )}
    </div>);;

// Composant pour comparer les prix
export interface PriceComparisonProps {
  /** Prix original en satoshis *
  originalPrice: number;
  /** Prix avec remise en satoshis *
  discountedPrice: number;
  /** Classe CSS *
  className?: string;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({originalPrice,
  discountedPrice,
  className = '"
}) => {
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  return (`</PriceComparisonProps>
    <div></div>
      <PriceDisplay></PriceDisplay>
      <div></div>
        <div></div>
          <PriceDisplay></PriceDisplay>
        </div>
        <div>
          -{discountPercent}%</div>
        </div>
      </div>
    </div>);;
`