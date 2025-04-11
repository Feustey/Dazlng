"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingDown,
  TrendingUp,
  Loader2,
  Filter,
  Network,
  Activity,
  Zap,
  Users,
} from "lucide-react";
import { NetworkStats } from "../../types/network";
import { searchNodes } from "../../lib/api-client";
import BigPlayers from "@/components/BigPlayers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  if (isStatsLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Canaux Lightning"
      subtitle="Gérez vos canaux et explorez le réseau Lightning"
    >
      {/* Statistiques du réseau */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          gradient
          className="p-6 hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gradient">Nœuds</h3>
              <p className="text-2xl font-bold">
                {networkStats?.totalNodes?.toLocaleString() ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          gradient
          className="p-6 hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gradient">Canaux</h3>
              <p className="text-2xl font-bold">
                {networkStats?.totalChannels?.toLocaleString() ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          gradient
          className="p-6 hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gradient">Capacité</h3>
              <p className="text-2xl font-bold">
                {networkStats?.totalCapacity ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          gradient
          className="p-6 hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gradient">
                Taille Moyenne
              </h3>
              <p className="text-2xl font-bold">
                {networkStats?.avgChannelSize ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un nœud..."
                  className="pl-10 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-[180px] bg-background/50">
                  <SelectValue placeholder="Filtrer par capacité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les capacités</SelectItem>
                  <SelectItem value="small">Petite capacité</SelectItem>
                  <SelectItem value="medium">Capacité moyenne</SelectItem>
                  <SelectItem value="large">Grande capacité</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="gradient"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card gradient className="p-6 mb-8">
          <p className="text-red-500 text-center">{error}</p>
        </Card>
      )}

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Résultats de recherche
            </h3>
            <div className="space-y-4">
              {searchResults.map((node) => (
                <Card
                  key={node.pubkey}
                  className="p-4 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{node.alias}</h4>
                      <p className="text-sm text-muted-foreground">
                        {node.pubkey}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{node.total_capacity} BTC</p>
                      <p className="text-sm text-muted-foreground">
                        {node.active_channels} canaux actifs
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Big Players */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Grands acteurs du réseau
          </h3>
          <BigPlayers />
        </div>
      </Card>
    </PageContainer>
  );
}
