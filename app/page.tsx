"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { formatBitcoin, formatNumber } from "@/lib/utils";
import { getCurrentStats, getHistoricalData, type NodeStats, type HistoricalData } from "@/lib/api";
import { Activity, Bolt, Database, Wallet, History, Heart, BarChart3, Bitcoin, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAsBtc, setShowAsBtc] = useState(false);

  const formatValue = (value: number) => {
    if (showAsBtc) {
      return formatBitcoin(value, true);
    }
    return formatBitcoin(value, false);
  };

  const transformChartData = (data: HistoricalData[], key: keyof HistoricalData, title: string) => {
    return {
      labels: data.map(item => new Date(item.timestamp).toLocaleDateString()),
      datasets: [
        {
          label: title,
          data: data.map(item => Number(item[key])),
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--primary) / 0.1)',
          tension: 0.4,
          tooltipFormat: (value: number) => formatNumber(value)
        }
      ]
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [currentStats, historical] = await Promise.all([
          getCurrentStats(),
          getHistoricalData(),
        ]);
        setStats(currentStats);
        setHistoricalData(historical);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="p-6">
            <p className="text-destructive">{error}</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Statistiques du Nœud</h2>
          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2">
              <Label htmlFor="unit-switch" className="text-sm">
                <Bitcoin className="h-4 w-4 inline mr-2" />
                Afficher en BTC
              </Label>
              <Switch
                id="unit-switch"
                checked={showAsBtc}
                onCheckedChange={setShowAsBtc}
              />
            </div>
            {stats && (
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour: {new Date(stats.last_update).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bolt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Capacité Totale</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatValue(stats.total_capacity) : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats ? `${stats.active_channel_count} canaux` : '...'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Capacité Moyenne</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatValue(stats.total_capacity / stats.active_channel_count) : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Par canal
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Frais Sortants</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? `${stats.avg_fee_rate_ppm} ppm` : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Moyenne
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Frais Entrants</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? `${stats.avg_fee_rate_ppm} ppm` : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Moyenne
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="peers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="peers" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Pairs
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Bolt className="h-4 w-4" />
              Canaux
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Frais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="peers" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Distribution des Pairs</h3>
                <Chart
                  data={transformChartData(historicalData, 'total_peers', 'Nombre Total de Pairs')}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Réseau Local</h3>
                <Chart
                  data={transformChartData(historicalData, 'active_channels', 'Canaux Actifs')}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Évolution de la Capacité</h3>
                <Chart
                  data={transformChartData(historicalData, 'total_capacity', 'Capacité Totale')}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Évolution du Volume</h3>
                <Chart
                  data={transformChartData(historicalData, 'total_volume', 'Volume Total')}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Actions Récentes</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Aucune action récente</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Actions Planifiées</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Aucune action planifiée</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Frais Générés</h3>
                <Chart
                  data={transformChartData(historicalData, 'total_fees', 'Frais Totaux')}
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}