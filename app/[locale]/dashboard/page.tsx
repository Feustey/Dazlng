"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NodeMetrics {
  totalChannels: number;
  totalCapacity: number;
  averageFee: number;
  activeChannels: number;
  totalFees: number;
  uptime: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
}

interface NetworkMetrics {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
}

interface PeerOfPeer {
  peerPubkey: string;
  alias: string;
  totalCapacity: number;
  activeChannels: number;
  totalPeers: number;
}

interface HistoricalData {
  timestamp: string;
  total_fees: number;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  total_volume: number;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<NodeMetrics>({
    totalChannels: 0,
    totalCapacity: 0,
    averageFee: 0,
    activeChannels: 0,
    totalFees: 0,
    uptime: 0,
    betweenness: 0,
    closeness: 0,
    eigenvector: 0,
  });
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalNodes: 0,
    totalChannels: 0,
    totalCapacity: 0,
    avgCapacityPerChannel: 0,
    avgChannelsPerNode: 0,
  });
  const [peersOfPeers, setPeersOfPeers] = useState<PeerOfPeer[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          metricsResponse,
          historicalResponse,
          networkResponse,
          peersResponse,
        ] = await Promise.all([
          fetch("/api/review"),
          fetch("/api/historical"),
          fetch("/api/network/summary"),
          fetch("/api/peers"),
        ]);

        if (
          !metricsResponse.ok ||
          !historicalResponse.ok ||
          !networkResponse.ok ||
          !peersResponse.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [metricsData, historicalData, networkData, peersData] =
          await Promise.all([
            metricsResponse.json(),
            historicalResponse.json(),
            networkResponse.json(),
            peersResponse.json(),
          ]);

        setMetrics({
          totalChannels: metricsData.channelStats.opened,
          totalCapacity: metricsData.financialMetrics.totalCapacity,
          averageFee: metricsData.feeRates.average,
          activeChannels: metricsData.channelStats.active,
          totalFees: metricsData.financialMetrics.totalFees,
          uptime: metricsData.networkMetrics.uptime,
          betweenness: metricsData.centralities?.betweenness || 0,
          closeness: metricsData.centralities?.closeness || 0,
          eigenvector: metricsData.centralities?.eigenvector || 0,
        });

        setNetworkMetrics({
          totalNodes: networkData.totalNodes,
          totalChannels: networkData.totalChannels,
          totalCapacity: networkData.totalCapacity,
          avgCapacityPerChannel: networkData.avgCapacityPerChannel,
          avgChannelsPerNode: networkData.avgChannelsPerNode,
        });

        setPeersOfPeers(peersData.peers_of_peers || []);
        setHistoricalData(historicalData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const formatSats = (sats: number) => {
    return new Intl.NumberFormat("fr-FR").format(sats);
  };

  const formatBTC = (sats: number) => {
    return (sats / 100000000).toFixed(8);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-blue-400">{t("subtitle")}</p>
      </motion.div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-900 to-blue-800">
            <h3 className="text-lg font-semibold text-blue-200 mb-2">
              {t("metrics.channels")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {metrics.totalChannels}
            </p>
            <p className="text-sm text-blue-300">
              {t("metrics.activeChannels", { count: metrics.activeChannels })}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-900 to-purple-800">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">
              {t("metrics.capacity")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {formatBTC(metrics.totalCapacity)} BTC
            </p>
            <p className="text-sm text-purple-300">
              {formatSats(metrics.totalCapacity)} sats
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-900 to-green-800">
            <h3 className="text-lg font-semibold text-green-200 mb-2">
              {t("metrics.fees")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {formatBTC(metrics.totalFees)} BTC
            </p>
            <p className="text-sm text-green-300">
              {t("metrics.averageFee", { fee: metrics.averageFee })}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Métriques réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-800">
            <h3 className="text-lg font-semibold text-indigo-200 mb-2">
              {t("metrics.network.nodes")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {networkMetrics.totalNodes}
            </p>
            <p className="text-sm text-indigo-300">
              {t("metrics.network.channels", {
                count: networkMetrics.totalChannels,
              })}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-pink-900 to-pink-800">
            <h3 className="text-lg font-semibold text-pink-200 mb-2">
              {t("metrics.network.capacity")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {formatBTC(networkMetrics.totalCapacity)} BTC
            </p>
            <p className="text-sm text-pink-300">
              {t("metrics.network.avgCapacity", {
                capacity: formatBTC(networkMetrics.avgCapacityPerChannel),
              })}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-900 to-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-200 mb-2">
              {t("metrics.network.centrality")}
            </h3>
            <p className="text-3xl font-bold text-white">
              {(metrics.betweenness * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-yellow-300">
              {t("metrics.network.rank", { rank: metrics.betweenness })}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Pairs de pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mb-12"
      >
        <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <h3 className="text-2xl font-semibold text-white mb-6">
            {t("peers.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peersOfPeers.map((peer, index) => (
              <Card key={peer.peerPubkey} className="p-4 bg-gray-700">
                <h4 className="text-lg font-medium text-blue-400 mb-2">
                  {peer.alias}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    {t("peers.capacity")}: {formatBTC(peer.totalCapacity)} BTC
                  </p>
                  <p className="text-sm text-gray-300">
                    {t("peers.channels")}: {peer.activeChannels}
                  </p>
                  <p className="text-sm text-gray-300">
                    {t("peers.peers")}: {peer.totalPeers}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6 bg-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              {t("charts.fees.title")}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData.map((item) => ({
                    day: new Date(item.timestamp).toLocaleDateString("fr-FR", {
                      weekday: "short",
                    }),
                    fees: item.total_fees / 100000000,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(8)} BTC`,
                      t("charts.fees.tooltip.fees"),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="fees"
                    stroke="#60A5FA"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6 bg-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              {t("charts.capacity.title")}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData.map((item) => ({
                    day: new Date(item.timestamp).toLocaleDateString("fr-FR", {
                      weekday: "short",
                    }),
                    capacity: item.total_capacity / 100000000,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(8)} BTC`,
                      t("charts.capacity.tooltip.capacity"),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="#A78BFA"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <h3 className="text-2xl font-semibold text-white mb-6">
            {t("recommendations.title")}
          </h3>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-4"
              >
                <h4 className="text-lg font-medium text-blue-400 mb-2">
                  {t(`recommendations.${index}.title`)}
                </h4>
                <p className="text-gray-300">
                  {t(`recommendations.${index}.description`)}
                </p>
                <div className="mt-2 text-sm text-green-400">
                  {t(`recommendations.${index}.impact`)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
