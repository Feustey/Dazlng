import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { formatNumber, formatSats } from "@/app/utils/format";

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgChannelsPerNode: number;
}

export default function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null);

  useEffect(() => {
    async function loadNetworkStats() {
      try {
        const response = await fetch("/api/network-summary");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load network stats:", error);
      }
    }

    loadNetworkStats();
  }, []);

  if (!stats) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-4 text-center text-muted-foreground">
              Chargement des statistiques...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.totalNodes)}
            </div>
            <div className="text-muted-foreground">Nœuds Totaux</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.totalChannels)}
            </div>
            <div className="text-muted-foreground">Canaux Totaux</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatSats(stats.totalCapacity)}
            </div>
            <div className="text-muted-foreground">Capacité Totale</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {formatNumber(stats.avgChannelsPerNode)}
            </div>
            <div className="text-muted-foreground">Canaux par Nœud</div>
          </Card>
        </div>
      </div>
    </section>
  );
}
