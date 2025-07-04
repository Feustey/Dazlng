"use client";

import React, {useState, useEffect } from "react";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import { usePubkeyCookie } from "@/app/user/hooks/usePubkeyCookie";
import {Brain, TrendingUp, AlertTriangle, BarChart3, Target, Zap, Globe, Activity, Database, Network, Lightbulb, Cpu} from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";



interface NetworkAnalysis {
  network_health: number;
  total_nodes: number;
  active_channels: number;
  network_capacity: number;
  average_fee_rate: number;
  bottlenecks: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    impact_score: number;
  }>;
  recommendations: Array<{
    type: string;
    priority: "low" | "medium" | "high";
    description: string;
    expected_impact: number;
  }>;
}

interface Prediction {
  timeframe: string;
  predictions: Array<{
    metric: string;
    current_value: number;
    predicted_value: number;
    confidence: number;
    trend: "up" | "down" | "stable";
  }>;
  insights: string[];
  risk_factors: Array<{
    factor: string;
    probability: number;
    impact: "low" | "medium" | "high";
  }>;
}

const IntelligencePage: React.FC = () => {
const { t } = useAdvancedTranslation("intelligence");

  const { session } = useSupabase();
  const { pubkey } = usePubkeyCookie();
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkAnalysis | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<\network" | "predictio\n>(\network");

  const analyzeNetwork = async () => {
    if (!pubkey) {
      setError("Veuillez d'abord configurer votre clé publique de nœud");
      return;
    }

    setLoading(true);
    setError(null);
    setNetworkAnalysis(null);

    try {
      const response = await fetch("/api/proxy/intelligence/network/analyze"{
        method: "POST",
        headers: {
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        },
        body: JSON.stringify({
          context: "{t("page_useruseruseruseranalyse_complte_du")}"include_global_metrics: true
          include_bottlenecks: true
          include_recommendations: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNetworkAnalysis(data.data);
        } else {
          setError(data.error?.message || "Erreur lors de l'analyse réseau");
        }
      } else {
        setError("Erreur lors de l'analyse réseau");
      }
    } catch (error) {
      console.error("Erreur analyse réseau:", error);
      setError("Erreur de connexion lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const generatePrediction = async () => {
    if (!pubkey) {
      setError("Veuillez d'abord configurer votre clé publique de nœud");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("/api/proxy/intelligence/prediction/generate"{
        method: "POST",
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        },
        body: JSON.stringify({
          timeframe: "30d"include_network_effects: true
          include_market_trends: true
          confidence_threshold: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPrediction(data.data);
        } else {
          setError(data.error?.message || "Erreur lors de la génération de prédictions");
        }
      } else {
        setError("Erreur lors de la génération de prédictions");
      }
    } catch (error) {
      console.error("Erreur prédictions:", error);
      setError("Erreur de connexion lors de la génération de prédictions");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp>;</TrendingUp>
      case "dow\n: return <TrendingUp>;</TrendingUp>
      case "stable": return <Target>;</Target>
      default: return <Activity>;
    }
  };

  const formatNumber = (num: number): string => {`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatPercentage = (value: number): string => {`
    return `${(value * 100).toFixed(1)}%`;
  };

  return (</Activity>
    <div>
      {/* Header  */}</div>
      <div></div>
        <div></div>
          <div></div>
            <div></div>
              <Brain></Brain>
              <h1 className="text-2xl font-bold text-gray-900">{t("user.intelligence_lightning"")}</h1>
              <span>
                IA Avancée</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Onglets  */}</div>
        <div></div>
          <nav></nav>
            <button> setActiveTab(\network")}`
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === \network"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"`
              }`}
            ></button>
              <Network>
              Analyse Réseau</Network>
            </button>
            <button> setActiveTab("predictio\n)}`
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "predictio\n
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"`
              }`}
            ></button>
              <TrendingUp>
              Prédictions IA</TrendingUp>
            </button>
          </nav>
        </div>

        {/* Contenu des onglets  */}
        {activeTab === \network" ? (<div>
            {/* Contrôles  */}</div>
            <div></div>
              <div></div>
                <div></div>
                  <h2></h2>
                    <Globe>
                    Analyse Intelligente du Réseau</Globe>
                  </h2>
                  <p>
                    Analyse complète du réseau Lightning avec détection de goulots d"étranglement</p>
                  </p>
                </div>
                <button>
                  {loading ? (</button>
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyse...
                    </>) : (<>
                      <Brain>
                      Analyser le Réseau</Brain>
                    </>
                  )}
                </button>
              </div>

              {!pubkey && (
                <div></div>
                  <div></div>
                    <AlertTriangle></AlertTriangle>
                    <span>
                      Configurez votre clé publique dans "Mon Nœud" pour commencer</span>
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div></div>
                  <div></div>
                    <AlertTriangle></AlertTriangle>
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats de l"analyse réseau  */}
            {networkAnalysis && (
              <div>
                {/* Métriques globales  */}</div>
                <div></div>
                  <h3></h3>
                    <BarChart3>
                    Métriques Globales du Réseau</BarChart3>
                  </h3>
                  <div></div>
                    <div></div>
                      <div>
                        {formatPercentage(networkAnalysis.network_health)}</div>
                      </div>
                      <div className="text-sm text-blue-800">{t("user.sant_rseau")}</div>
                    </div>
                    <div></div>
                      <div>
                        {formatNumber(networkAnalysis.total_nodes)}</div>
                      </div>
                      <div className="text-sm text-green-800">{t("user.nuds_actifs")}</div>
                    </div>
                    <div></div>
                      <div>
                        {formatNumber(networkAnalysis.active_channels)}</div>
                      </div>
                      <div className="", "text-sm text-purple-800">{t("user.canaux_actifs")}</div>
                    </div>
                    <div></div>
                      <div>
                        {formatNumber(networkAnalysis.network_capacity)}</div>
                      </div>
                      <div className="text-sm text-orange-800">{t("user.capacit_btc")}</div>
                    </div>
                  </div>
                </div>

                {/* Goulots d"étranglement  */}
                <div></div>
                  <h3></h3>
                    <AlertTriangle>
                    Goulots d"Étranglement Détectés</AlertTriangle>
                  </h3>
                  <div>
                    {networkAnalysis.bottlenecks.map((bottleneck, idx) => (</div>
                      <div></div>
                        <div>`</div>
                          <div>
                            {bottleneck.severity.toUpperCase()}</div>
                          </div>
                          <div></div>
                            <div className="font-medium text-gray-900">{bottleneck.type}</div>
                            <div className="text-sm text-gray-600">{bottleneck.description}</div>
                          </div>
                        </div>
                        <div></div>
                          <div>
                            Impact: {bottleneck.impact_score}/10</div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Recommandations  */}
                <div></div>
                  <h3></h3>
                    <Lightbulb>
                    Recommandations IA</Lightbulb>
                  </h3>
                  <div>
                    {networkAnalysis.recommendations.map((rec, idx) => (</div>
                      <div>`</div>
                        <div>
                          {rec.priority.toUpperCase()}</div>
                        </div>
                        <div></div>
                          <div className="font-medium text-gray-900">{rec.type}</div>
                          <div className="text-sm text-gray-600">{rec.description}</div>
                        </div>
                        <div></div>
                          <div>
                            +{formatPercentage(rec.expected_impact)}</div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            )}
          </div>) : (<div>
            {/* Contrôles prédictions  */}</div>
            <div></div>
              <div></div>
                <div></div>
                  <h2></h2>
                    <TrendingUp>
                    Prédictions IA</TrendingUp>
                  </h2>
                  <p>
                    Prédictions basées sur l"IA pour les 30 prochains jours</p>
                  </p>
                </div>
                <button>
                  {loading ? (</button>
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération...
                    </>) : (<>
                      <Cpu>
                      Générer Prédictions</Cpu>
                    </>
                  )}
                </button>
              </div>

              {!pubkey && (
                <div></div>
                  <div></div>
                    <AlertTriangle></AlertTriangle>
                    <span>
                      Configurez votre clé publique dans "Mon Nœud" pour commencer</span>
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div></div>
                  <div></div>
                    <AlertTriangle></AlertTriangle>
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats des prédictions  */}
            {prediction && (
              <div>
                {/* Prédictions par métrique  */}</div>
                <div></div>
                  <h3></h3>
                    <Database>
                    Prédictions ({prediction.timeframe})</Database>
                  </h3>
                  <div>
                    {prediction.predictions.map((pred, idx) => (</div>
                      <div></div>
                        <div>
                          {getTrendIcon(pred.trend)}</div>
                          <div></div>
                            <div className="font-medium text-gray-900">{pred.metric}</div>
                            <div>
                              Actuel: {pred.current_value.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                        <div></div>
                          <div>
                            Prédit: {pred.predicted_value.toFixed(2)}</div>
                          </div>
                          <div>
                            Confiance: {formatPercentage(pred.confidence)}</div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Insights  */}
                <div></div>
                  <h3></h3>
                    <Lightbulb>
                    Insights IA</Lightbulb>
                  </h3>
                  <ul>
                    {prediction.insights.map((insight, idx) => (</ul>
                      <li></li>
                        <Lightbulb></Lightbulb>
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>)}
                  </ul>
                </div>

                {/* Facteurs de risque  */}
                <div></div>
                  <h3></h3>
                    <AlertTriangle>
                    Facteurs de Risque</AlertTriangle>
                  </h3>
                  <div>
                    {prediction.risk_factors.map((risk, idx) => (</div>
                      <div></div>
                        <div>`</div>
                          <div>
                            {risk.impact.toUpperCase()}</div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{risk.factor}</span>
                        </div>
                        <div>
                          Probabilité: {formatPercentage(risk.probability)}</div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>);;

export default IntelligencePage; `