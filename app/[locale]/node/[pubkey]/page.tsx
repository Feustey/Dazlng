"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface NodeDetails {
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  firstSeen: string;
  updated: string;
  channelsList: Array<{
    remotePubkey: string;
    remoteAlias: string;
    capacity: number;
    lastUpdate: string;
  }>;
}

export default function NodePage() {
  const { pubkey } = useParams();
  const { language } = useLanguage();
  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNodeDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/node/${pubkey}`);
        if (!response.ok) {
          throw new Error("Node not found");
        }
        const data = await response.json();
        setNodeDetails(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (pubkey) {
      loadNodeDetails();
    }
  }, [pubkey]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(1)} BTC`;
    }
    return `${formatNumber(sats)} sats`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement des détails du nœud...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!nodeDetails) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{nodeDetails.alias}</h1>
        <p className="text-muted-foreground mb-8 font-mono">
          {nodeDetails.pubkey}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Capacité Totale
                </div>
                <div className="text-2xl font-bold">
                  {formatSats(nodeDetails.capacity)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Nombre de Canaux
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(nodeDetails.channels)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Première Vue
                </div>
                <div className="text-2xl font-bold">
                  {new Date(nodeDetails.firstSeen).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Dernière Mise à Jour
                </div>
                <div className="text-2xl font-bold">
                  {new Date(nodeDetails.updated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Canaux</h2>
            <div className="space-y-4">
              {nodeDetails.channelsList.map((channel, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="font-semibold">{channel.remoteAlias}</div>
                  <div className="text-sm text-muted-foreground font-mono mb-2">
                    {channel.remotePubkey}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Capacité: {formatSats(channel.capacity)}</span>
                    <span>
                      Mis à jour:{" "}
                      {new Date(channel.lastUpdate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
