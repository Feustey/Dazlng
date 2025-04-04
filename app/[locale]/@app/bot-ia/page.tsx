"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface AnalysisResponse {
  recommendations: string[];
  status: string;
  nodeInfo?: {
    alias?: string;
    capacity?: number;
    channelCount?: number;
    avgCapacity?: number;
    betweenness?: number;
    closeness?: number;
    eigenvector?: number;
  };
  networkMetrics?: {
    totalNodes: number;
    totalChannels: number;
    totalCapacity: number;
    avgCapacityPerChannel: number;
    avgChannelsPerNode: number;
  };
  peersOfPeers?: Array<{
    peerPubkey: string;
    alias: string;
    totalCapacity: number;
    activeChannels: number;
    totalPeers: number;
  }>;
}

export default function BotIA() {
  const t = useTranslations("bot-ia");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchInitialAnalysis();
  }, []);

  const fetchInitialAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/optimize", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!userQuestion.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/bot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsAnalyzing(false);
      setUserQuestion("");
    }
  };

  const formatSats = (sats: number) => {
    return new Intl.NumberFormat("fr-FR").format(sats);
  };

  const formatBTC = (sats: number) => {
    return (sats / 100000000).toFixed(8);
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-gray-300">{t("description")}</p>
      </motion.div>

      <div className="mb-8">
        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button
              onClick={handleQuestionSubmit}
              disabled={isAnalyzing || !userQuestion.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("sendButton")}
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : result ? (
          <>
            {result.nodeInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("nodeInfo.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.nodeInfo.alias && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <span className="font-medium">
                          {t("nodeInfo.alias")}:
                        </span>{" "}
                        {result.nodeInfo.alias}
                      </div>
                    )}
                    {result.nodeInfo.capacity && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <span className="font-medium">
                          {t("nodeInfo.capacity")}:
                        </span>{" "}
                        {formatBTC(result.nodeInfo.capacity)} BTC
                      </div>
                    )}
                    {result.nodeInfo.channelCount && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <span className="font-medium">
                          {t("nodeInfo.channels")}:
                        </span>{" "}
                        {result.nodeInfo.channelCount}
                      </div>
                    )}
                    {result.nodeInfo.avgCapacity && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <span className="font-medium">
                          {t("nodeInfo.avgCapacity")}:
                        </span>{" "}
                        {formatBTC(result.nodeInfo.avgCapacity)} BTC
                      </div>
                    )}
                    {result.nodeInfo.betweenness && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <span className="font-medium">
                          {t("nodeInfo.betweenness")}:
                        </span>{" "}
                        {(result.nodeInfo.betweenness * 100).toFixed(2)}%
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {result.networkMetrics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("networkMetrics.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <span className="font-medium">
                        {t("networkMetrics.nodes")}:
                      </span>{" "}
                      {result.networkMetrics.totalNodes}
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <span className="font-medium">
                        {t("networkMetrics.channels")}:
                      </span>{" "}
                      {result.networkMetrics.totalChannels}
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <span className="font-medium">
                        {t("networkMetrics.capacity")}:
                      </span>{" "}
                      {formatBTC(result.networkMetrics.totalCapacity)} BTC
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {result.peersOfPeers && result.peersOfPeers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("peersOfPeers.title")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.peersOfPeers.map((peer, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">{peer.alias}</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            {t("peersOfPeers.capacity")}:{" "}
                            {formatBTC(peer.totalCapacity)} BTC
                          </p>
                          <p>
                            {t("peersOfPeers.channels")}: {peer.activeChannels}
                          </p>
                          <p>
                            {t("peersOfPeers.peers")}: {peer.totalPeers}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t("recommendations.title")}
                </h2>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-800 rounded-lg flex items-start"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        ) : null}
      </div>
    </div>
  );
}
