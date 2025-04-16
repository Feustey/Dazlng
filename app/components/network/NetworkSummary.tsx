"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react";
import { NetworkSummary as NetworkSummaryType } from "../types/node";
import { formatBitcoin, formatNumber } from "@/app/lib/utils";
import { useTranslations } from "next-intl";

export default function NetworkSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NetworkSummaryType | null>(null);
  const t = useTranslations("pages.network.summary");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/network-summary");
        if (!response.ok) {
          throw new Error(t("error.fetch"));
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.unknown"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {t("totalNodes")}
            </span>
            <span className="text-2xl font-bold">
              {formatNumber(summary.total_nodes)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {t("totalChannels")}
            </span>
            <span className="text-2xl font-bold">
              {formatNumber(summary.total_channels)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {t("totalCapacity")}
            </span>
            <span className="text-2xl font-bold">
              {formatBitcoin(summary.total_capacity)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {t("avgCapacity")}
            </span>
            <span className="text-2xl font-bold">
              {formatBitcoin(summary.avg_capacity)}
            </span>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {t("lastUpdate")}: {new Date(summary.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
