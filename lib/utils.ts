import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBitcoin(sats: number): string {
  return `₿ ${(sats / 100000000).toFixed(8)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}