"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { formatBitcoin, formatNumber } from "@/lib/utils";
import { getCurrentStats, getHistoricalData, type NodeStats, type HistoricalData } from "@/lib/api";
import { Activity, Bolt, Database, Wallet, History, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {stats && (
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(stats.last_update).toLocaleString()}
            </p>
          )}
        </div>

        <Tabs defaultValue="health" className="space-y-4">
          <TabsList>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              État de santé
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Données historiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Revenus Totaux</h3>
                    <div className="mt-1 text-2xl font-bold">
                      {stats ? formatBitcoin(stats.total_fees) : '...'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taux moyen: {stats ? `${stats.avg_fee_rate_ppm} ppm` : '...'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bolt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Capacité des Canaux</h3>
                    <div className="mt-1 text-2xl font-bold">
                      {stats ? formatBitcoin(stats.total_capacity) : '...'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats ? `${stats.active_channel_count} canaux actifs` : '...'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Volume Total</h3>
                    <div className="mt-1 text-2xl font-bold">
                      {stats ? formatBitcoin(stats.total_volume) : '...'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Montant total transféré
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Statistiques Réseau</h3>
                    <div className="mt-1 text-2xl font-bold">
                      {stats ? formatNumber(stats.total_peers) : '...'} pairs
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats ? `${formatNumber(stats.uptime)}% disponibilité` : '...'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Santé du Nœud</h3>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Disponibilité</span>
                      <span className="ml-auto text-sm">
                        {stats ? `${formatNumber(stats.uptime)}%` : '...'}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: stats ? `${stats.uptime}%` : '0%' }} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">État des Canaux</span>
                      <span className="ml-auto text-sm">
                        {stats ? `${stats.active_channel_count}/${stats.opened_channel_count} actifs` : '...'}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ 
                          width: stats 
                            ? `${(stats.active_channel_count / stats.opened_channel_count) * 100}%` 
                            : '0%' 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informations du Nœud</h3>
                <div className="space-y-4">
                  {stats && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Alias</p>
                        <p className="mt-1">{stats.alias}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Plateforme</p>
                        <p className="mt-1">{stats.platform} v{stats.version}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Clé Publique</p>
                        <p className="mt-1 font-mono text-sm break-all">{stats.pubkey}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tendances des Revenus & Volumes</h3>
                <Chart
                  data={historicalData}
                  dataKey="total_fees"
                  title="Revenus Totaux"
                  formatter={formatBitcoin}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Croissance des Canaux</h3>
                <Chart
                  data={historicalData}
                  dataKey="active_channels"
                  title="Canaux Actifs"
                  formatter={formatNumber}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Capacité du Réseau</h3>
                <Chart
                  data={historicalData}
                  dataKey="total_capacity"
                  title="Capacité Totale"
                  formatter={formatBitcoin}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Croissance du Réseau de Pairs</h3>
                <Chart
                  data={historicalData}
                  dataKey="total_peers"
                  title="Nombre Total de Pairs"
                  formatter={formatNumber}
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}