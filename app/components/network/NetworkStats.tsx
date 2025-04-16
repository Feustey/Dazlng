"use client";

import * as React from "react";

import { useEffect, useState } from "react";
import Card from "./ui/card";
import { formatNumber, formatSats } from "../utils/format";
import { useTranslations } from "next-intl";

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgChannelsPerNode: number;
}

export default function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("pages.network.metrics");

  useEffect(() => {
    async function loadNetworkStats() {
      try {
        const response = await fetch("/api/network-summary");
        if (!response.ok) {
          throw new Error(t("error.fetch"));
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load network stats:", error);
        setError(t("error.loading"));
      }
    }

    loadNetworkStats();
  }, [t]);

  if (error) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-4 text-center text-destructive">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-4 text-center text-muted-foreground">
              {t("loading")}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.totalNodes)}
            </div>
            <div className="text-muted-foreground">{t("totalNodes")}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.totalChannels)}
            </div>
            <div className="text-muted-foreground">{t("totalChannels")}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatSats(stats.totalCapacity)}
            </div>
            <div className="text-muted-foreground">{t("totalCapacity")}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.avgChannelsPerNode)}
            </div>
            <div className="text-muted-foreground">
              {t("avgChannelsPerNode")}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
