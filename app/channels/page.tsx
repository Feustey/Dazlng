'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Layout } from '@/components/layout';

interface ChannelData {
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
  historical: {
    timestamp: string;
    totalCapacity: number;
    activeChannels: number;
    totalVolume: number;
    totalFees: number;
    totalPeers: number;
  }[];
}

export default function ChannelsPage() {
  const [data, setData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/review');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-muted-foreground">Aucune donnée disponible</p>
        </div>
      </Layout>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 2,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-8">Synthèse des Canaux</h1>

        {/* Statistiques des canaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Canaux Actifs</h3>
            <p className="text-3xl font-bold text-primary">{data.channelStats.active}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Capacité Totale</h3>
            <p className="text-3xl font-bold text-primary">{formatNumber(data.financialMetrics.totalCapacity)} sats</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Volume Total</h3>
            <p className="text-3xl font-bold text-primary">{formatNumber(data.financialMetrics.totalVolume)} sats</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Frais Totaux</h3>
            <p className="text-3xl font-bold text-primary">{formatNumber(data.financialMetrics.totalFees)} sats</p>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Évolution de la Capacité</h3>
            <div className="h-[300px]">
              <Chart
                data={data.historical}
                dataKey="totalCapacity"
                title="Capacité Totale"
                formatter={(value) => formatNumber(value)}
              />
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Évolution du Volume</h3>
            <div className="h-[300px]">
              <Chart
                data={data.historical}
                dataKey="totalVolume"
                title="Volume Total"
                formatter={(value) => formatNumber(value)}
              />
            </div>
          </Card>
        </div>

        {/* Détails des canaux */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">État des Canaux</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ouverts</p>
              <p className="text-2xl font-bold">{data.channelStats.opened}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold">{data.channelStats.active}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fermés</p>
              <p className="text-2xl font-bold">{data.channelStats.closed}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{data.channelStats.pending}</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 