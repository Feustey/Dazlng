"use client";

import { useEffect, useState, Suspense } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Chart } from "./components/ui/chart";
import { formatBitcoin, formatNumber } from "./lib/utils";
import {
  Loader2,
  AlertCircle,
  ArrowUpRight,
  Zap,
  Network,
  Activity,
  Search,
} from "lucide-react";
import NetworkSummary from "./components/NetworkSummary";

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

export default function Home() {
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

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    console.log("Recherche pour:", searchTerm);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Barre de recherche */}
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Rechercher un nœud..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>

      {/* Statistiques actuelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nœuds Totaux</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(currentStats?.total_nodes || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(currentStats?.avg_channels_per_node || 0)} canaux
              par nœud
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canaux Totaux</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(currentStats?.total_channels || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatBitcoin(currentStats?.avg_capacity_per_channel || 0)} par
              canal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacité Totale
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBitcoin(currentStats?.total_capacity || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernière mise à jour:{" "}
              {new Date(currentStats?.timestamp || "").toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Nœuds</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={{
                labels: historicalData?.dates || [],
                datasets: [
                  {
                    label: "Nœuds",
                    data: historicalData?.nodes || [],
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary))",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Nombre de nœuds au fil du temps",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution des Canaux</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={{
                labels: historicalData?.dates || [],
                datasets: [
                  {
                    label: "Canaux",
                    data: historicalData?.channels || [],
                    borderColor: "hsl(var(--secondary))",
                    backgroundColor: "hsl(var(--secondary))",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Nombre de canaux au fil du temps",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution de la Capacité</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={{
                labels: historicalData?.dates || [],
                datasets: [
                  {
                    label: "Capacité",
                    data: historicalData?.capacity || [],
                    borderColor: "hsl(var(--accent))",
                    backgroundColor: "hsl(var(--accent))",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Capacité totale au fil du temps",
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Résumé du réseau */}
      <NetworkSummary />
    </div>
  );
}
