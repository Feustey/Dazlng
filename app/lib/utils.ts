import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBitcoin(sats: number, asBtc: boolean = false): string {
  if (asBtc) {
    return `₿ ${(sats / 100000000).toFixed(8)}`;
  }
  return `${new Intl.NumberFormat().format(sats)} sats`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
