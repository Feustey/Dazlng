"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NetworkData {
  timestamp: string;
  totalNodes: number;
  activeNodes: number;
  totalChannels: number;
  activeChannels: number;
  totalCapacity: number;
  averageChannelCapacity: number;
  averageNodeCapacity: number;
  networkHealth: number;
}

interface CentralityData {
  nodeId: string;
  alias: string;
  betweenness: number;
  closeness: number;
  degree: number;
  eigenvector: number;
}

export default function NetworkPage() {
  const t = useTranslations("Network");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<NetworkData[]>([]);
  const [centralityData, setCentralityData] = useState<CentralityData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historicalResponse, centralityResponse] = await Promise.all([
          fetch("/api/network/history"),
          fetch("/api/network/centralities"),
        ]);

        if (!historicalResponse.ok || !centralityResponse.ok) {
          throw new Error("Failed to fetch network data");
        }

        const [historicalData, centralityData] = await Promise.all([
          historicalResponse.json(),
          centralityResponse.json(),
        ]);

        setHistoricalData(historicalData);
        setCentralityData(centralityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCapacity = (sats: number) => {
    const btc = sats / 100000000;
    return `${btc.toFixed(2)} BTC`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="centrality">{t("tabs.centrality")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.nodes.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatDate}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(value: number) => formatNumber(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalNodes"
                      name={t("charts.nodes.total")}
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="activeNodes"
                      name={t("charts.nodes.active")}
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("charts.capacity.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatDate}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(value: number) => formatCapacity(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalCapacity"
                      name={t("charts.capacity.total")}
                      stroke="#8884d8"
                    />
                    <Line
                      type="monotone"
                      dataKey="averageChannelCapacity"
                      name={t("charts.capacity.averageChannel")}
                      stroke="#82ca9d"
                    />
                    <Line
                      type="monotone"
                      dataKey="averageNodeCapacity"
                      name={t("charts.capacity.averageNode")}
                      stroke="#ffc658"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centrality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("centrality.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">{t("centrality.alias")}</th>
                      <th className="text-right p-2">
                        {t("centrality.betweenness")}
                      </th>
                      <th className="text-right p-2">
                        {t("centrality.closeness")}
                      </th>
                      <th className="text-right p-2">
                        {t("centrality.degree")}
                      </th>
                      <th className="text-right p-2">
                        {t("centrality.eigenvector")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {centralityData.map((node) => (
                      <tr key={node.nodeId} className="border-t">
                        <td className="p-2">{node.alias}</td>
                        <td className="text-right p-2">
                          {node.betweenness.toFixed(4)}
                        </td>
                        <td className="text-right p-2">
                          {node.closeness.toFixed(4)}
                        </td>
                        <td className="text-right p-2">{node.degree}</td>
                        <td className="text-right p-2">
                          {node.eigenvector.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
