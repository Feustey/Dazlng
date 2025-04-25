"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { McpService } from "@/lib/mcpService";
import type {
  NodeGrowthPrediction,
  NetworkTrendsPrediction,
  FeeMarketAnalysis,
} from "@/types/node";
import { TrendingUp, Activity, Zap, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";

// Données mockées pour le développement
const mockNodeGrowthPrediction: NodeGrowthPrediction = {
  pubkey: "02eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619",
  timeframe: "30d",
  metrics: {
    capacity: [1000000, 1200000, 1400000, 1600000, 1800000, 2000000],
    channels: [10, 12, 15, 18, 20, 25],
    fees: [5000, 6000, 7500, 9000, 10000, 12500],
    dates: [
      "2024-04-01",
      "2024-04-07",
      "2024-04-14",
      "2024-04-21",
      "2024-04-28",
      "2024-05-05",
    ],
  },
  confidence: 0.85,
  trends: {
    capacityGrowth: 25,
    channelGrowth: 30,
    feeRevenue: 150000,
  },
  recommendations: [
    "Augmentez votre capacité avec les nœuds à forte centralité",
    "Considérez d'ouvrir 3-5 nouveaux canaux avec des nœuds bien connectés",
    "Ajustez vos frais dans les canaux existants pour optimiser le routage",
  ],
  timestamp: new Date().toISOString(),
};

const mockNetworkTrendsPrediction: NetworkTrendsPrediction = {
  timeframe: "30d",
  metrics: {
    capacity: [
      950000000, 975000000, 1000000000, 1050000000, 1100000000, 1150000000,
    ],
    channels: [65000, 66500, 68000, 70000, 72000, 74000],
    fees: [25000000, 26000000, 27000000, 28500000, 30000000, 32000000],
    dates: [
      "2024-04-01",
      "2024-04-07",
      "2024-04-14",
      "2024-04-21",
      "2024-04-28",
      "2024-05-05",
    ],
  },
  confidence: 0.92,
  trends: {
    capacityGrowth: 15,
    nodesGrowth: 8,
    channelsGrowth: 12,
    avgFeeRate: 450,
  },
  hotspots: [
    {
      pubkey:
        "02eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619",
      alias: "ACINQ",
      growth: 35,
    },
    {
      pubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      alias: "Lightning Power Users",
      growth: 28,
    },
    {
      pubkey:
        "039cc950286a8be8f6f10c31d91fadba2c50ea2c134ef0df043eba7798a11831b",
      alias: "Bitfinex",
      growth: 22,
    },
  ],
  timestamp: new Date().toISOString(),
};

const mockFeeMarketAnalysis: FeeMarketAnalysis = {
  average: {
    base_fee: 1000,
    fee_rate: 350,
  },
  distribution: {
    ranges: [
      { min: 0, max: 200, count: 15000 },
      { min: 201, max: 400, count: 25000 },
      { min: 401, max: 600, count: 12000 },
      { min: 601, max: 800, count: 6000 },
      { min: 801, max: 1000, count: 2000 },
      { min: 1001, max: 2000, count: 1000 },
    ],
    percentiles: {
      p10: 150,
      p25: 250,
      p50: 350,
      p75: 500,
      p90: 700,
    },
  },
  recommendations: {
    low: 200,
    medium: 400,
    high: 600,
  },
  timestamp: new Date().toISOString(),
};

function formatSats(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M sats`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K sats`;
  }
  return `${value} sats`;
}

// Formatter les données pour les graphiques
function prepareGrowthDataForChart(
  prediction: NodeGrowthPrediction | NetworkTrendsPrediction
) {
  return prediction.metrics.dates.map((date, index) => ({
    date,
    capacity: prediction.metrics.capacity[index],
    channels: prediction.metrics.channels[index],
    fees: prediction.metrics.fees[index],
  }));
}

export default function PredictionModule() {
  const [nodePubkey, setNodePubkey] = useState("");
  const [timeframe, setTimeframe] = useState("7d");
  const [nodeGrowth, setNodeGrowth] = useState<NodeGrowthPrediction | null>(
    null
  );
  const [networkTrends, setNetworkTrends] =
    useState<NetworkTrendsPrediction | null>(null);
  const [feeMarket, setFeeMarket] = useState<FeeMarketAnalysis | null>(null);
  const [loadingNode, setLoadingNode] = useState(false);
  const [loadingNetwork, setLoadingNetwork] = useState(false);
  const [loadingFee, setLoadingFee] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mcpService = McpService.getInstance();

  // Simuler le chargement des données pour le développement
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setNodeGrowth(mockNodeGrowthPrediction);
      setNetworkTrends(mockNetworkTrendsPrediction);
      setFeeMarket(mockFeeMarketAnalysis);
    }
  }, []);

  const handleFetchNodeGrowth = async () => {
    setLoadingNode(true);
    try {
      if (process.env.NODE_ENV === "development") {
        // En développement, simuler une réponse
        setTimeout(() => {
          setNodeGrowth({
            pubkey: nodePubkey,
            timeframe: "7d",
            metrics: {
              capacity: [1000000, 1100000, 1200000],
              channels: [10, 12, 14],
              fees: [1000, 1200, 1400],
              dates: ["2024-01-01", "2024-01-08", "2024-01-15"],
            },
            confidence: 0.85,
            trends: {
              capacityGrowth: 0.15,
              channelGrowth: 0.2,
              feeRevenue: 0.3,
            },
            recommendations: ["Augmenter la capacité", "Ouvrir plus de canaux"],
            timestamp: new Date().toISOString(),
          });
          setLoadingNode(false);
        }, 1000);
      } else {
        // En production, utiliser l'API réelle
        const prediction = await mcpService.predictNodeGrowth(nodePubkey);
        setNodeGrowth(prediction);
        setLoadingNode(false);
      }
    } catch (error) {
      console.error("Erreur lors de la prédiction de croissance:", error);
      setLoadingNode(false);
    }
  };

  const handleFetchNetworkTrends = async () => {
    setLoadingNetwork(true);
    try {
      if (process.env.NODE_ENV === "development") {
        // En développement, simuler une réponse
        setTimeout(() => {
          setNetworkTrends({
            timeframe: "30d",
            metrics: {
              capacity: [5000000000, 5500000000, 6000000000],
              channels: [100000, 110000, 120000],
              fees: [0.0001, 0.00012, 0.00015],
              dates: ["2024-01-01", "2024-01-15", "2024-01-30"],
            },
            confidence: 0.9,
            trends: {
              capacityGrowth: 0.2,
              nodesGrowth: 0.15,
              channelsGrowth: 0.1,
              avgFeeRate: 0.00012,
            },
            hotspots: [
              {
                pubkey: "node1",
                alias: "Node 1",
                growth: 0.25,
              },
              {
                pubkey: "node2",
                alias: "Node 2",
                growth: 0.2,
              },
            ],
            timestamp: new Date().toISOString(),
          });
          setLoadingNetwork(false);
        }, 1000);
      } else {
        // En production, utiliser l'API réelle
        const prediction = await mcpService.predictNetworkTrends();
        setNetworkTrends(prediction);
        setLoadingNetwork(false);
      }
    } catch (error) {
      console.error("Erreur lors de la prédiction des tendances:", error);
      setLoadingNetwork(false);
    }
  };

  const handleFetchFeeMarket = async () => {
    setLoadingFee(true);
    try {
      if (process.env.NODE_ENV === "development") {
        // En développement, simuler une réponse
        setTimeout(() => {
          setFeeMarket({
            average: {
              base_fee: 1000,
              fee_rate: 0.0001,
            },
            distribution: {
              ranges: [
                { min: 0, max: 1000, count: 100 },
                { min: 1000, max: 5000, count: 200 },
                { min: 5000, max: 10000, count: 50 },
              ],
              percentiles: {
                p10: 500,
                p25: 1000,
                p50: 2000,
                p75: 5000,
                p90: 8000,
              },
            },
            recommendations: {
              low: 0.00005,
              medium: 0.0001,
              high: 0.0002,
            },
            timestamp: new Date().toISOString(),
          });
          setLoadingFee(false);
        }, 1000);
      } else {
        // En production, utiliser l'API réelle
        const analysis = await mcpService.analyzeFeeMarket();
        setFeeMarket(analysis);
        setLoadingFee(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse du marché des frais:", error);
      setLoadingFee(false);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="node" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="node">Prédictions de Nœud</TabsTrigger>
          <TabsTrigger value="network">Tendances du Réseau</TabsTrigger>
          <TabsTrigger value="fees">Analyse des Frais</TabsTrigger>
        </TabsList>

        {/* Prédictions de croissance de nœud */}
        <TabsContent value="node">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Prédictive de Nœud</CardTitle>
              <CardDescription>
                Prédisez la croissance et les performances futures d'un nœud
                Lightning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Clé publique du nœud (hex)"
                      value={nodePubkey}
                      onChange={(e) => setNodePubkey(e.target.value)}
                    />
                  </div>
                  <Select
                    value={timeframe}
                    onValueChange={(v) =>
                      setTimeframe(v as "7d" | "30d" | "90d")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                      <SelectItem value="90d">90 jours</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleFetchNodeGrowth}
                    disabled={loadingNode}
                  >
                    {loadingNode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement
                      </>
                    ) : (
                      "Analyser"
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {nodeGrowth && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Croissance de Capacité
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                            <span className="text-2xl font-bold">
                              +{nodeGrowth.trends.capacityGrowth}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Prévision de {timeframe}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Croissance de Canaux
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-2xl font-bold">
                              +{nodeGrowth.trends.channelGrowth}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Prévision de {timeframe}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Revenus de Frais
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                            <span className="text-2xl font-bold">
                              {formatSats(nodeGrowth.trends.feeRevenue)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Prévision de {timeframe}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={prepareGrowthDataForChart(nodeGrowth)}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8884d8"
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#82ca9d"
                          />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              if (name === "capacity")
                                return [formatSats(value), "Capacité"];
                              if (name === "channels") return [value, "Canaux"];
                              return [formatSats(value), "Frais"];
                            }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="capacity"
                            stroke="#8884d8"
                            name="Capacité"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="channels"
                            stroke="#82ca9d"
                            name="Canaux"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Recommandations
                      </h3>
                      <div className="space-y-2">
                        {nodeGrowth.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                              {i + 1}
                            </div>
                            <p>{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Indice de confiance:{" "}
                      {Math.round(nodeGrowth.confidence * 100)}% • Dernière mise
                      à jour: {new Date(nodeGrowth.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tendances du réseau */}
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Tendances du Réseau Lightning</CardTitle>
              <CardDescription>
                Découvrez comment le réseau Lightning Network évoluera dans les
                prochains jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-row gap-4">
                  <Select
                    value={timeframe}
                    onValueChange={(v) =>
                      setTimeframe(v as "7d" | "30d" | "90d")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                      <SelectItem value="90d">90 jours</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleFetchNetworkTrends}
                    disabled={loadingNetwork}
                  >
                    {loadingNetwork ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement
                      </>
                    ) : (
                      "Analyser"
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {networkTrends && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Capacité du Réseau
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                            <span className="text-2xl font-bold">
                              +{networkTrends.trends.capacityGrowth}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Croissance des Nœuds
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-2xl font-bold">
                              +{networkTrends.trends.nodesGrowth}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Croissance des Canaux
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-purple-500" />
                            <span className="text-2xl font-bold">
                              +{networkTrends.trends.channelsGrowth}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Frais Moyens
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                            <span className="text-2xl font-bold">
                              {networkTrends.trends.avgFeeRate} ppm
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={prepareGrowthDataForChart(networkTrends)}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number) => formatSats(value)}
                          />
                          <Area
                            type="monotone"
                            dataKey="capacity"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                            name="Capacité Totale"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Nœuds à Forte Croissance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {networkTrends.hotspots.map((spot, i) => (
                          <Card key={i} className="bg-card/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">
                                {spot.alias}
                              </CardTitle>
                              <CardDescription className="text-xs truncate">
                                {spot.pubkey}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                                <span className="text-xl font-bold">
                                  +{spot.growth}%
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Indice de confiance:{" "}
                      {Math.round(networkTrends.confidence * 100)}% • Dernière
                      mise à jour:{" "}
                      {new Date(networkTrends.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse des frais */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Analyse du Marché des Frais</CardTitle>
              <CardDescription>
                Comprenez la structure actuelle des frais et optimisez votre
                stratégie de tarification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={handleFetchFeeMarket} disabled={loadingFee}>
                    {loadingFee ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement
                      </>
                    ) : (
                      "Rafraîchir"
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                )}

                {feeMarket && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Frais de Base Moyens
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">
                              {feeMarket.average.base_fee} sats
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Taux de Frais Moyen
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">
                              {feeMarket.average.fee_rate} ppm
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={feeMarket.distribution.ranges.map((range) => ({
                            label: `${range.min}-${range.max}`,
                            count: range.count,
                          }))}
                          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis
                            dataKey="label"
                            label={{
                              value: "Taux de Frais (ppm)",
                              position: "bottom",
                              offset: 0,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Nombre de Canaux",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip />
                          <Bar dataKey="count" name="Canaux" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Recommandations de Frais
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-green-500/10 border-green-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Frais Bas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {feeMarket.recommendations.low} ppm
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Pour volume élevé
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-500/10 border-blue-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Frais Moyens
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {feeMarket.recommendations.medium} ppm
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Equilibre volume/profit
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-purple-500/10 border-purple-500/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                              Frais Élevés
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {feeMarket.recommendations.high} ppm
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Pour maximiser profit
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Percentiles du Marché
                      </h3>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            10%
                          </div>
                          <div className="font-bold">
                            {feeMarket.distribution.percentiles.p10} ppm
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            25%
                          </div>
                          <div className="font-bold">
                            {feeMarket.distribution.percentiles.p25} ppm
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            50%
                          </div>
                          <div className="font-bold">
                            {feeMarket.distribution.percentiles.p50} ppm
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            75%
                          </div>
                          <div className="font-bold">
                            {feeMarket.distribution.percentiles.p75} ppm
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            90%
                          </div>
                          <div className="font-bold">
                            {feeMarket.distribution.percentiles.p90} ppm
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Dernière mise à jour:{" "}
                      {new Date(feeMarket.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
