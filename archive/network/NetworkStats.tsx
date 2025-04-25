"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@/components/ui/card";
import { formatNumber, formatSats } from "@/utils/format";
import { useTranslations } from "next-intl";
import { getNetworkStats } from "@/services/network.service";
import type { NetworkStats } from "@/services/network.service";
import { Users, Zap, Activity, BarChart2 } from "lucide-react";

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getNetworkStats();
        setStats(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Nœuds</h3>
        </div>
        <p className="text-2xl font-bold">{formatNumber(stats.totalNodes)}</p>
        <p className="text-sm text-gray-500">
          {formatNumber(stats.activeNodes)} actifs
        </p>
      </Card>

      <Card>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Canaux</h3>
        </div>
        <p className="text-2xl font-bold">
          {formatNumber(stats.totalChannels)}
        </p>
        <p className="text-sm text-gray-500">
          {formatNumber(stats.activeChannels)} actifs
        </p>
      </Card>

      <Card>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Capacité</h3>
        </div>
        <p className="text-2xl font-bold">{formatSats(stats.totalCapacity)}</p>
        <p className="text-sm text-gray-500">
          Moyenne: {formatSats(stats.avgCapacityPerChannel)}
        </p>
      </Card>

      <Card>
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Croissance</h3>
        </div>
        <p className="text-sm text-gray-500">
          Nœuds: +{formatNumber(stats.networkGrowth.nodes)}
        </p>
        <p className="text-sm text-gray-500">
          Canaux: +{formatNumber(stats.networkGrowth.channels)}
        </p>
      </Card>
    </div>
  );
}
