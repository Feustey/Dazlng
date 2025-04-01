'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { NetworkSummary as NetworkSummaryType } from '@/types/node';
import { formatBitcoin } from '@/lib/utils';

export default function NetworkSummary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NetworkSummaryType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/network-summary');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Résumé du Réseau</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Statistiques Globales</h3>
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Nœuds Totaux:</span> {summary.total_nodes.toLocaleString()}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Capacité Totale:</span> {formatBitcoin(summary.total_capacity)}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Canaux Totaux:</span> {summary.total_channels.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Moyennes</h3>
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Capacité Moyenne:</span> {formatBitcoin(summary.avg_capacity)}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Taux de Frais Moyen:</span> {summary.avg_fee_rate} ppm
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Frais de Base Moyens:</span> {summary.avg_base_fee} sats
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Croissance du Réseau</h3>
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Nouveaux Nœuds:</span> {summary.network_growth.nodes.toLocaleString()}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Nouveaux Canaux:</span> {summary.network_growth.channels.toLocaleString()}
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Nouvelle Capacité:</span> {formatBitcoin(summary.network_growth.capacity)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Top Nœuds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.top_nodes.map((node, index) => (
            <div key={node.pubkey} className="p-4 bg-muted rounded-lg">
              <div className="font-medium">{node.alias}</div>
              <div className="text-sm text-muted-foreground">{node.pubkey.slice(0, 8)}...{node.pubkey.slice(-8)}</div>
              <div className="mt-2">
                <div>Capacité: {formatBitcoin(node.capacity)}</div>
                <div>Canaux: {node.channels.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 