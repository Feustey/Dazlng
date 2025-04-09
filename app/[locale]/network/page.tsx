"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { NodeList } from "../../components/NodeList";
import { NetworkCharts } from "../../components/NetworkCharts";
import NetworkMovers from "../../components/NetworkMovers";
import { networkService } from "../../services/networkService";
import { NetworkNode, Node as NetworkNodeType } from "../../types/network";

interface Node {
  id: string;
  name: string;
  capacity: string;
  channels: number;
  age: string;
  status: "active" | "inactive";
}

function transformNetworkNode(node: NetworkNode): Node {
  return {
    id: node.publicKey,
    name: node.alias,
    capacity: node.capacity.toString(),
    channels: node.channelCount,
    age: "N/A", // À implémenter si nécessaire
    status: "active", // À implémenter si nécessaire
  };
}

function transformToNetworkNodeType(node: NetworkNode): NetworkNodeType {
  return {
    id: node.publicKey,
    publicKey: node.publicKey,
    name: node.alias,
    alias: node.alias,
    color: node.color,
    addresses: node.addresses,
    lastUpdate: node.lastUpdate,
    capacity: node.capacity,
    channelCount: node.channelCount,
    avgChannelSize: node.avgChannelSize,
    channels: [],
    age: 0,
    status: "active",
  };
}

export default function NetworkPage() {
  const t = useTranslations("Network");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    totalChannels: 0,
    totalCapacity: "0 BTC",
    avgChannelSize: "0 BTC",
  });
  const [filters, setFilters] = useState({
    capacity: "",
    age: "",
    status: "all",
  });

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [nodesData, statsData] = await Promise.all([
          networkService.getNodes(),
          networkService.getNetworkStats(),
        ]);
        setNodes(nodesData.map(transformNetworkNode));
        setNetworkNodes(nodesData.map(transformToNetworkNodeType));
        setNetworkStats(statsData);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logique de filtrage
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (
        filters.capacity &&
        parseFloat(node.capacity) < parseFloat(filters.capacity)
      ) {
        return false;
      }
      if (
        filters.age &&
        node.age !== "N/A" &&
        parseInt(node.age) < parseInt(filters.age)
      ) {
        return false;
      }
      if (filters.status !== "all" && node.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [nodes, filters]);

  // Handlers
  const handleViewDetails = async (nodeId: string) => {
    try {
      const nodeDetails = await networkService.getNodeDetails(nodeId);
      console.log("Node details:", nodeDetails);
      // Implémenter la navigation vers la page de détails
    } catch (err) {
      console.error("Error fetching node details:", err);
    }
  };

  const handleManageChannels = async (nodeId: string) => {
    try {
      const channels = await networkService.getNodeChannels(nodeId);
      console.log("Node channels:", channels);
      // Implémenter la gestion des canaux
    } catch (err) {
      console.error("Error fetching node channels:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 animate-shake">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">{t("title")}</h1>
        <Button className="btn-gradient">{t("actions.addNode")}</Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="card-glass p-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-2 text-gradient">
            {t("stats.totalNodes")}
          </h3>
          <p className="text-2xl">{networkStats.totalNodes}</p>
        </Card>
        <Card className="card-glass p-6 animate-slide-up [animation-delay:100ms]">
          <h3 className="text-lg font-semibold mb-2 text-gradient">
            {t("stats.activeChannels")}
          </h3>
          <p className="text-2xl">{networkStats.totalChannels}</p>
        </Card>
        <Card className="card-glass p-6 animate-slide-up [animation-delay:200ms]">
          <h3 className="text-lg font-semibold mb-2 text-gradient">
            {t("stats.totalCapacity")}
          </h3>
          <p className="text-2xl">{networkStats.totalCapacity}</p>
        </Card>
        <Card className="card-glass p-6 animate-slide-up [animation-delay:300ms]">
          <h3 className="text-lg font-semibold mb-2 text-gradient">
            Taille moyenne des canaux
          </h3>
          <p className="text-2xl">{networkStats.avgChannelSize}</p>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="animate-fade-in [animation-delay:400ms]">
        <NetworkCharts nodes={networkNodes} />
      </div>

      {/* Big Movers */}
      <div className="mt-8 animate-fade-in [animation-delay:500ms]">
        <NetworkMovers />
      </div>

      {/* Filtres */}
      <Card className="card-glass p-6 mb-8 animate-slide-up [animation-delay:600ms]">
        <h2 className="text-xl font-semibold mb-4 gradient-text">
          {t("filters.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="number"
              placeholder={t("filters.capacity")}
              className="w-full bg-card/50 backdrop-blur-sm border-accent/20"
              value={filters.capacity}
              onChange={(e) =>
                setFilters({ ...filters, capacity: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder={t("filters.age")}
              className="w-full bg-card/50 backdrop-blur-sm border-accent/20"
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            />
          </div>
          <div>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-full bg-card/50 backdrop-blur-sm border-accent/20">
                <SelectValue placeholder={t("filters.status.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.status.all")}</SelectItem>
                <SelectItem value="active">
                  {t("filters.status.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("filters.status.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Liste des nœuds */}
      <div className="animate-fade-in [animation-delay:700ms]">
        <NodeList
          nodes={filteredNodes}
          onViewDetails={handleViewDetails}
          onManageChannels={handleManageChannels}
        />
      </div>
    </div>
  );
}
