import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBitcoin(sats: number, showAsBtc: boolean = false): string {
  if (showAsBtc) {
    return `${(sats / 100000000).toFixed(8)} BTC`;
  }
  return `${sats.toLocaleString()} sats`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
} 