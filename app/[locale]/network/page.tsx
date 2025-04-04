"use client";

import { useEffect, useState, Suspense } from "react";
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
  BarChart,
  Bar,
} from "recharts";
import { getNetworkStats } from "@/app/services/network.service";
import { formatNumber, formatSats } from "@/app/utils/format";
import dynamic from "next/dynamic";

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

// Chargement dynamique des graphiques
const DynamicCapacityChart = dynamic(
  () => import("@/app/components/charts/CapacityChart"),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const DynamicCountryChart = dynamic(
  () => import("@/app/components/charts/CountryChart"),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

const DynamicTopNodes = dynamic(
  () => import("@/app/components/network/TopNodes"),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  }
);

const DynamicRecentChannels = dynamic(
  () => import("@/app/components/network/RecentChannels"),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  }
);

export default async function NetworkPage() {
  const stats = await getNetworkStats();
  const t = useTranslations("Network");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec les statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t("totalNodes")}
          </h3>
          <p className="text-2xl font-bold">{formatNumber(stats.totalNodes)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t("totalChannels")}
          </h3>
          <p className="text-2xl font-bold">
            {formatNumber(stats.totalChannels)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t("totalCapacity")}
          </h3>
          <p className="text-2xl font-bold">
            {formatSats(stats.totalCapacity)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t("avgChannelsPerNode")}
          </h3>
          <p className="text-2xl font-bold">
            {formatNumber(stats.avgChannelsPerNode)}
          </p>
        </Card>
      </div>

      {/* Graphique de l'historique de la capacité */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{t("capacityHistory")}</h2>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <DynamicCapacityChart data={stats.capacityHistory} />
        </Suspense>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution par pays */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{t("nodesByCountry")}</h2>
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <DynamicCountryChart data={stats.nodesByCountry} />
          </Suspense>
        </Card>

        {/* Top Nodes */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{t("topNodes")}</h2>
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <DynamicTopNodes nodes={stats.topNodes} />
          </Suspense>
        </Card>
      </div>

      {/* Canaux récents */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">{t("recentChannels")}</h2>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <DynamicRecentChannels channels={stats.recentChannels} />
        </Suspense>
      </Card>
    </div>
  );
}
