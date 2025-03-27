"use client";

import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { formatBitcoin, formatNumber } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoricalDataPoint {
  timestamp: string;
  totalCapacity: number;
  activeChannels: number;
  totalVolume: number;
  totalFees: number;
  totalPeers: number;
}

interface ReviewData {
  nodeInfo: {
    pubkey: string;
    alias: string;
    color: string;
    platform: string;
    version: string;
    address: string;
  };
  channelStats: {
    opened: number;
    active: number;
    closed: number;
    pending: number;
  };
  financialMetrics: {
    totalCapacity: number;
    averageCapacity: number;
    totalVolume: number;
    totalFees: number;
  };
  feeRates: {
    average: number;
    baseRate: number;
    ppm: number;
  };
  networkMetrics: {
    totalPeers: number;
    uptime: number;
    lastUpdate: string;
  };
  historical: HistoricalDataPoint[];
}

export default function ReviewPage() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transformChartData = (data: HistoricalDataPoint[], key: keyof HistoricalDataPoint, title: string) => {
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
        const response = await fetch('/api/review');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }

    fetchData();
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

  if (!data) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="p-6">
            <p>Loading...</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        <h1 className="text-3xl font-bold">API Data Review</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Node Information</h2>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Key</p>
                <p className="text-sm font-mono break-all">{data.nodeInfo.pubkey}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alias</p>
                <p>{data.nodeInfo.alias}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform & Version</p>
                <p>{data.nodeInfo.platform} - v{data.nodeInfo.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-mono">{data.nodeInfo.address}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Channel Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Opened</p>
                <p className="text-2xl font-bold">{data.channelStats.opened}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{data.channelStats.active}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{data.channelStats.closed}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{data.channelStats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">{formatBitcoin(data.financialMetrics.totalCapacity)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Capacity</p>
                <p className="text-2xl font-bold">{formatBitcoin(data.financialMetrics.averageCapacity)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{formatBitcoin(data.financialMetrics.totalVolume)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold">{formatBitcoin(data.financialMetrics.totalFees)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Fee Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rate</p>
                <p className="text-2xl font-bold">{data.feeRates.average}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Base Rate</p>
                <p className="text-2xl font-bold">{data.feeRates.baseRate} sats</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PPM</p>
                <p className="text-2xl font-bold">{data.feeRates.ppm}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Network Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Peers</p>
                <p className="text-2xl font-bold">{formatNumber(data.networkMetrics.totalPeers)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{data.networkMetrics.uptime}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Update</p>
                <p className="text-sm">{new Date(data.networkMetrics.lastUpdate).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
            <Tabs defaultValue="capacity" className="space-y-4">
              <TabsList>
                <TabsTrigger value="capacity">Capacity</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
              </TabsList>

              <TabsContent value="capacity">
                <Chart
                  data={transformChartData(data.historical, 'totalCapacity', 'Total Capacity')}
                />
              </TabsContent>

              <TabsContent value="channels">
                <Chart
                  data={transformChartData(data.historical, 'activeChannels', 'Active Channels')}
                />
              </TabsContent>

              <TabsContent value="volume">
                <Chart
                  data={transformChartData(data.historical, 'totalVolume', 'Total Volume')}
                />
              </TabsContent>

              <TabsContent value="fees">
                <Chart
                  data={transformChartData(data.historical, 'totalFees', 'Total Fees')}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
}