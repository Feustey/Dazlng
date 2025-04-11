"use client";

import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import Card from "./ui/card";
import { CardHeader, CardTitle, CardContent } from "./ui/card";
import Button from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, AlertCircle, TrendingUp, Zap, Scale } from "lucide-react";
import { useTranslations } from "next-intl";
import PremiumFeatureAccess from "./PremiumFeatureAccess";
import { NodeGrowthPrediction as GrowthPredictionType } from "../types/mcpService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface NodeGrowthPredictionProps {
  nodeId: string;
}

export default function NodeGrowthPrediction({
  nodeId,
}: NodeGrowthPredictionProps) {
  const t = useTranslations("components.nodeGrowthPrediction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [predictionData, setPredictionData] =
    useState<GrowthPredictionType | null>(null);

  // Fonction pour récupérer les prédictions de croissance
  const fetchGrowthPrediction = useCallback(
    async (selectedTimeframe: "7d" | "30d" | "90d" = timeframe) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/node/${nodeId}/growth-prediction?timeframe=${selectedTimeframe}`
        );

        if (!response.ok) {
          // Si le statut est 403, c'est que l'utilisateur n'a pas accès à cette fonctionnalité
          if (response.status === 403) {
            // Le composant PremiumFeatureAccess s'occupera d'afficher le message
            setLoading(false);
            return;
          }

          const errorData = await response.json();
          throw new Error(
            errorData.error || "Erreur lors de la récupération des prédictions"
          );
        }

        const data = await response.json();
        setPredictionData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des prédictions de croissance"
        );
      } finally {
        setLoading(false);
      }
    },
    [nodeId, timeframe]
  );

  // Chargement initial des données
  useEffect(() => {
    fetchGrowthPrediction();
  }, [nodeId, fetchGrowthPrediction]);

  // Charger de nouvelles données lorsque le timeframe change
  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as "7d" | "30d" | "90d";
    setTimeframe(newTimeframe);
    fetchGrowthPrediction(newTimeframe);
  };

  // Transformer les données pour le graphique
  const getChartData = () => {
    if (!predictionData || !predictionData.metrics) return [];

    const { dates, capacity, channels, fees } = predictionData.metrics;

    return dates.map((date, index) => ({
      date,
      capacity: capacity[index],
      channels: channels[index],
      fees: fees[index],
    }));
  };

  // Si l'utilisateur n'a pas accès à cette fonctionnalité premium
  if (!loading && !predictionData && !error) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>{t("title")}</CardTitle>
          {predictionData && (
            <TabsList>
              <TabsTrigger
                value="7d"
                onClick={() => handleTimeframeChange("7d")}
                className={
                  timeframe === "7d" ? "bg-primary text-primary-foreground" : ""
                }
              >
                {t("timeframe.7d")}
              </TabsTrigger>
              <TabsTrigger
                value="30d"
                onClick={() => handleTimeframeChange("30d")}
                className={
                  timeframe === "30d"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                {t("timeframe.30d")}
              </TabsTrigger>
              <TabsTrigger
                value="90d"
                onClick={() => handleTimeframeChange("90d")}
                className={
                  timeframe === "90d"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                {t("timeframe.90d")}
              </TabsTrigger>
            </TabsList>
          )}
        </div>
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
              onClick={() => fetchGrowthPrediction()}
              className="mt-4"
            >
              {t("retryButton")}
            </Button>
          </div>
        ) : (
          predictionData && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {t("capacityGrowth")}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    +{predictionData.trends.capacityGrowth.toFixed(2)}%
                  </span>
                </div>

                <div className="flex flex-col p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {t("channelGrowth")}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    +{predictionData.trends.channelGrowth.toFixed(2)}%
                  </span>
                </div>

                <div className="flex flex-col p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-muted-foreground">
                      {t("feeRevenue")}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {predictionData.trends.feeRevenue.toLocaleString()} sats
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t("predictionChart")}
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "",
                        ]}
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString()
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="capacity"
                        name={t("metrics.capacity")}
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="channels"
                        name={t("metrics.channels")}
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="fees"
                        name={t("metrics.fees")}
                        stroke="#f59e0b"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {predictionData.recommendations &&
                predictionData.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("recommendationsTitle")}
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {predictionData.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  {t("confidenceScore")}:{" "}
                  {(predictionData.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("lastUpdated")}:{" "}
                  {new Date(predictionData.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
