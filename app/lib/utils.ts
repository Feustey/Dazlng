import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et fusionne les classes CSS avec Tailwind
 * Utilise clsx pour combiner les classes et tailwind-merge pour fusionner les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatSats(sats: number): string {
  const btc = sats / 100000000;
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(btc) + " BTC"
  );
}
