import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Zap, Network, Activity, BarChart3 } from "lucide-react";
import { NetworkStats } from "../types/network";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkDashboardProps {
  stats: NetworkStats;
  trends: {
    capacity: number;
    nodes: number;
    channels: number;
    avgSize: number;
  };
  capacityHistory?: Array<{
    date: Date;
    value: number;
  }>;
}

export function NetworkDashboard({
  stats,
  trends,
  capacityHistory,
}: NetworkDashboardProps) {
  const t = useTranslations("pages.network.dashboard");

  // Préparation des données pour le graphique d'évolution de la capacité
  const capacityData = {
    labels: capacityHistory?.map((item) =>
      new Date(item.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: t("capacity.label"),
        data: capacityHistory?.map((item) => item.value),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="col-span-3 p-6">
        <CardTitle className="mb-4">{t("overview.title")}</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-10 w-10 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t("overview.totalCapacity")}
              </p>
              <p className="text-2xl font-bold">{stats.totalCapacity}</p>
              <Badge variant={trends.capacity > 0 ? "default" : "destructive"}>
                {trends.capacity > 0 ? "+" : ""}
                {trends.capacity}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Network className="h-10 w-10 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t("overview.activeNodes")}
              </p>
              <p className="text-2xl font-bold">{stats.totalNodes}</p>
              <Badge variant={trends.nodes > 0 ? "default" : "destructive"}>
                {trends.nodes > 0 ? "+" : ""}
                {trends.nodes}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="h-10 w-10 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t("overview.activeChannels")}
              </p>
              <p className="text-2xl font-bold">{stats.totalChannels}</p>
              <Badge variant={trends.channels > 0 ? "default" : "destructive"}>
                {trends.channels > 0 ? "+" : ""}
                {trends.channels}%
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-10 w-10 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t("overview.avgChannelSize")}
              </p>
              <p className="text-2xl font-bold">
                {trends.avgSize.toFixed(2)} BTC
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <CardTitle className="mb-4">{t("capacityHistory.title")}</CardTitle>
        <div className="h-[300px]">
          <Line data={capacityData} options={options} />
        </div>
      </Card>

      <Card className="p-6">
        <CardTitle className="mb-4">{t("metrics.title")}</CardTitle>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("metrics.avgCapacityPerChannel")}
            </span>
            <span className="font-medium">
              {stats.avgCapacityPerChannel
                ? `${(stats.avgCapacityPerChannel / 100000000).toFixed(2)} BTC`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("metrics.avgChannelsPerNode")}
            </span>
            <span className="font-medium">
              {stats.avgChannelsPerNode?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
