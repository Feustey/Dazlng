"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { formatBitcoin, formatNumber } from "@/lib/utils";
import { getCurrentStats, getHistoricalData, type NodeStats, type HistoricalData } from "@/lib/api";
import { Activity, Bolt, Database, Wallet } from "lucide-react";

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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Total Revenue</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatBitcoin(stats.total_fees) : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg fee rate: {stats ? `${stats.avg_fee_rate_ppm} ppm` : '...'}
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
                <h3 className="text-sm font-medium">Channel Capacity</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatBitcoin(stats.total_capacity) : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats ? `${stats.active_channel_count} active channels` : '...'}
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
                <h3 className="text-sm font-medium">Total Volume</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatBitcoin(stats.total_volume) : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime forwarded amount
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
                <h3 className="text-sm font-medium">Network Stats</h3>
                <div className="mt-1 text-2xl font-bold">
                  {stats ? formatNumber(stats.total_peers) : '...'} peers
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats ? `${formatNumber(stats.uptime)}% uptime` : '...'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue & Volume Trends</h3>
            <Chart
              data={historicalData}
              dataKey="total_fees"
              title="Total Revenue"
              formatter={formatBitcoin}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Channel Growth</h3>
            <Chart
              data={historicalData}
              dataKey="active_channels"
              title="Active Channels"
              formatter={formatNumber}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Network Capacity</h3>
            <Chart
              data={historicalData}
              dataKey="total_capacity"
              title="Total Capacity"
              formatter={formatBitcoin}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Peer Network Growth</h3>
            <Chart
              data={historicalData}
              dataKey="total_peers"
              title="Total Peers"
              formatter={formatNumber}
            />
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Channel Health</h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Node Uptime</span>
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
                  <span className="text-sm font-medium">Channel Status</span>
                  <span className="ml-auto text-sm">
                    {stats ? `${stats.active_channel_count}/${stats.opened_channel_count} active` : '...'}
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
            <h3 className="text-lg font-semibold mb-4">Node Information</h3>
            <div className="space-y-4">
              {stats && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alias</p>
                    <p className="mt-1">{stats.alias}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platform</p>
                    <p className="mt-1">{stats.platform} v{stats.version}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Public Key</p>
                    <p className="mt-1 font-mono text-sm break-all">{stats.pubkey}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}