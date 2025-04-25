"use client";

import { useEffect, useState } from "react";
import { Users, Zap, Activity, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNetworkStats } from "@/services/network.service";

interface NetworkStatsProps {
  totalNodes?: number;
  totalChannels?: number;
  totalCapacity?: number;
  avgChannelSize?: number;
  useApi?: boolean;
}

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  activeNodes: number;
  activeChannels: number;
  networkGrowth: {
    nodes: number;
    channels: number;
    capacity: number;
  };
  capacityHistory: any[];
  nodesByCountry: any[];
  lastUpdate: Date;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const formatBTC = (sats: number) => {
  const btc = sats / 100000000;
  return `${btc.toFixed(1)} BTC`;
};

const formatNumber = (num: number) => {
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

export function NetworkStats({
  totalNodes,
  totalChannels,
  totalCapacity,
  avgChannelSize,
  useApi = true,
}: NetworkStatsProps) {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(useApi);

  useEffect(() => {
    if (!useApi) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getNetworkStats();
        setStats(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [useApi]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si on utilise des props directement
  if (
    !useApi &&
    totalNodes &&
    totalChannels &&
    totalCapacity &&
    avgChannelSize
  ) {
    return (
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="hover-lift hover-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nœuds Totaux
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {formatNumber(totalNodes)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover-lift hover-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Capacité Totale
              </CardTitle>
              <Zap className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {formatBTC(totalCapacity)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover-lift hover-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canaux Totaux
              </CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {formatNumber(totalChannels)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover-lift hover-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taille Moyenne
              </CardTitle>
              <BarChart2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {formatBTC(avgChannelSize)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  if (error || !stats) {
    return (
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="hover-lift hover-glow transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">N/A</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                N/A
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  const formattedActiveNodes = `(${stats.activeNodes.toLocaleString("fr-FR")} actifs)`;
  const formattedActiveChannels = `(${stats.activeChannels.toLocaleString("fr-FR")} actifs)`;
  const formattedAverage = `Moyenne: ${(stats.avgCapacityPerChannel / 100000000).toFixed(1)} BTC`;

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="hover-lift hover-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nœuds Totaux</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatNumber(stats.totalNodes)}
              <span className="text-sm text-muted-foreground ml-2">
                {formattedActiveNodes}
              </span>
              {stats.networkGrowth.nodes > 0 && (
                <span className="text-sm text-green-500 ml-2">
                  +{stats.networkGrowth.nodes} nœuds
                </span>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="hover-lift hover-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacité Totale
            </CardTitle>
            <Zap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {formatBTC(stats.totalCapacity)}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="hover-lift hover-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canaux Totaux</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {formatNumber(stats.totalChannels)}
              <span className="text-sm text-muted-foreground ml-2">
                {formattedActiveChannels}
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="hover-lift hover-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taille Moyenne
            </CardTitle>
            <BarChart2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {formattedAverage}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
