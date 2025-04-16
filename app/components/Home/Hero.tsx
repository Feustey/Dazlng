"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MoveUp, Zap, Activity, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber, formatSats } from "@/utils/format";

interface NetworkStats {
  network_summary: {
    total_nodes: number;
    active_nodes: number;
    total_channels: number;
    active_channels: number;
    total_capacity: number;
  };
  daily_volume: number;
  monitored_channels: number;
  revenue_growth: number;
}

export default function Hero() {
  const t = useTranslations("Home");
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/network/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch network stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Statistiques par défaut au cas où l'API échoue
  const defaultStats = {
    monitored_channels: 50000,
    daily_volume: 450000000,
    active_nodes: 17500,
    revenue_growth: 12.5,
  };

  // Métriques à afficher
  const statItems = [
    {
      label: t("stats.monitoredChannels"),
      value: stats?.monitored_channels || defaultStats.monitored_channels,
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      formatter: formatNumber,
    },
    {
      label: t("stats.dailyVolume"),
      value: stats?.daily_volume || defaultStats.daily_volume,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      formatter: (val: number) => formatSats(val),
    },
    {
      label: t("stats.activeNodes"),
      value: stats?.network_summary?.active_nodes || defaultStats.active_nodes,
      icon: <Coins className="w-6 h-6 text-purple-400" />,
      formatter: formatNumber,
    },
    {
      label: t("stats.revenueGrowth"),
      value: stats?.revenue_growth || defaultStats.revenue_growth,
      icon: <MoveUp className="w-6 h-6 text-green-400" />,
      formatter: (val: number) => `+${val}%`,
    },
  ];

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-purple-950">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-coral-400 bg-clip-text text-transparent">
          {t("hero.title")}
        </h1>
        <p className="text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/get-started">{t("hero.cta.primary")} →</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/learn">{t("hero.cta.secondary")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-opacity-20 bg-blue-900 p-6 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h3 className="text-xl font-bold text-blue-400">
                  {item.label}
                </h3>
              </div>
              <p className="text-4xl font-bold">
                {loading ? (
                  <span className="animate-pulse bg-blue-400/20 h-10 w-24 inline-block rounded"></span>
                ) : (
                  item.formatter(item.value)
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
