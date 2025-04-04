"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TransactionData {
  timestamp: string;
  amount: number;
  type: "incoming" | "outgoing";
}

export const TransactionVisualizer: React.FC = () => {
  const t = useTranslations("Transactions");
  const [timeRange, setTimeRange] = useState("24h");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  // Simuler des données de transaction pour l'exemple
  const mockData: TransactionData[] = [
    { timestamp: "00:00", amount: 1000, type: "incoming" },
    { timestamp: "04:00", amount: 500, type: "outgoing" },
    { timestamp: "08:00", amount: 2000, type: "incoming" },
    { timestamp: "12:00", amount: 1500, type: "outgoing" },
    { timestamp: "16:00", amount: 3000, type: "incoming" },
    { timestamp: "20:00", amount: 800, type: "outgoing" },
  ];

  React.useEffect(() => {
    // Ici, nous utiliserions normalement une API pour récupérer les données réelles
    setTransactions(mockData);
  }, [timeRange, mockData]);

  const stats = {
    totalIncoming: transactions
      .filter((t) => t.type === "incoming")
      .reduce((sum, t) => sum + t.amount, 0),
    totalOutgoing: transactions
      .filter((t) => t.type === "outgoing")
      .reduce((sum, t) => sum + t.amount, 0),
    averageAmount:
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
    transactionCount: transactions.length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("totalIncoming")}
          </h3>
          <p className="text-2xl font-bold">{stats.totalIncoming} sats</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("totalOutgoing")}
          </h3>
          <p className="text-2xl font-bold">{stats.totalOutgoing} sats</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("averageAmount")}
          </h3>
          <p className="text-2xl font-bold">
            {stats.averageAmount.toFixed(0)} sats
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("transactionCount")}
          </h3>
          <p className="text-2xl font-bold">{stats.transactionCount}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          {t("transactionHistory")}
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
