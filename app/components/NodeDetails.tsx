"use client";

import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import {
  BarChart3,
  Zap,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Link,
  Share2,
  Star,
  Bell,
  ChevronRight,
  Globe,
  Twitter,
  MessageCircle,
} from "lucide-react";
import ChannelMap from "./ChannelMap";
import NodePerformance from "./NodePerformance";
import NodeGeneralInfo from "./NodeGeneralInfo";
import ChannelList from "./ChannelList";

interface NodeDetailsProps {
  nodeId: string;
}

interface Channel {
  id: string;
  remoteNodeId: string;
  capacity: number;
  age: string;
}

interface PerformanceStats {
  successRate: number;
  routingTime: number;
  averageFee: number;
  monthlyVolume: number;
  weeklyStats: {
    date: string;
    successRate: number;
    volume: number;
  }[];
}

interface NodeStats {
  totalCapacity: number;
  channelCount: number;
  lastUpdate: string;
  averageChannelSize: number;
  medianChannelSize: number;
  biggestChannel: number;
  smallestChannel: number;
  oldestChannel: string;
  youngestChannel: string;
  averageChannelAge: string;
  medianChannelAge: string;
  address: string;
  channelsRank: number;
  capacityRank: number;
  channels: Channel[];
  performance?: PerformanceStats;
}

export default function NodeDetails({ nodeId }: NodeDetailsProps) {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeStats = async () => {
      try {
        // Simuler des données pour le nœud spécifié
        // Dans une implémentation réelle, vous feriez un appel API avec nodeId
        const mockStats: NodeStats = {
          totalCapacity: 125000000,
          channelCount: 42,
          lastUpdate: "2 heures",
          averageChannelSize: 2976190,
          medianChannelSize: 2500000,
          biggestChannel: 10000000,
          smallestChannel: 500000,
          oldestChannel: "2 ans",
          youngestChannel: "1 jour",
          averageChannelAge: "6 mois",
          medianChannelAge: "4 mois",
          address: nodeId,
          channelsRank: 1250,
          capacityRank: 980,
          channels: Array.from({ length: 10 }).map((_, i) => ({
            id: `channel-${i}`,
            remoteNodeId: `02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b`,
            capacity: 1000000 + i * 500000,
            age: `${i + 1} mois`,
          })),
          performance: {
            successRate: 98.5,
            routingTime: 125,
            averageFee: 0.05,
            monthlyVolume: 50000000,
            weeklyStats: [
              { date: "Lun", successRate: 97.8, volume: 12000000 },
              { date: "Mar", successRate: 98.2, volume: 13500000 },
              { date: "Mer", successRate: 98.7, volume: 14200000 },
              { date: "Jeu", successRate: 98.5, volume: 13800000 },
              { date: "Ven", successRate: 98.9, volume: 15000000 },
              { date: "Sam", successRate: 98.3, volume: 11000000 },
              { date: "Dim", successRate: 98.6, volume: 10500000 },
            ],
          },
        };

        setStats(mockStats);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les statistiques du nœud.");
        setIsLoading(false);
      }
    };

    fetchNodeStats();
  }, [nodeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}k sats`;
    }
    return `${sats} sats`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-blue-50 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Feustey</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-white">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Favori
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  <Bell className="h-4 w-4 mr-1 text-blue-500" />
                  Notifier
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4 break-all">
              {stats.address}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Globe className="h-4 w-4 mr-1 text-blue-500" />
                Site web
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Twitter className="h-4 w-4 mr-1 text-blue-400" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <MessageCircle className="h-4 w-4 mr-1 text-purple-500" />
                Nostr
              </Button>
            </div>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Capacité Totale</h3>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {formatSats(stats.totalCapacity)}
              </div>
              <div className="text-sm text-gray-600">
                Rang: #{stats.capacityRank}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center mb-2">
                <Link className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Nombre de Canaux
                </h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.channelCount}
              </div>
              <div className="text-sm text-gray-600">
                Rang: #{stats.channelsRank}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Taille Moyenne des Canaux
                </h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatSats(stats.averageChannelSize)}
              </div>
              <div className="text-sm text-gray-600">
                Médiane: {formatSats(stats.medianChannelSize)}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-gray-800">
                  Âge Moyen des Canaux
                </h3>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.averageChannelAge}
              </div>
              <div className="text-sm text-gray-600">
                Médiane: {stats.medianChannelAge}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
          >
            Général
          </TabsTrigger>
          <TabsTrigger
            value="channels"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            Canaux
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            Carte des Canaux
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <NodeGeneralInfo
            info={{
              lastUpdate: stats.lastUpdate,
              address: stats.address,
              biggestChannel: stats.biggestChannel,
              smallestChannel: stats.smallestChannel,
              oldestChannel: stats.oldestChannel,
              youngestChannel: stats.youngestChannel,
            }}
          />
        </TabsContent>

        <TabsContent value="channels" className="mt-4">
          <ChannelList channels={stats.channels} />
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <ChannelMap channels={stats.channels} />
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <NodePerformance stats={stats.performance} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
