import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction utilitaire pour formater les satoshis en BTC
export function formatBitcoin(sats: number): string {
  return (sats / 100000000).toFixed(8) + " BTC";
}

// Fonction utilitaire pour formater les nombres avec séparateurs de milliers
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
