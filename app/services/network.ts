import type { NetworkStats } from "@/types/network";

export type { NetworkStats };

/**
 * Récupère les statistiques globales du réseau via l'API interne.
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  const res = await fetch("/api/network/stats");
  if (!res.ok) {
    throw new Error("HTTP error!");
  }
  return res.json();
}

/**
 * Récupère l'historique de capacité du réseau via l'API interne.
 */
export async function getHistoricalData(period: string): Promise<any> {
  const res = await fetch(`/api/network/movements?period=${period}`);
  if (!res.ok) {
    throw new Error("HTTP error!");
  }
  return res.json();
}
