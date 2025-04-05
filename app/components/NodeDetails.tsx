"use client";

import { useEffect } from "react";
import { useApi } from "@/app/hooks/useApi";
import { useAlert } from "@/app/hooks/useAlert";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/app/components/Loading";
import ApiError from "@/app/components/ApiError";
import ChannelMap from "@/app/components/ChannelMap";
import NodePerformance from "@/app/components/NodePerformance";
import NodeGeneralInfo from "@/app/components/NodeGeneralInfo";
import ChannelList from "@/app/components/ChannelList";

interface Channel {
  id: string;
  remoteNodeId: string;
  capacity: number;
  age: number;
}

interface NodeStats {
  totalCapacity: number;
  channelCount: number;
  lastUpdate: string;
  address: string;
  biggestChannel: number;
  smallestChannel: number;
  oldestChannel: number;
  youngestChannel: number;
  channels: Channel[];
  performance?: {
    successRate: number;
    routingTime: number;
    averageFee: number;
    monthlyVolume: number;
    weeklyStats: {
      day: string;
      volume: number;
      successRate: number;
    }[];
  };
}

interface NodeDetailsProps {
  nodeId: string;
}

export default function NodeDetails({ nodeId }: NodeDetailsProps) {
  const { data: stats, error, isLoading, execute } = useApi<NodeStats>();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchNodeStats = async () => {
      try {
        const response = await fetch(`/api/node/${nodeId}`);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les informations du nœud");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    };

    execute(fetchNodeStats(), {
      onSuccess: () => {
        showAlert("success", "Informations du nœud mises à jour");
      },
    });
  }, [nodeId, execute, showAlert]);

  if (isLoading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ApiError error={error} />
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Nœud {nodeId}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-primary">
              Capacité totale
            </h2>
            <p className="text-2xl font-bold text-primary-foreground">
              {stats.totalCapacity.toLocaleString()} sats
            </p>
          </div>
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-secondary">
              Nombre de canaux
            </h2>
            <p className="text-2xl font-bold text-secondary-foreground">
              {stats.channelCount}
            </p>
          </div>
          <div className="bg-accent/10 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-accent">
              Dernière mise à jour
            </h2>
            <p className="text-2xl font-bold text-accent-foreground">
              {new Date(stats.lastUpdate).toLocaleString()}
            </p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="channels">Canaux</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <NodeGeneralInfo info={stats} />
          </TabsContent>

          <TabsContent value="channels">
            <ChannelList channels={stats.channels} />
          </TabsContent>

          <TabsContent value="map">
            <ChannelMap channels={stats.channels} />
          </TabsContent>

          <TabsContent value="performance">
            {stats.performance && <NodePerformance stats={stats.performance} />}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
