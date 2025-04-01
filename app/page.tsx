"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chart } from "@/components/ui/chart";
import { formatBitcoin, formatNumber } from "@/lib/utils";
import {
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Zap,
  Network,
  Activity,
} from "lucide-react";
import NetworkSummary from "@/components/NetworkSummary";

interface NetworkStatsType {
  total_nodes: number;
  total_channels: number;
  total_capacity: number;
  avg_capacity_per_channel: number;
  avg_channels_per_node: number;
  timestamp: string;
}

interface HistoricalDataType {
  dates: string[];
  nodes: number[];
  channels: number[];
  capacity: number[];
}

// Données de fallback pour les statistiques actuelles
const fallbackCurrentStats: NetworkStatsType = {
  total_nodes: 15000,
  total_channels: 75000,
  total_capacity: 5000,
  avg_capacity_per_channel: 0.066,
  avg_channels_per_node: 5,
  timestamp: new Date().toISOString(),
};

// Données de fallback pour les données historiques
const fallbackHistoricalData: HistoricalDataType = {
  dates: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse(),
  nodes: Array.from({ length: 30 }, () => 15000),
  channels: Array.from({ length: 30 }, () => 75000),
  capacity: Array.from({ length: 30 }, () => 5000),
};

export default function HomePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStats, setCurrentStats] = useState<NetworkStatsType | null>(
    null
  );
  const [historicalData, setHistoricalData] =
    useState<HistoricalDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement des statistiques actuelles
        const statsResponse = await fetch("/api/stats/current");
        if (!statsResponse.ok) {
          throw new Error(
            "Erreur lors de la récupération des statistiques actuelles"
          );
        }
        const statsData = await statsResponse.json();
        setCurrentStats(statsData);

        // Chargement des données historiques
        const historyResponse = await fetch("/api/stats/historical");
        if (!historyResponse.ok) {
          throw new Error(
            "Erreur lors de la récupération des données historiques"
          );
        }
        const historyData = await historyResponse.json();
        setHistoricalData(historyData);
        setIsUsingFallback(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setCurrentStats(fallbackCurrentStats);
        setHistoricalData(fallbackHistoricalData);
        setIsUsingFallback(true);
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la récupération des données"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Chargement des données du réseau Lightning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {isUsingFallback && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">
              Les données affichées sont des données de fallback car l'API est
              temporairement indisponible.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Tableau de bord Lightning Network
          </h1>
          <p className="text-gray-500">
            Visualisez et analysez les données du réseau Lightning en temps réel
          </p>
        </div>

        <div className="w-full lg:w-1/3">
          <Input
            placeholder="Rechercher un nœud par pubkey ou alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Nœuds</h3>
              <Network className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {currentStats?.total_nodes.toLocaleString() || "-"}
            </div>
            <p className="text-sm text-gray-500">sur le réseau Lightning</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Canaux</h3>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {currentStats?.total_channels.toLocaleString() || "-"}
            </div>
            <p className="text-sm text-gray-500">actifs sur le réseau</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Capacité</h3>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {currentStats ? formatBitcoin(currentStats.total_capacity) : "-"}
            </div>
            <p className="text-sm text-gray-500">capacité totale du réseau</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Moy. par canal
              </h3>
              <ArrowUpRight className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold mb-1">
              {currentStats
                ? formatBitcoin(currentStats.avg_capacity_per_channel)
                : "-"}
            </div>
            <p className="text-sm text-gray-500">capacité moyenne par canal</p>
          </CardContent>
        </Card>
      </div>

      {/* Résumé du réseau et graphique d'évolution historique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NetworkSummary />

        <Chart
          title="Évolution du réseau Lightning"
          description="Tendances historiques"
          height={350}
        >
          {historicalData ? (
            <div className="flex flex-col h-full">
              <div className="h-full w-full">
                {/* Graphique simulé d'évolution historique */}
                <div className="h-64 flex items-end justify-between px-4">
                  {historicalData.capacity.map((value, index) => (
                    <div
                      key={index}
                      className="w-5 bg-blue-500 rounded-t transition-all hover:bg-blue-600 relative group"
                      style={{
                        height: `${
                          (value / Math.max(...historicalData.capacity)) * 100
                        }%`,
                      }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatBitcoin(value)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-4 mt-2 text-xs text-gray-500">
                  {historicalData.dates.map((date, index) => (
                    <div
                      key={index}
                      className="w-5 text-center overflow-hidden"
                    >
                      {date.substring(5, 10)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Badge className="bg-blue-500">Capacité</Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-gray-500">
                Données non disponibles
              </p>
            </div>
          )}
        </Chart>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Exporter les données</Button>
        <Button onClick={() => window.location.reload()}>Actualiser</Button>
      </div>
    </div>
  );
}
