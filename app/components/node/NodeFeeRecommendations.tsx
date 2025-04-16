"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "../ui/card";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import Button from "../ui/button";
import {
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import PremiumFeatureAccess from "../features/PremiumFeatureAccess";
import { FeeRecommendation } from "../../services/premiumMcpService";

interface NodeFeeRecommendationsProps {
  nodeId: string;
}

export default function NodeFeeRecommendations({
  nodeId,
}: NodeFeeRecommendationsProps) {
  const t = useTranslations("components.nodeFeeRecommendations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<
    FeeRecommendation[] | null
  >(null);

  // Fonction pour récupérer les recommandations de frais
  const fetchFeeRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/node/${nodeId}/fee-recommendations`);

      if (!response.ok) {
        // Si le statut est 403, c'est que l'utilisateur n'a pas accès à cette fonctionnalité
        if (response.status === 403) {
          // Le composant PremiumFeatureAccess s'occupera d'afficher le message
          setLoading(false);
          return;
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Erreur lors de la récupération des recommandations"
        );
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des recommandations de frais"
      );
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  // Récupérer les recommandations au chargement du composant
  useEffect(() => {
    fetchFeeRecommendations();
  }, [nodeId, fetchFeeRecommendations]);

  // Si l'utilisateur n'a pas accès à cette fonctionnalité premium
  if (!loading && !recommendations && !error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumFeatureAccess
            nodeId={nodeId}
            featureName={t("featureName")}
          />
        </CardContent>
      </Card>
    );
  }

  // Fonction pour obtenir la classe de couleur selon l'impact
  const getImpactColorClass = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "medium":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";
      case "low":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  // Fonction pour afficher une variation (hausse ou baisse)
  const renderChange = (currentValue: number, recommendedValue: number) => {
    const isIncrease = recommendedValue > currentValue;
    const percentChange = (
      (Math.abs(recommendedValue - currentValue) / currentValue) *
      100
    ).toFixed(1);

    return (
      <div className="flex items-center">
        {isIncrease ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-blue-500 mr-1" />
        )}
        <span className={isIncrease ? "text-green-500" : "text-blue-500"}>
          {isIncrease ? "+" : "-"}
          {percentChange}%
        </span>
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-red-500">
            <AlertCircle className="h-8 w-8 mb-4" />
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={fetchFeeRecommendations}
              className="mt-4"
            >
              {t("retryButton")}
            </Button>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {t("description")}
            </p>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`rounded-md p-4 border ${getImpactColorClass(rec.impact)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">
                        {rec.peerAlias || t("peer")}
                      </h4>
                      <p className="text-xs font-mono truncate max-w-xs">
                        {rec.peerPubkey}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-medium uppercase">
                      {t(`impact.${rec.impact}`)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("currentBaseFeeMsat")}
                      </p>
                      <div className="flex justify-between">
                        <p className="font-medium">{rec.currentBaseFeeMsat}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("recommendedBaseFeeMsat")}
                      </p>
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {rec.recommendedBaseFeeMsat}
                        </p>
                        {renderChange(
                          rec.currentBaseFeeMsat,
                          rec.recommendedBaseFeeMsat
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("currentFeeRate")}
                      </p>
                      <div className="flex justify-between">
                        <p className="font-medium">{rec.currentFeeRate} ppm</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("recommendedFeeRate")}
                      </p>
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {rec.recommendedFeeRate} ppm
                        </p>
                        {renderChange(
                          rec.currentFeeRate,
                          rec.recommendedFeeRate
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      {t("expectedRevenue")}: +{rec.expectedRevenue} sats
                    </p>
                    <p className="text-sm mt-1">{rec.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={fetchFeeRecommendations}>
                {t("refreshButton")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>{t("noRecommendations")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
