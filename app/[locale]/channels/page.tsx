"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { NetworkStats } from "@/components/network/NetworkStats";
import { Loader2 } from "lucide-react";
import { searchNodes } from "@/services/nodeService";
import { Node } from "@/types/network";

export default function ChannelsPage() {
  const t = useTranslations("channels");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <NetworkStats />

      {/* Barre de recherche */}
      <Card className="p-6 mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t("search")
            )}
          </button>
        </div>
      </Card>

      {error && (
        <Card className="p-6 mb-8">
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
    </div>
  );
}
