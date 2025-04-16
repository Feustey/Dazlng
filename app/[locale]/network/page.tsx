"use client";

import { motion } from "framer-motion";
import { BarChart2, Globe, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Card from "@components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card";
import { Users } from "lucide-react";
import { CapacityChart, CountryChart } from "@components/charts";
import PageContainer from "@components/layout/PageContainer";
import { useEffect, useState, useMemo, useCallback, Suspense } from "react";

// Types
type CountryCode = string;
type DateString = string;

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  nodesByCountry: Record<CountryCode, number>;
  capacityHistory: Array<{
    date: DateString;
    value: number;
  }>;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface FormattedMetrics {
  totalNodes: string;
  totalChannels: string;
  totalCapacity: string;
}

// Données statiques de démonstration
const demoData: NetworkStats = {
  totalNodes: 15000,
  totalChannels: 75000,
  totalCapacity: 1000.5,
  nodesByCountry: {
    US: 4500,
    DE: 3000,
    FR: 2000,
    GB: 1500,
    JP: 1000,
    CA: 800,
    AU: 700,
    BR: 600,
    SG: 500,
    NL: 400,
  },
  capacityHistory: [
    { date: "2024-01-01", value: 800 },
    { date: "2024-02-01", value: 850 },
    { date: "2024-03-01", value: 900 },
    { date: "2024-04-01", value: 950 },
    { date: "2024-05-01", value: 1000 },
    { date: "2024-06-01", value: 1050 },
  ],
};

// Composants réutilisables
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-500 text-center p-4">{message}</div>
);

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="text-3xl font-bold text-gradient">{value}</p>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </Card>
  </motion.div>
);

// Hooks personnalisés
const useNetworkStats = () => {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Temporairement désactivé en attendant l'API
      /*
      const response = await fetch("http://192.168.0.21:8000/network/network-summary");
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");
      const data = await response.json();
      setStats({
        totalNodes: data.total_nodes,
        totalChannels: data.total_channels,
        totalCapacity: data.total_capacity,
        nodesByCountry: {},
        capacityHistory: []
      });
      */

      // Simulation de chargement avec données de démonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats(demoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, loading, error };
};

const useFormattedData = (stats: NetworkStats | null) => {
  const chartData = useMemo(() => {
    if (!stats) return { capacity: null, country: null };

    return {
      capacity: {
        labels: stats.capacityHistory.map((item) =>
          new Date(item.date).toLocaleDateString()
        ),
        values: stats.capacityHistory.map((item) => item.value),
      },
      country: {
        labels: Object.keys(stats.nodesByCountry),
        values: Object.values(stats.nodesByCountry),
      },
    };
  }, [stats]);

  const formattedMetrics = useMemo(() => {
    if (!stats) return null;

    return {
      totalNodes: stats.totalNodes.toLocaleString(),
      totalChannels: stats.totalChannels.toLocaleString(),
      totalCapacity: `${stats.totalCapacity.toFixed(1)} BTC`,
    };
  }, [stats]);

  return { chartData, formattedMetrics };
};

// Composant principal
export default function NetworkPage() {
  const t = useTranslations("pages.network");
  const { stats, loading, error } = useNetworkStats();
  const { chartData, formattedMetrics } = useFormattedData(stats);

  if (loading) {
    return (
      <PageContainer title={t("title")} subtitle={t("subtitle")}>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title={t("title")} subtitle={t("subtitle")}>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={t("title")} subtitle={t("subtitle")}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title={t("metrics.totalNodes")}
            value={formattedMetrics?.totalNodes ?? "N/A"}
            description={t("metrics.totalNodesDescription")}
            icon={Users}
          />
          <MetricCard
            title={t("metrics.totalChannels")}
            value={formattedMetrics?.totalChannels ?? "N/A"}
            description={t("metrics.totalChannelsDescription")}
            icon={Zap}
          />
          <MetricCard
            title={t("metrics.totalCapacity")}
            value={formattedMetrics?.totalCapacity ?? "N/A"}
            description={t("metrics.totalCapacityDescription")}
            icon={BarChart2}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {t("charts.capacityHistory.title")}
                </CardTitle>
                <CardDescription>
                  {t("charts.capacityHistory.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CapacityChart
                    data={chartData.capacity ?? { labels: [], values: [] }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {t("charts.nodesByCountry.title")}
                </CardTitle>
                <CardDescription>
                  {t("charts.nodesByCountry.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <CountryChart
                    data={chartData.country ?? { labels: [], values: [] }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
