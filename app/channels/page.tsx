"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Chart } from "@/app/components/ui/chart";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Skeleton } from "@/app/components/ui/skeleton";

interface ChannelData {
  channelStats: {
    opened: number;
    active: number;
    closed: number;
    pending: number;
  };
  financialMetrics: {
    totalCapacity: number;
    averageCapacity: number;
    totalVolume: number;
    totalFees: number;
  };
  historical: {
    timestamp: string;
    totalCapacity: number;
    activeChannels: number;
    totalVolume: number;
    totalFees: number;
    totalPeers: number;
  }[];
}

interface ChannelsContent {
  title: string;
  stats: {
    opened: string;
    active: string;
    closed: string;
    pending: string;
  };
  metrics: {
    capacity: string;
    volume: string;
    fees: string;
  };
  errors: {
    loadFailed: string;
    noData: string;
  };
  tabs: {
    overview: string;
    analytics: string;
  };
}

const formatNumber = (num: number, language: string) => {
  return new Intl.NumberFormat(language, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatCurrency = (num: number, language: string) => {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
};

export default function ChannelsPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<ChannelData | null>(null);
  const [content, setContent] = useState<ChannelsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dataResponse, contentResponse] = await Promise.all([
          fetch("/api/channels"),
          fetch(`/locale/channels/${language}.json`),
        ]);

        if (!dataResponse.ok || !contentResponse.ok) {
          throw new Error("Failed to load data");
        }

        const [data, content] = await Promise.all([
          dataResponse.json(),
          contentResponse.json(),
        ]);

        setData(data);
        setContent(content);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : content?.errors.loadFailed || "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!data || !content)
    return <div>{content?.errors.noData || "Aucune donnée disponible"}</div>;

  const capacityChartData = {
    labels: data.historical.map((h) =>
      new Date(h.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Capacité totale",
        data: data.historical.map((h) => h.totalCapacity),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const channelsChartData = {
    labels: data.historical.map((h) =>
      new Date(h.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Canaux actifs",
        data: data.historical.map((h) => h.activeChannels),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">{content.tabs.overview}</TabsTrigger>
          <TabsTrigger value="analytics">{content.tabs.analytics}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.stats.opened}
              </h3>
              <p className="text-2xl font-bold">
                {formatNumber(data.channelStats.opened, language)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.stats.active}
              </h3>
              <p className="text-2xl font-bold">
                {formatNumber(data.channelStats.active, language)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.stats.closed}
              </h3>
              <p className="text-2xl font-bold">
                {formatNumber(data.channelStats.closed, language)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.stats.pending}
              </h3>
              <p className="text-2xl font-bold">
                {formatNumber(data.channelStats.pending, language)}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.metrics.capacity}
              </h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.financialMetrics.totalCapacity, language)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.metrics.volume}
              </h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.financialMetrics.totalVolume, language)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.metrics.fees}
              </h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.financialMetrics.totalFees, language)}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Évolution de la capacité
            </h3>
            <Chart data={capacityChartData} />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Évolution des canaux actifs
            </h3>
            <Chart data={channelsChartData} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
