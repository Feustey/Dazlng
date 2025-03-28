'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface OptimizationResponse {
  recommendations: string[];
  status: string;
}

export default function BotIA() {
  const [pubkey, setPubkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResponse | null>(null);

  const handleOptimize = async () => {
    if (!pubkey) {
      setError('Veuillez entrer une clé publique');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pubkey }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'optimisation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Optimisation IA du Nœud</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Entrez la clé publique du nœud"
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleOptimize} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimisation...
                </>
              ) : (
                'Optimiser'
              )}
            </Button>
          </div>

          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
              <div className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 