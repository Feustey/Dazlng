"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TransactionData {
  timestamp: number;
  amount: number;
  type: "incoming" | "outgoing";
  channelId: string;
}

interface ChannelStats {
  totalIncoming: number;
  totalOutgoing: number;
  averageAmount: number;
  transactionCount: number;
}

export const TransactionVisualizer: React.FC = () => {
  const t = useTranslations("Transactions");
  const [timeRange, setTimeRange] = useState("24h");
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [channelStats, setChannelStats] = useState<ChannelStats>({
    totalIncoming: 0,
    totalOutgoing: 0,
    averageAmount: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    // Simuler le chargement des données
    const mockData: TransactionData[] = [
      {
        timestamp: Date.now() - 3600000,
        amount: 1000,
        type: "incoming",
        channelId: "ch1",
      },
      {
        timestamp: Date.now() - 7200000,
        amount: 2000,
        type: "outgoing",
        channelId: "ch2",
      },
      {
        timestamp: Date.now() - 10800000,
        amount: 1500,
        type: "incoming",
        channelId: "ch1",
      },
    ];

    setTransactionData(mockData);

    // Calculer les statistiques
    const stats = mockData.reduce(
      (acc, curr) => ({
        totalIncoming:
          acc.totalIncoming + (curr.type === "incoming" ? curr.amount : 0),
        totalOutgoing:
          acc.totalOutgoing + (curr.type === "outgoing" ? curr.amount : 0),
        averageAmount:
          (acc.averageAmount * acc.transactionCount + curr.amount) /
          (acc.transactionCount + 1),
        transactionCount: acc.transactionCount + 1,
      }),
      {
        totalIncoming: 0,
        totalOutgoing: 0,
        averageAmount: 0,
        transactionCount: 0,
      }
    );

    setChannelStats(stats);
  }, [timeRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectTimeRange")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">{t("last24Hours")}</SelectItem>
            <SelectItem value="7d">{t("last7Days")}</SelectItem>
            <SelectItem value="30d">{t("last30Days")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t("channelStats")}</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{t("totalIncoming")}</span>
              <span className="font-medium">
                {channelStats.totalIncoming} sats
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("totalOutgoing")}</span>
              <span className="font-medium">
                {channelStats.totalOutgoing} sats
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("averageAmount")}</span>
              <span className="font-medium">
                {channelStats.averageAmount.toFixed(2)} sats
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("transactionCount")}</span>
              <span className="font-medium">
                {channelStats.transactionCount}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("transactionHistory")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
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
      </div>
    </div>
  );
};
