"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../components/ui/use-toast";
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

interface NodeDetailsData {
  _id: string;
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  firstSeen: string;
  updated: string;
  status: string;
  version: string;
  blockHeight: number;
  peers: number;
  channelsList: Array<{
    remotePubkey: string;
    remoteAlias: string;
    capacity: number;
    lastUpdate: string;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface Props {
  id: string;
}

export default function NodeDetails({ id }: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [node, setNode] = useState<NodeDetailsData | null>(null);

  useEffect(() => {
    async function fetchNode() {
      try {
        const response = await fetch(`/api/node/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch node");
        }
        const data = await response.json();
        setNode(data);
      } catch (error) {
        addToast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du nœud.",
          type: "error",
        });
        router.push("/nodes");
      }
    }

    fetchNode();
  }, [id, router, addToast]);

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
    if (!node?.channelsList) return [];
    return node.channelsList
      .sort((a, b) => b.capacity - a.capacity)
      .slice(0, 5)
      .map((channel) => ({
        name: channel.remoteAlias.slice(0, 10) + "...",
        capacity: channel.capacity,
      }));
  };

  const prepareCapacityDistribution = () => {
    if (!node?.channelsList) return [];
    const totalCapacity = node.capacity;
    const otherChannelsCapacity = node.channelsList
      .slice(5)
      .reduce((acc, channel) => acc + channel.capacity, 0);

    const data = node.channelsList.slice(0, 5).map((channel) => ({
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

  if (!node) {
    return null;
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Détails du nœud</CardTitle>
          <CardDescription>ID : {node._id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Statut</h4>
              <p className="text-sm text-muted-foreground">{node.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Version</h4>
              <p className="text-sm text-muted-foreground">{node.version}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Hauteur de bloc</h4>
              <p className="text-sm text-muted-foreground">
                {node.blockHeight}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Pairs</h4>
              <p className="text-sm text-muted-foreground">{node.peers}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push("/nodes")}
            variant="outline"
            className="w-full"
          >
            Retour à la liste
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
