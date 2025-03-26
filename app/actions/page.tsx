'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  text: string;
  impact: 'faible' | 'moyen' | 'élevé';
}

export default function ActionsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des recommandations');
        }
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'élevé':
        return 'bg-red-500';
      case 'moyen':
        return 'bg-yellow-500';
      case 'faible':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Recommandations pour votre nœud Lightning</h1>
      <div className="grid gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recommandation {index + 1}</CardTitle>
                <Badge className={getImpactColor(rec.impact)}>
                  Impact: {rec.impact}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{rec.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 