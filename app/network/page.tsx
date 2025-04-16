"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card } from "@/components/ui/card";
import { LineChart, PieChart } from "@/components/ui/charts";
import { formatNumber } from "@/lib/utils";
import {
  NetworkStats,
  getNetworkStats,
  getHistoricalData,
} from "@/services/network";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Données par défaut (à utiliser en cas d'erreur ou pendant le chargement)
const defaultStats: NetworkStats = {
  totalNodes: 15000,
  totalChannels: 75000,
  totalCapacity: 1000.5,
  capacityHistory: [
    { date: "2024-01", value: 800 },
    { date: "2024-02", value: 850 },
    { date: "2024-03", value: 900 },
    { date: "2024-04", value: 950 },
    { date: "2024-05", value: 1000.5 },
  ],
  nodesByCountry: [
    { country: "US", count: 4500 },
    { country: "DE", count: 2800 },
    { country: "FR", count: 1500 },
    { country: "GB", count: 1200 },
    { country: "JP", count: 900 },
    { country: "CA", count: 800 },
    { country: "AU", count: 700 },
    { country: "BR", count: 600 },
    { country: "SG", count: 500 },
  ],
};

type Period = "1d" | "1w" | "1m" | "1y";

export default function NetworkPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<NetworkStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1m");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [networkStats, historicalData] = await Promise.all([
          getNetworkStats(),
          getHistoricalData(selectedPeriod),
        ]);

        setStats({
          ...networkStats,
          capacityHistory: historicalData,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching network data:", err);
        setError(t("Network.error.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t("Network.loading")}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold">{t("Network.title")}</h1>
        <p className="text-muted-foreground">{t("Network.subtitle")}</p>
        {stats.lastUpdate && (
          <p className="text-sm text-muted-foreground">
            {t("Network.lastUpdate", {
              date: new Date(stats.lastUpdate).toLocaleString(),
            })}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">
            {t("Network.totalNodes")}
          </h3>
          <p className="text-3xl font-bold">{formatNumber(stats.totalNodes)}</p>
          <p className="text-sm text-muted-foreground">
            {t("Network.avgChannelsPerNode", {
              count: (stats.totalChannels / stats.totalNodes).toFixed(1),
            })}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">
            {t("Network.totalChannels")}
          </h3>
          <p className="text-3xl font-bold">
            {formatNumber(stats.totalChannels)}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("Network.channels")}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">
            {t("Network.totalCapacity")}
          </h3>
          <p className="text-3xl font-bold">
            {stats.totalCapacity.toFixed(1)} BTC
          </p>
          <p className="text-sm text-muted-foreground">
            {t("Network.capacityPerChannel", {
              amount:
                (
                  (stats.totalCapacity * 100000000) /
                  stats.totalChannels
                ).toFixed(0) + " sats",
            })}
          </p>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              {t("Network.capacityHistory")}
            </h3>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as Period)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Network.selectPeriod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">{t("Network.period.day")}</SelectItem>
                <SelectItem value="1w">{t("Network.period.week")}</SelectItem>
                <SelectItem value="1m">{t("Network.period.month")}</SelectItem>
                <SelectItem value="1y">{t("Network.period.year")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LineChart
            data={stats.capacityHistory}
            xKey="date"
            yKey="value"
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">
            {t("Network.nodesByCountry")}
          </h3>
          <PieChart
            data={stats.nodesByCountry}
            nameKey="country"
            valueKey="count"
            height={300}
          />
        </Card>
      </div>
    </div>
  );
}
