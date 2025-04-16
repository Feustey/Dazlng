"use client";

import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import Card from "../ui/card";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import Button from "../ui/button";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PremiumFeatureAccess from "../features/PremiumFeatureAccess";

interface NodeOptimizationRecommendationsProps {
  nodeId: string;
}

export default function NodeOptimizationRecommendations({
  nodeId,
}: NodeOptimizationRecommendationsProps) {
  const t = useTranslations("components.nodeOptimizationRecommendations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationData, setOptimizationData] = useState<{
    suggestedPeers: string[];
    expectedImprovement: number;
    currentScore: number;
    potentialScore: number;
    recommendations: string[];
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const router = useRouter();

  // Fonction pour récupérer les recommandations d'optimisation
  const fetchOptimizationData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/optimize/${nodeId}`, {
        method: "POST",
      });

      if (!response.ok) {
        // Si le statut est 403, c'est que l'utilisateur n'a pas accès à cette fonctionnalité
        if (response.status === 403) {
          // Nous ne définissons pas d'erreur ici, car le composant PremiumFeatureAccess s'occupera d'afficher le message
          setLoading(false);
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'optimisation");
      }

      const data = await response.json();
      setOptimizationData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des recommandations"
      );
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  // Fonction pour lancer manuellement l'optimisation
  const handleOptimize = async () => {
    setIsOptimizing(true);
    await fetchOptimizationData();
    setIsOptimizing(false);
  };

  // Récupérer les recommandations au chargement du composant
  useEffect(() => {
    fetchOptimizationData();
  }, [nodeId, fetchOptimizationData]);

  // Si l'utilisateur n'a pas accès à cette fonctionnalité premium
  if (!loading && !optimizationData && !error) {
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading || isOptimizing ? (
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
              onClick={handleOptimize}
              className="mt-4"
              disabled={isOptimizing}
            >
              {t("retryButton")}
            </Button>
          </div>
        ) : (
          optimizationData && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {t("currentScore")}
                  </span>
                  <span className="text-2xl font-bold">
                    {optimizationData.currentScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {t("potentialScore")}
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {optimizationData.potentialScore.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {t("improvement", {
                      percent: optimizationData.expectedImprovement.toFixed(2),
                    })}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                {t("recommendationsTitle")}
              </h3>
              <ul className="space-y-2 mb-6">
                {optimizationData.recommendations.map((recommendation, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>

              {optimizationData.suggestedPeers.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-3">
                    {t("suggestedPeersTitle")}
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {optimizationData.suggestedPeers.map((peer, i) => (
                      <li
                        key={i}
                        className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-between"
                      >
                        <span className="font-mono text-sm">{peer}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/node/${peer}`)}
                        >
                          {t("viewNodeButton")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="mt-4"
                >
                  {t("refreshButton")}
                </Button>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
