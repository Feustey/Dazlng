"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface NodeMetrics {
  uptime: number;
  totalChannels: number;
  activeChannels: number;
  totalCapacity: number;
  incomingCapacity: number;
  outgoingCapacity: number;
  totalTransactions: number;
  successRate: number;
  averageFee: number;
  networkRank: number;
}

interface ChannelMetrics {
  channelId: string;
  remoteNode: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: "active" | "inactive" | "pending";
  lastUpdate: number;
}

interface TransactionMetrics {
  timestamp: number;
  amount: number;
  type: "incoming" | "outgoing";
  status: "success" | "failed";
  fee: number;
}

export const NodeMetrics: React.FC = () => {
  const t = useTranslations("Metrics");
  const [metrics, setMetrics] = useState<NodeMetrics>({
    uptime: 99.9,
    totalChannels: 10,
    activeChannels: 8,
    totalCapacity: 10000000,
    incomingCapacity: 6000000,
    outgoingCapacity: 4000000,
    totalTransactions: 1000,
    successRate: 98.5,
    averageFee: 1.5,
    networkRank: 150,
  });

  const [channels, setChannels] = useState<ChannelMetrics[]>([]);
  const [transactions, setTransactions] = useState<TransactionMetrics[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    const mockChannels: ChannelMetrics[] = [
      {
        channelId: "ch1",
        remoteNode: "node1",
        capacity: 1000000,
        localBalance: 600000,
        remoteBalance: 400000,
        status: "active",
        lastUpdate: Date.now(),
      },
      // Ajouter plus de canaux simulés ici
    ];

    const mockTransactions: TransactionMetrics[] = [
      {
        timestamp: Date.now() - 3600000,
        amount: 10000,
        type: "incoming",
        status: "success",
        fee: 1,
      },
      // Ajouter plus de transactions simulées ici
    ];

    setChannels(mockChannels);
    setTransactions(mockTransactions);
  }, []);

  const capacityData = [
    { name: t("incoming"), value: metrics.incomingCapacity },
    { name: t("outgoing"), value: metrics.outgoingCapacity },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t("uptime")}</h3>
          <p className="text-2xl font-bold">{metrics.uptime}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("activeChannels")}
          </h3>
          <p className="text-2xl font-bold">
            {metrics.activeChannels}/{metrics.totalChannels}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("totalCapacity")}
          </h3>
          <p className="text-2xl font-bold">
            {metrics.totalCapacity.toLocaleString()} sats
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">
            {t("successRate")}
          </h3>
          <p className="text-2xl font-bold">{metrics.successRate}%</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="channels">{t("channels")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("transactions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("capacityDistribution")}
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capacityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {capacityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t("networkRank")}</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ rank: metrics.networkRank }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rank" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rank" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("channelMetrics")}
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channelId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="localBalance"
                    name={t("localBalance")}
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="remoteBalance"
                    name={t("remoteBalance")}
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t("transactionMetrics")}
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value) => [`${value} sats`, ""]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    name={t("amount")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
