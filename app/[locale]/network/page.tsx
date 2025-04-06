"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select } from "@/app/components/ui/select";
import { NodeList } from "@/app/components/NodeList";
import { NetworkCharts } from "@/app/components/NetworkCharts";
import { networkService } from "@/app/services/networkService";
import { Node } from "@/app/types/network";

export default function NetworkPage() {
  const t = useTranslations("Network");
  const [nodes, setNodes] = useState<Node[]>([]);
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
        setNodes(nodesData);
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
      if (filters.age && parseInt(node.age) < parseInt(filters.age)) {
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
        <div className="text-center">Chargement...</div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button variant="default">{t("actions.addNode")}</Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t("stats.totalNodes")}
          </h3>
          <p className="text-2xl">{networkStats.totalNodes}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t("stats.activeChannels")}
          </h3>
          <p className="text-2xl">{networkStats.totalChannels}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t("stats.totalCapacity")}
          </h3>
          <p className="text-2xl">{networkStats.totalCapacity}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            Taille moyenne des canaux
          </h3>
          <p className="text-2xl">{networkStats.avgChannelSize}</p>
        </Card>
      </div>

      {/* Graphiques */}
      <NetworkCharts nodes={nodes} />

      {/* Filtres */}
      <Card className="p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t("filters.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("filters.capacity")}
            </label>
            <Input
              type="number"
              placeholder="Capacité minimale"
              value={filters.capacity}
              onChange={(e) =>
                setFilters({ ...filters, capacity: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("filters.age")}
            </label>
            <Input
              type="number"
              placeholder="Âge minimum"
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("filters.status")}
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <option value="all">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Liste des nœuds */}
      <NodeList
        nodes={filteredNodes}
        onViewDetails={handleViewDetails}
        onManageChannels={handleManageChannels}
      />
    </div>
  );
}
