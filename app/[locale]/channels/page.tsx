"use client";

import { Card } from "@/app/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { NetworkStats } from "@/app/types/network";
import { searchNodes } from "@/app/lib/api-client";

interface Node {
  pubkey: string;
  alias: string;
  platform?: string;
  version?: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  uptime?: number;
}

export default function ChannelsPage() {
  const t = useTranslations("channels");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      setIsStatsLoading(true);
      try {
        const response = await fetch("/api/network/stats");
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setNetworkStats(data);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Une erreur inconnue s'est produite");
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
        setError("Impossible de charger les statistiques du réseau.");
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchNetworkStats();
    const interval = setInterval(fetchNetworkStats, 300000); // Rafraîchir toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Veuillez entrer un terme de recherche");
      return;
    }

    if (searchQuery.length < 3) {
      setError("La recherche doit contenir au moins 3 caractères");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchNodes(searchQuery);

      if (Array.isArray(data) && data.length === 0) {
        setError("Aucun résultat trouvé pour votre recherche");
        setSearchResults([]);
      } else {
        setSearchResults(Array.isArray(data) ? data : []);
        setError(null);
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Une erreur inconnue s'est produite");
      console.error("Erreur lors de la recherche:", error);
      setError(
        error.message ||
          "Impossible de charger les résultats. Veuillez réessayer plus tard."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Lightning Network Search and Analysis Engine
      </h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="node public key, alias, IP address, channel id, block height, location, postal code..."
          className="w-full pl-12 pr-4 h-14 text-lg rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-8 h-11"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Recherche..." : "SEARCH"}
        </Button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Résultats de recherche</h2>
          <div className="grid gap-4">
            {searchResults.map((node) => (
              <Card key={node.pubkey} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {node.alias || "Nœud sans alias"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {node.pubkey}
                    </p>
                    <div className="mt-2 text-sm">
                      <p>Capacité totale: {node.total_capacity} sats</p>
                      <p>Canaux actifs: {node.active_channels}</p>
                      <p>Pairs totaux: {node.total_peers}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir les détails
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Number of Nodes</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {isStatsLoading
                  ? "..."
                  : (networkStats?.totalNodes?.toLocaleString() ?? "N/A")}
              </span>
              {!isStatsLoading &&
                networkStats?.topNodes &&
                networkStats.totalNodes &&
                networkStats.topNodes.length > 0 && (
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      +
                      {(
                        (networkStats.topNodes.length /
                          networkStats.totalNodes) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                )}
            </div>
            <Button variant="ghost" className="mt-4">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Number of Channels</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {isStatsLoading
                  ? "..."
                  : (networkStats?.totalChannels?.toLocaleString() ?? "N/A")}
              </span>
              {!isStatsLoading &&
                networkStats?.recentChannels &&
                networkStats.totalChannels &&
                networkStats.recentChannels.length > 0 && (
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      +
                      {(
                        (networkStats.recentChannels.length /
                          networkStats.totalChannels) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                )}
            </div>
            <Button variant="ghost" className="mt-4">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Network Capacity</h2>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {isStatsLoading
                    ? "..."
                    : networkStats?.totalCapacity
                      ? (
                          Number(networkStats.totalCapacity) / 100000000
                        ).toFixed(2)
                      : "N/A"}{" "}
                  BTC
                </span>
                {!isStatsLoading &&
                  networkStats?.capacityHistory &&
                  networkStats.capacityHistory.length > 0 && (
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        +
                        {(
                          (networkStats.capacityHistory[0].value /
                            Number(networkStats.totalCapacity)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  )}
              </div>
              <span className="text-muted-foreground">
                $
                {networkStats?.totalCapacity
                  ? (
                      Number(networkStats.totalCapacity) * 0.00004
                    ).toLocaleString()
                  : "..."}
              </span>
            </div>
            <Button variant="ghost" className="mt-4">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Average Channel Size</h2>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {isStatsLoading
                  ? "..."
                  : networkStats?.avgCapacityPerChannel
                    ? (networkStats.avgCapacityPerChannel / 100000000).toFixed(
                        4
                      )
                    : "N/A"}{" "}
                BTC
              </span>
              <span className="text-muted-foreground">
                {isStatsLoading
                  ? "..."
                  : networkStats?.avgChannelsPerNode
                    ? networkStats.avgChannelsPerNode.toFixed(1)
                    : "N/A"}{" "}
                channels/node
              </span>
            </div>
            <Button variant="ghost" className="mt-4">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
