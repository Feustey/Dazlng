"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Chart } from "@/app/components/ui/chart";
import { formatBitcoin, formatNumber } from "../lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useLanguage } from "../contexts/LanguageContext";
import { ChartData } from "chart.js";

interface HistoricalDataPoint {
  timestamp: string;
  totalCapacity: number;
  activeChannels: number;
  totalVolume: number;
  totalFees: number;
  totalPeers: number;
}

interface ReviewData {
  nodeInfo: {
    pubkey: string;
    alias: string;
    color: string;
    platform: string;
    version: string;
    address: string;
  };
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
  feeRates: {
    average: number;
    baseRate: number;
    ppm: number;
  };
  networkMetrics: {
    totalPeers: number;
    uptime: number;
    lastUpdate: string;
  };
  historical: HistoricalDataPoint[];
}

interface ReviewContent {
  title: string;
  tabs: {
    overview: string;
    channels: string;
    financial: string;
    network: string;
  };
  labels: {
    capacity: string;
    channels: string;
    volume: string;
    fees: string;
    peers: string;
  };
}

export default function ReviewPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<ReviewData | null>(null);
  const [content, setContent] = useState<ReviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformChartData = (
    data: HistoricalDataPoint[],
    key: keyof HistoricalDataPoint,
    title: string
  ): ChartData<"line"> => {
    return {
      labels: data.map((d) => new Date(d.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: title,
          data: data.map((d) => Number(d[key])),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [dataResponse, contentResponse] = await Promise.all([
          fetch("/api/review"),
          fetch(`/locale/review/${language}.json`),
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
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [language]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!data || !content) return <div>Aucune donnée disponible</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{content.tabs.overview}</TabsTrigger>
          <TabsTrigger value="channels">{content.tabs.channels}</TabsTrigger>
          <TabsTrigger value="financial">{content.tabs.financial}</TabsTrigger>
          <TabsTrigger value="network">{content.tabs.network}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.labels.capacity}
              </h3>
              <p className="text-2xl font-bold">
                {formatBitcoin(data.financialMetrics.totalCapacity)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.labels.channels}
              </h3>
              <p className="text-2xl font-bold">{data.channelStats.active}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.labels.volume}
              </h3>
              <p className="text-2xl font-bold">
                {formatBitcoin(data.financialMetrics.totalVolume)}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {content.labels.fees}
              </h3>
              <p className="text-2xl font-bold">
                {formatBitcoin(data.financialMetrics.totalFees)}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="p-4">
            <Chart
              data={transformChartData(
                data.historical,
                "activeChannels",
                content.labels.channels
              )}
            />
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="p-4">
            <Chart
              data={transformChartData(
                data.historical,
                "totalVolume",
                content.labels.volume
              )}
            />
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="p-4">
            <Chart
              data={transformChartData(
                data.historical,
                "totalPeers",
                content.labels.peers
              )}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
