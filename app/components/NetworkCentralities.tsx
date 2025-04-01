"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { NodeCentrality } from "@/types/node";
import { formatNumber } from "@/lib/utils";

// Données de fallback pour le cas où l'API échoue
const fallbackData: NodeCentrality[] = [
  {
    pubkey: "02d96eadea3d780496b991928bff6b9f0f3f2b0b0b0b0b0b0b0b0b0b0b0b0b0b0",
    betweenness: 0.5,
    closeness: 0.7,
    eigenvector: 0.6,
    degree: 100,
    capacity: 1000000,
    channels: 10,
    avg_fee_rate: 0.0001,
    avg_base_fee: 1000,
    last_update: new Date().toISOString(),
    growth_rate: 0.1,
  },
  {
    pubkey: "03d96eadea3d780496b991928bff6b9f0f3f2b0b0b0b0b0b0b0b0b0b0b0b0b0",
    betweenness: 0.4,
    closeness: 0.6,
    eigenvector: 0.5,
    degree: 80,
    capacity: 800000,
    channels: 8,
    avg_fee_rate: 0.0001,
    avg_base_fee: 1000,
    last_update: new Date().toISOString(),
    growth_rate: 0.08,
  },
  {
    pubkey: "04d96eadea3d780496b991928bff6b9f0f3f2b0b0b0b0b0b0b0b0b0b0b0b0b0",
    betweenness: 0.3,
    closeness: 0.5,
    eigenvector: 0.4,
    degree: 60,
    capacity: 600000,
    channels: 6,
    avg_fee_rate: 0.0001,
    avg_base_fee: 1000,
    last_update: new Date().toISOString(),
    growth_rate: 0.06,
  },
];

export function NetworkCentralities() {
  const [centralities, setCentralities] = useState<NodeCentrality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchCentralities = async () => {
      try {
        const response = await fetch("/api/network/centralities");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des centralités");
        }
        const data = await response.json();
        setCentralities(data);
        setIsUsingFallback(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des centralités:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setCentralities(fallbackData);
        setIsUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCentralities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64 text-destructive">
          <AlertCircle className="h-8 w-8 mr-2" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Centralités du Réseau</h2>
      {isUsingFallback && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Données de démonstration utilisées en raison d'une erreur de
            connexion
          </p>
        </div>
      )}
      <div className="space-y-4">
        {centralities.map((node) => (
          <div key={node.pubkey} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{node.pubkey.slice(0, 20)}...</h3>
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour:{" "}
                  {new Date(node.last_update).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Croissance: {(node.growth_rate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Canaux: {node.channels}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium">Betweenness</p>
                <p className="text-lg">{node.betweenness.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Closeness</p>
                <p className="text-lg">{node.closeness.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Eigenvector</p>
                <p className="text-lg">{node.eigenvector.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Degré</p>
                <p className="text-lg">{node.degree}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacité</p>
                <p className="text-lg">{formatNumber(node.capacity)} sats</p>
              </div>
              <div>
                <p className="text-sm font-medium">Taux de frais moyen</p>
                <p className="text-lg">
                  {(node.avg_fee_rate * 100).toFixed(4)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
