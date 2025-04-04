"use client";

import { Card } from "@/app/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search, ChevronDown, TrendingDown } from "lucide-react";
import { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  const stats = {
    nodes: {
      count: 11516,
      change: -1.98,
    },
    channels: {
      count: 42698,
      change: -4.8,
    },
    capacity: {
      btc: 4342.3,
      usd: 358630639.6,
      change: -8,
    },
    countdown: {
      blocks: 988484,
      percentage: 1.2,
    },
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/nodes/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setError(
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
                {stats.nodes.count.toLocaleString()}
              </span>
              <div className="flex items-center text-red-500">
                <TrendingDown className="h-4 w-4" />
                <span>{stats.nodes.change}%</span>
              </div>
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
                {stats.channels.count.toLocaleString()}
              </span>
              <div className="flex items-center text-red-500">
                <TrendingDown className="h-4 w-4" />
                <span>{stats.channels.change}%</span>
              </div>
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
                  {stats.capacity.btc.toLocaleString()} BTC
                </span>
                <div className="flex items-center text-red-500">
                  <TrendingDown className="h-4 w-4" />
                  <span>{stats.capacity.change}%</span>
                </div>
              </div>
              <span className="text-muted-foreground">
                ${stats.capacity.usd.toLocaleString()}
              </span>
            </div>
            <Button variant="ghost" className="mt-4">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Node Countdown</h2>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {stats.countdown.blocks.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                {stats.countdown.percentage}%
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
