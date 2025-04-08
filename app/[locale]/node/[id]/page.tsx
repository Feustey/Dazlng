"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "../../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function NodePage() {
  const { id } = useParams();
  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNodeDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/node/${id}`);
        if (!response.ok) {
          throw new Error("Nœud non trouvé");
        }
        const data = await response.json();
        setNodeDetails(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadNodeDetails();
    }
  }, [id]);

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
      return `${(sats / 100000000).toFixed(2)} BTC`;
    }
    return `${formatNumber(sats)} sats`;
  };

  const prepareChannelData = () => {
    if (!nodeDetails?.channelsList) return [];
    return nodeDetails.channelsList
      .sort((a, b) => b.capacity - a.capacity)
      .slice(0, 5)
      .map((channel) => ({
        name: channel.remoteAlias.slice(0, 10) + "...",
        capacity: channel.capacity,
      }));
  };

  const prepareCapacityDistribution = () => {
    if (!nodeDetails?.channelsList) return [];
    const totalCapacity = nodeDetails.capacity;
    const otherChannelsCapacity = nodeDetails.channelsList
      .slice(5)
      .reduce((acc, channel) => acc + channel.capacity, 0);

    const data = nodeDetails.channelsList.slice(0, 5).map((channel) => ({
      name: channel.remoteAlias.slice(0, 10) + "...",
      value: (channel.capacity / totalCapacity) * 100,
    }));

    if (otherChannelsCapacity > 0) {
      data.push({
        name: "Autres",
        value: (otherChannelsCapacity / totalCapacity) * 100,
      });
    }

    return data;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{nodeDetails.alias}</h1>
          <p className="text-muted-foreground font-mono">
            {nodeDetails.pubkey}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Statistiques Générales
            </h2>
            <div className="grid grid-cols-2 gap-6">
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
                <div className="text-lg font-medium">
                  {new Date(nodeDetails.firstSeen).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Dernière Mise à Jour
                </div>
                <div className="text-lg font-medium">
                  {new Date(nodeDetails.updated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Distribution de la Capacité
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareCapacityDistribution()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name} (${value.toFixed(1)}%)`
                    }
                  >
                    {prepareCapacityDistribution().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            Top 5 Canaux par Capacité
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareChannelData()}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatSats(value)} />
                <Tooltip
                  formatter={(value: number) => [formatSats(value), "Capacité"]}
                />
                <Bar dataKey="capacity" fill="#8884d8">
                  {prepareChannelData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Liste des Canaux</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nœud Distant</th>
                  <th className="text-right py-2">Capacité</th>
                  <th className="text-right py-2">Dernière Mise à Jour</th>
                </tr>
              </thead>
              <tbody>
                {nodeDetails.channelsList.map((channel) => (
                  <tr key={channel.remotePubkey} className="border-b">
                    <td className="py-2">
                      <div className="font-medium">{channel.remoteAlias}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {channel.remotePubkey}
                      </div>
                    </td>
                    <td className="text-right py-2">
                      {formatSats(channel.capacity)}
                    </td>
                    <td className="text-right py-2">
                      {new Date(channel.lastUpdate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
