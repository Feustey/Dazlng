'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface OptimizationResponse {
  recommendations: string[];
  status: string;
  nodeInfo?: {
    alias?: string;
    capacity?: number;
    channelCount?: number;
    avgCapacity?: number;
  };
}

export default function BotIA() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/optimize', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analyse IA du Nœud</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">
              {error}
            </div>
          ) : result ? (
            <>
              {result.nodeInfo && (
                <div className="mb-6 space-y-4">
                  <h2 className="text-xl font-semibold">Informations du Nœud</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.nodeInfo.alias && (
                      <div className="p-4 bg-muted rounded-lg">
                        <span className="font-medium">Alias:</span> {result.nodeInfo.alias}
                      </div>
                    )}
                    {result.nodeInfo.capacity && (
                      <div className="p-4 bg-muted rounded-lg">
                        <span className="font-medium">Capacité Totale:</span> {result.nodeInfo.capacity.toLocaleString()} sats
                      </div>
                    )}
                    {result.nodeInfo.channelCount && (
                      <div className="p-4 bg-muted rounded-lg">
                        <span className="font-medium">Nombre de Canaux:</span> {result.nodeInfo.channelCount}
                      </div>
                    )}
                    {result.nodeInfo.avgCapacity && (
                      <div className="p-4 bg-muted rounded-lg">
                        <span className="font-medium">Capacité Moyenne:</span> {result.nodeInfo.avgCapacity.toLocaleString()} sats
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
} 