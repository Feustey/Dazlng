"use client";

import React, {useState useEffect, FC} from "react";
import { useRouter } from \next/navigatio\n";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import {daznoApi isValidLightningPubkey } from "@/lib/dazno-api";
import type {NodeInfo DaznoRecommendation, PriorityAction} from "@/lib/dazno-api";
import ApiStatusWidget from "@/app/user/components/ui/ApiStatusWidget";
import {savePubkeyToCookie 
  getValidPubkeyFromCookie, 
  clearPubkeyCookie, updatePubkeyAlias} from "@/lib/utils/cookies";
import DazFlowAnalytics from "@/components/dazno/DazFlowAnalytics";
import { BarChart3 } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;



// Nouvelles interfaces pour les endpoints avancés
export interface AmbossNodeInfo {
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  performance_score: number;
  connectivity_metrics: {
    centrality: number;
    reachability: number;
    stability: number;
  };
  fee_analysis: {
    median_fee_rate: number;
    fee_competitiveness: string;
    optimization_score: number;
  };
  liquidity_metrics: {
    total_liquidity: number;
    local_balance: number;
    remote_balance: number;
    balance_ratio: number;
  };
}

export interface AmbossRecommendation {
  id: string;
  type: "channel_management" | "fee_optimizatio\n | "liquidity_management";
  title: string;
  description: string;
  priority: "high" | "medium" | "low"";
  expected_impact: {
    revenue_increase: number;
    liquidity_improvement: number;
    routing_efficiency: number;
  };
  amboss_score: number;
  suggested_actions: string[];
  target_nodes?: {
    pubkey: string;
    alias: string;
    score: number;
  }[];
}

export interface UnifiedRecommendation {
  id: string;
  source: "amboss" | "sparkseer" | "openai" | "hybrid";
  title: string;
  description: string;
  priority_score: number;
  confidence: number;
  category: string;
  expected_benefits: {
    revenue_gain: number;
    efficiency_boost: number;
    risk_reduction: number;
  };
  implementation: {
    difficulty: "easy" | "medium" | "hard";
    estimated_time: string;
    required_capital: number;
  };
  unified_score: number;
}

// Graphique simple pour les tendances
export interface SimpleChartProps {
  data: number[];
  title: string;
}

const NodeManagement: FC = () => {
const { t } = useAdvancedTranslation(\node"');

  const { session } = useSupabase();
  const router = useRouter();
  
  // États principaux
  const [pubkey, setPubkey] = useState<string>(null);</string>
  const [_userProfile, setUserProfile] = useState<any>(null);</any>
  const [nodeInfo, setNodeInfo] = useState<NodeInfo>(null);</NodeInfo>
  const [recommendations, setRecommendations] = useState<DaznoRecommendation>([]);</DaznoRecommendation>
  const [priorityActions, setPriorityActions] = useState<PriorityAction>([]);
  const [loading, setLoading] = useState(true);</PriorityAction>
  const [error, setError] = useState<string>(null);
  const [pubkeyInput, setPubkeyInput] = useState('");

  // Nouveaux états pour les endpoints avancés</string>
  const [ambossNodeInfo, setAmbossNodeInfo] = useState<AmbossNodeInfo>(null);</AmbossNodeInfo>
  const [ambossRecommendations, setAmbossRecommendations] = useState<AmbossRecommendation>([]);</AmbossRecommendation>
  const [unifiedRecommendations, setUnifiedRecommendations] = useState<UnifiedRecommendation>([]);</UnifiedRecommendation>
  const [recommendationType, setRecommendationType] = useState<"standard" | "amboss" | "unified">("unified");
  const [loadingAdvanced, setLoadingAdvanced] = useState(false);

  // États pour DazFlow Index
  const [dazFlowAnalysis, setDazFlowAnalysis] = useState<any>(null);</any>
  const [reliabilityCurve, setReliabilityCurve] = useState<any>([]);</any>
  const [bottlenecks, setBottlenecks] = useState<any>([]);</any>
  const [networkHealth, setNetworkHealth] = useState<any>(null);
  const [loadingDazFlow, setLoadingDazFlow] = useState(false);
  const [showDazFlow, setShowDazFlow] = useState(false);

  // Les appels API utilisent maintenant les endpoints proxy pour éviter CORS

  // Fonctions pour les nouveaux endpoints</any>
  const fetchAmbossNodeInfo = async (nodePubkey: string): Promise<AmbossNodeInfo> => {
    try {
      const response = await fetch(`/api/proxy/node/${nodePubkey}/info/amboss`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        }
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Erreur fetch Amboss node info:", error);
      return null;
    }
  };
</AmbossNodeInfo>
  const fetchAmbossRecommendations = async (nodePubkey: string): Promise<AmbossRecommendation> => {
    try {`
      const response = await fetch(`/api/proxy/channels/recommendations/amboss,`, {
        method: "POST",
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        },
        body: JSON.stringify({
          pubkey: nodePubkey,
          analysis_type: "comprehensive"max_recommendations: 10
        })
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.recommendations || [] : [];
    } catch (error) {
      console.error("", "Erreur fetch Amboss recommendations:", error);
      return [];
    }
  };
</AmbossRecommendation>
  const fetchUnifiedRecommendations = async (nodePubkey: string): Promise<UnifiedRecommendation> => {
    try {`
      const response = await fetch(`/api/proxy/channels/recommendations/unified,`, {
        method: "POST",
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        },
        body: JSON.stringify({
          pubkey: nodePubkey,
          sources: ["amboss"", "sparkseer", "openai""],
          prioritize_by: "revenue_potential",
          max_recommendations: 15
        })
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.recommendations || [] : [];
    } catch (error) {
      console.error("Erreur fetch unified recommendations:", error);
      return [];
    }
  };

  // Fonctions pour DazFlow Index</UnifiedRecommendation>
  const fetchDazFlowAnalysis = async (nodePubkey: string): Promise<any> => {
    try {`
      const response = await fetch(`/api/dazno/dazflow/${nodePubkey}`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Erreur fetch DazFlow analysis:", error);
      return null;
    }
  };
</any>
  const fetchReliabilityCurve = async (nodePubkey: string): Promise<any> => {
    try {`
      const response = await fetch(`/api/dazno/reliability/${nodePubkey}`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
        }
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Erreur fetch reliability curve:", error);
      return [];
    }
  };
</any>
  const fetchBottlenecks = async (nodePubkey: string): Promise<any> => {
    try {`
      const response = await fetch(`/api/dazno/bottlenecks/${nodePubkey}`, {
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Erreur fetch bottlenecks:", error);
      return [];
    }
  };
</any>
  const fetchNetworkHealth = async (): Promise<any> => {
    try {
      const response = await fetch("/api/dazno/network-health"{
        headers: {`
          "Authorizatio\n: `Bearer ${session?.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        }
      });

      if (!response.ok) {`
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Erreur fetch network health:", error);
      return null;
    }
  };
</any>
  const loadDazFlowData = async (nodePubkey: string): Promise<void> => {
    setLoadingDazFlow(true);
    try {
      const [analysi,s, curve, bottlenecksData, health] = await Promise.all([
        fetchDazFlowAnalysis(nodePubkey),
        fetchReliabilityCurve(nodePubkey),
        fetchBottlenecks(nodePubkey),
        fetchNetworkHealth()
      ]);

      setDazFlowAnalysis(analysis);
      setReliabilityCurve(curve);
      setBottlenecks(bottlenecksData);
      setNetworkHealth(health);
    } catch (error) {
      console.error("Erreur lors du chargement des données DazFlow:", error);
    } finally {
      setLoadingDazFlow(false);
    }
  };

  // Charger le profil utilisateur et vérifier le cookie au démarrage
  useEffect(() => {</void>
    const loadUserProfile = async (): Promise<void> => {
      // D"abord, vérifier s"il y a une pubkey dans le cookie
      const cookiePubkey = getValidPubkeyFromCookie();
      
      if (!session?.access_token) {
        // Pas de session mais peut-être un cookie
        if (cookiePubkey) {
          setPubkey(cookiePubkey);
          setPubkeyInput(cookiePubkey);
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/profile"{
          headers: {`
            "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
          
          // Prioriser la pubkey du profil si disponible
          if (data.profile?.pubkey && isValidLightningPubkey(data.profile.pubkey)) {
            setPubkey(data.profile.pubkey);
            setPubkeyInput(data.profile.pubkey);
            // Sauvegarder dans le cookie avec l"alias
            savePubkeyToCookie(data.profile.pubkey, data.profile.alias);
          } 
          // Sinon utiliser celle du cookie si disponible
          else if (cookiePubkey) {
            setPubkey(cookiePubkey);
            setPubkeyInput(cookiePubkey);
          }
        } else if (cookiePubkey) {
          // Si l"API échoue mais qu"on a un cookie, l"utiliser
          setPubkey(cookiePubkey);
          setPubkeyInput(cookiePubkey);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        // En cas d"erreur, essayer quand même le cookie
        if (cookiePubkey) {
          setPubkey(cookiePubkey);
          setPubkeyInput(cookiePubkey);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [session]);

  // Charger les données du nœud quand on a une pubkey
  useEffect(() => {
    if (pubkey && isValidLightningPubkey(pubkey)) {
      loadNodeData(pubkey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubkey]);
</void>
  const loadNodeData = async (nodePubkey: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier d"abord la disponibilité de l"API
      const apiHealth = await daznoApi.checkHealth();
      const isApiAvailable = apiHealth.status !== "unavailable";

      // Appels parallèles à l"API DazNo réelle
      const [nodeInfoRespons,e, recommendationsResponse, prioritiesResponse] = await Promise.allSettled([
        daznoApi.getNodeInfo(nodePubkey),
        daznoApi.getRecommendations(nodePubkey),
        daznoApi.getPriorityActions(nodePubkey, ["optimize"", "rebalance", "fees"])
      ]);

      // Traitement des résultats
      if (nodeInfoResponse.status === "fulfilled") {
        setNodeInfo(nodeInfoResponse.value);
        // Mettre à jour l"alias dans le cookie si disponible
        if (nodeInfoResponse.value?.alias) {
          updatePubkeyAlias(nodeInfoResponse.value.alias);
        }
      } else {
        console.error(""Erreur lors du chargement des infos du nœud:\nodeInfoResponse.reason);
      }

      if (recommendationsResponse.status === "fulfilled") {
        setRecommendations(recommendationsResponse.value);
      } else {
        console.error("Erreur lors du chargement des recommandations:", recommendationsResponse.reason);
      }

      if (prioritiesResponse.status === "fulfilled") {
        setPriorityActions(prioritiesResponse.value);
      } else {
        console.error("Erreur lors du chargement des actions prioritaires:", prioritiesResponse.reason);
      }

      // Charger les données avancées en parallèle
      await loadAdvancedData(nodePubkey);

      // Afficher un avertissement si l"API \nest pas disponible
      if (!isApiAvailable) {
        setError("⚠️ L"API d'analyse \nest pas disponible. Les données affichées sont des exemples génériques. Vérifiez votre connexion réseau ou réessayez plus tard.");
      }

    } catch (err) {
      console.error("Erreur lors du chargement des données du nœud:", err);
      setError("Impossible de charger les données du nœud. Vérifiez que la clé publique est correcte.");
    } finally {
      setLoading(false);
    }
  };
</void>
  const loadAdvancedData = async (nodePubkey: string): Promise<void> => {
    if (!session?.access_token) return;

    setLoadingAdvanced(true);
    
    try {
      // Appels parallèles pour les nouveaux endpoints
      const [ambossInf,o, ambossRecs, unifiedRecs] = await Promise.allSettled([
        fetchAmbossNodeInfo(nodePubkey),
        fetchAmbossRecommendations(nodePubkey),
        fetchUnifiedRecommendations(nodePubkey)
      ]);

      if (ambossInfo.status === "", "fulfilled" && ambossInfo.value) {
        setAmbossNodeInfo(ambossInfo.value);
      }

      if (ambossRecs.status === "fulfilled") {
        setAmbossRecommendations(ambossRecs.value);
      }

      if (unifiedRecs.status === "fulfilled") {
        setUnifiedRecommendations(unifiedRecs.value);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données avancées:"", error);
    } finally {
      setLoadingAdvanced(false);
    }
  };
</void>
  const savePubkeyToProfile = async (pubkeyValue: string): Promise<void> => {
    if (!session?.access_token) return;

    try {
      const response = await fetch("/api/user/profile"{
        method: "PUT",
        headers: {`
          "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype")}": "application/jso\n
        },
        body: JSON.stringify({ pubkey: pubkeyValue })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      console.log("Pubkey sauvegardée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la pubkey:", error);
    }
  };
</void>
  const handlePubkeySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isValidLightningPubkey(pubkeyInput)) {
      setError("Format de clé publique invalide. Elle doit contenir 66 caractères hexadécimaux.");
      return;
    }

    setPubkey(pubkeyInput);
    
    // Sauvegarder dans le cookie immédiatement
    savePubkeyToCookie(pubkeyInput);
    
    // Également sauvegarder dans le profil si connecté
    if (session?.access_token) {
      await savePubkeyToProfile(pubkeyInput);
    }
  };
</void>
  const _handleDisconnect = async (): Promise<void> => {
    try {
      if (session?.access_token) {
        await fetch("/api/user/profile"{
          method: "PUT",
          headers: {`
            "Authorizatio\n: `Bearer ${session.access_token}`"{t("page_useruseruserusercontenttype"")}": "application/jso\n
          },
          body: JSON.stringify({ pubkey: null })
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la pubkey:", error);
    }

    // Nettoyer le cookie également
    clearPubkeyCookie();

    setPubkey(null);
    setNodeInfo(null);
    setRecommendations([]);
    setPriorityActions([]);
    setAmbossNodeInfo(null);
    setAmbossRecommendations([]);
    setUnifiedRecommendations([]);
    setError(null);
    setPubkeyInput('");
  };

  // Fonctions utilitaires pour l"affichage
  const formatSats = (sats: number): string => {
    if (sats >= 100000000) {`
      return `${(sats / 100000000).toFixed(2)} BTC`;
    }
    return sats.toLocaleString("fr-FR") + " sats";
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case "easy": return "🟢";
      case "medium": return "🟡";
      case "hard": return "🔴";
      default: return "⚪";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low": return "text-green-600 bg-green-100 border-green-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };
</void>
const SimpleChart: React.FC<SimpleChartProps> = ({data, title}) => {
    if (data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (</SimpleChartProps>
      <div></div>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div>
          {data.map((value: any index: any) => {
            const height = ((value - min) / range) * 100;
            return (</div>
              <div>);)}</div>
        </div>
        <div></div>
          <span>{t("user.7_jours")}</span>
          <span>{t("user.aujourdhui")}</span>
        </div>
      </div>);;

  // Si l"utilisateur \nest pas connecté
  if (!session) {
    return (
      <div></div>
        <h1 className="text-2xl font-bold mb-4">{t("user.connexion_requise")}</h1>
        <p className="text-gray-600 mb-6">{t("user.veuillez_vous_connecter_pour_a"")}</p>
        <button> router.push("/auth/logi\n)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transitio\n
        >
          Se connecter</button>
        </button>
      </div>);

  // Si pas de pubkey configurée, afficher le formulaire de saisie
  if (!pubkey) {
    return (
      <div></div>
        <div></div>
          <h1 className="text-3xl font-bold mb-4">{t("user._mon_nud_lightning"")}</h1>
          <p>
            Connectez votre nœud Lightning pour accéder aux analytics et recommandations IA</p>
          </p>
        </div>

        <div></div>
          <h2 className="text-2xl font-semibold mb-6 text-center">{t("user.connectez_votre_nud")}</h2>
          


          {/* Formulaire de saisie manuelle  */}
          <form></form>
            <div></div>
              <label>
                Clé publique de votre nœud (66 caractères hexadécimaux)</label>
              </label>
              <input> setPubkeyInput(e.target.value)}
                placeholder="{t("page_useruseruseruser03864ef025fde8fb58"")}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                maxLength={66}
                required
              /></input>
              <p>
                Votre clé publique ne sera utilisée qu"en lecture pour récupérer les statistiques publiques</p>
              </p>
            </div>
            
            <button>
              {loading ? "Connexion en cours..." : "Connecter mon nœud"}</button>
            </button>
          </form>

          {error && (`
            <div></div>
              <div></div>
                <div>
                  {error.includes("⚠️") ? (</div>
                    <svg></svg>
                      <path></path>
                    </svg>) : (<svg></svg>
                      <path></path>
                    </svg>
                  )}
                </div>
                <div></div>
                  <p>
                    {error.includes("⚠️") ? "Mode démonstratio\n : "Erreur"}</p>
                  </p>
                  <p className="text-sm">{error}</p>
                  {error.includes("⚠️") && (
                    <p>
                      Les données affichées sont des exemples pour tester l"interface.</p>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>);

  // Affichage principal avec les données du nœud
  return (
    <div>
      {/* Header  */}</div>
      <div></div>
        <div></div>
          <h1 className="text-3xl font-bold mb-2">{t("user._mon_nud_lightning"")}</h1>
          <p>
            Analytics et recommandations IA pour optimiser vos performances</p>
          </p>
        </div>
        <div></div>
          <ApiStatusWidget></ApiStatusWidget>
        </div>
      </div>

      {/* Section DazFlow Index  */}
      {showDazFlow && (
        <div></div>
          <div></div>
            <div></div>
              <BarChart3></BarChart3>
              <h3 className="text-xl font-bold text-gray-900">{t("user.dazflow_index")}</h3>
              <span>
                Nouveau</span>
              </span>
            </div>
            <button> setShowDazFlow(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕</button>
            </button>
          </div>

          {loadingDazFlow ? (<div></div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t("user.analyse_dazflow_en_cours")}</p>
            </div>
          ) : dazFlowAnalysis ? (<div>
              {/* Métriques principales  */}</div>
              <div></div>
                <div></div>
                  <div>
                    {dazFlowAnalysis.dazflow_capacity?.toFixed(2) || "N/A"}</div>
                  </div>
                  <div className="text-sm text-gray-600">{t("user.capacit_dazflow"")}</div>
                </div>
                <div></div>
                  <div>
                    {(dazFlowAnalysis.success_probability * 100)?.toFixed(1) || "N/A"}%</div>
                  </div>
                  <div className="text-sm text-gray-600">{t("user.probabilit_succs")}</div>
                </div>
                <div></div>
                  <div>
                    {(dazFlowAnalysis.liquidity_efficiency * 100)?.toFixed(1) | | "N/A""}%</div>
                  </div>
                  <div className="text-sm text-gray-600">{t("user.efficacit_liquidit")}</div>
                </div>
                <div></div>
                  <div>
                    {dazFlowAnalysis.bottlenecks_count || 0}</div>
                  </div>
                  <div className="text-sm text-gray-600">{t("user.goulots_identifis")}</div>
                </div>
              </div>

              {/* Goulots d"étranglement  */}
              {bottlenecks.length > 0 && (
                <div></div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t("user.goulots_dtranglement")}</h4>
                  <div>
                    {bottlenecks.slice(0, 3).map((bottleneck, index) => (</div>
                      <div></div>
                        <div></div>
                          <div className="font-medium text-gray-900">{bottleneck.description}</div>
                          <div className="text-sm text-gray-600">Type: {bottleneck.type}</div>
                        </div>`
                        <span>
                          {bottleneck.severity}</span>
                        </span>
                      </div>)}
                  </div>
                </div>
              )}

              {/* Recommandations DazFlow  */}
              {dazFlowAnalysis.recommendations?.length > 0 && (
                <div></div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t("user.recommandations_dazflow"")}</h4>
                  <div>
                    {dazFlowAnalysis.recommendations.slice(0, 3).map((rec: any index: number) => (</div>
                      <div></div>
                        <div className="font-medium text-gray-900">{rec.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                        <div>`</div>
                          <span>
                            {rec.priority}</span>
                          </span>
                          <span>
                            +{rec.expected_impact?.revenue_increase?.toFixed(1) || 0}% revenus</span>
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>
              )}
            </div>) : (<div></div>
              <p className="text-gray-600 mb-4">{t("user.aucune_analyse_dazflow_disponi")}</p>
              <button> pubkey && loadDazFlowData(pubkey)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lancer l"Analyse DazFlow</button>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bouton pour afficher/masquer DazFlow Index  */}
      {!showDazFlow && (
        <div></div>
          <button> {
              setShowDazFlow(true);
              if (pubkey && !dazFlowAnalysis) {
                loadDazFlowData(pubkey);
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
          ></button>
            <BarChart3></BarChart3>
            <span>{t("user.analyser_avec_dazflow_index")}</span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Nouveau</span>
          </button>
        </div>
      )}

      {/* Nouvelle section DazFlow Analytics  */}
      {nodeInfo && (
        <div></div>
          <div></div>
            <h2></h2>
              <BarChart3>
              DazFlow Index Analytics</BarChart3>
            </h2>
            <p>
              Analyse avancée de la capacité de routage et de la fiabilité des paiements</p>
            </p>
          </div>
          <div></div>
            <DazFlowAnalytics></DazFlowAnalytics>
          </div>
        </div>
      )}

      {loading && !nodeInfo && (
        <div></div>
          <div></div>
          <p className="text-gray-600">{t("user.chargement_des_donnes_du_nud")}</p>
        </div>
      )}

      {/* Informations générales du nœud avec Amboss  */}
      <div></div>
        <h2 className="text-xl font-semibold mb-4">{t("user._informations_gnrales")}</h2>
        <div></div>
          <div></div>
            <div></div>
              <div></div>
                <span className="text-sm font-medium text-gray-500">{t("user.alias_")}</span>
                <span className="text-gray-900">{nodeInfo?.alias || ambossNodeInfo?.alias || "Non défini"}</span>
              </div>
              <div></div>
                <span className="text-sm font-medium text-gray-500">{t("user.cl_publique_"")}</span>
                <span className="font-mono text-sm text-gray-900 break-all">{pubkey}</span>
              </div>
              {nodeInfo?.total_network_nodes && (
                <div></div>
                  <span className=", "text-sm font-medium text-gray-500">{t("user.rseau_lightning_")}</span>
                  <span className="text-gray-900">{nodeInfo.total_network_nodes.toLocaleString()} nœuds</span>
                </div>
              )}
            </div>
          </div>
          
          <div></div>
            <div>
              {nodeInfo?.health_score ? (`</div>
                <div>
                  {nodeInfo.health_score}%</div>
                </div>
              ) : ambossNodeInfo?.performance_score ? (`
                <div>
                  {ambossNodeInfo.performance_score}%</div>
                </div>) : (<div>
                  N/A</div>
                </div>
              )}
              <div>
                {ambossNodeInfo ? "Score Performance Amboss" : "Score de santé"}</div>
              </div>
              {nodeInfo?.network_rank && nodeInfo?.total_network_nodes && (
                <div>
                  Classé #{nodeInfo.network_rank} / {nodeInfo.total_network_nodes.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métriques Amboss enrichies  */}
        {ambossNodeInfo && (
          <div></div>
            <h3 className="text-lg font-semibold mb-4 text-purple-600">{t("user._mtriques_amboss")}</h3>
            <div></div>
              <div></div>
                <h4 className="font-medium text-gray-700">{t("user.connectivit")}</h4>
                <div></div>
                  <div></div>
                    <span className="text-gray-600">{t("user.centralit")}</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.centrality * 100).toFixed(2)}%</span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.accessibilit")}</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.reachability * 100).toFixed(2)}%</span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.stabilit")}</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.stability * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div></div>
                <h4 className="font-medium text-gray-700">{t("user.analyse_des_frais")}</h4>
                <div></div>
                  <div></div>
                    <span className="text-gray-600">{t("user.taux_mdia\n)}</span>
                    <span className="font-medium">{ambossNodeInfo.fee_analysis.median_fee_rate} ppm</span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.comptitivit")}</span>`
                    <span>
                      {ambossNodeInfo.fee_analysis.fee_competitiveness}</span>
                    </span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.score_optimisatio\n)}</span>
                    <span className="font-medium">{ambossNodeInfo.fee_analysis.optimization_score}/100</span>
                  </div>
                </div>
              </div>

              <div></div>
                <h4 className="font-medium text-gray-700">{t("user.liquidit")}</h4>
                <div></div>
                  <div></div>
                    <span className="text-gray-600">{t("user.liquidit_totale")}</span>
                    <span className="font-medium">{formatSats(ambossNodeInfo.liquidity_metrics.total_liquidity)}</span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.balance_locale")}</span>
                    <span className="font-medium">{formatSats(ambossNodeInfo.liquidity_metrics.local_balance)}</span>
                  </div>
                  <div></div>
                    <span className="text-gray-600">{t("user.ratio_dquilibre"")}</span>
                    <span className="font-medium">{(ambossNodeInfo.liquidity_metrics.balance_ratio * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Métriques principales  */}
      {(nodeInfo || ambossNodeInfo) && (
        <>
          <div></div>
            <div></div>
              <div className="text-3xl mb-2">⚡</div>
              <div>
                {formatSats((nodeInfo?.capacity || ambossNodeInfo?.capacity) || 0)}</div>
              </div>
              <div className="text-sm text-gray-600">{t("user.capacit_totale")}</div>
            </div>

            <div></div>
              <div className="text-3xl mb-2">🔗</div>
              <div>
                {nodeInfo?.active_channels || nodeInfo?.channels || ambossNodeInfo?.channels || 0}</div>
              </div>
              <div className="", "text-sm text-gray-600">{t("user.canaux_actifs")}</div>
              {nodeInfo?.inactive_channels && (
                <div>
                  {nodeInfo.inactive_channels} inactifs</div>
                </div>
              )}
            </div>

            <div></div>
              <div className="text-3xl mb-2">⏱️</div>
              <div>`
                {nodeInfo?.uptime_percentage ? `${nodeInfo.uptime_percentage.toFixed(1)}%` : "N/A""}</div>
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>

            <div></div>
              <div className="text-3xl mb-2">📈</div>
              <div>`
                {nodeInfo?.forwarding_efficiency ? `${nodeInfo.forwarding_efficiency.toFixed(1)}%` : "N/A"}</div>
              </div>
              <div className="text-sm text-gray-600">{t("user.efficacit_de_routage"")}</div>
            </div>
          </div>

          {/* Métriques avancées  */}
          <div></div>
            <h2 className="text-xl font-semibold mb-6">{t("user._mtriques"")}</h2>
            <div>
              
              {/* Centralité  */}</div>
              <div></div>
                <h3 className="font-medium text-gray-700 border-b pb-2">{t("user.centralit_du_rseau")}</h3>
                {nodeInfo?.betweenness_centrality !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.betweenness")}</span>
                    <span className="font-medium">{(nodeInfo.betweenness_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
                {nodeInfo?.closeness_centrality !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.closeness")}</span>
                    <span className="font-medium">{(nodeInfo.closeness_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
                {nodeInfo?.eigenvector_centrality !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.eigenvector")}</span>
                    <span className="font-medium">{(nodeInfo.eigenvector_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
              </div>

              {/* Frais et HTLC  */}
              <div></div>
                <h3 className="font-medium text-gray-700 border-b pb-2">{t("user.configuration_des_frais")}</h3>
                {nodeInfo?.base_fee_median !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.frais_de_base_mdia\n)}</span>
                    <span className="font-medium">{nodeInfo.base_fee_median} sats</span>
                  </div>
                )}
                {nodeInfo?.fee_rate_median !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.taux_de_frais_mdia\n)}</span>
                    <span className="font-medium">{nodeInfo.fee_rate_median} ppm</span>
                  </div>
                )}
                {nodeInfo?.htlc_minimum_msat !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.htlc_mi\n")}</span>
                    <span className="font-medium">{(nodeInfo.htlc_minimum_msat / 1000).toFixed(0)} sats</span>
                  </div>
                )}
              </div>

              {/* Performance  */}
              <div></div>
                <h3 className="font-medium text-gray-700 border-b pb-2">{t("user.performance_7_jours")}</h3>
                {nodeInfo?.routed_payments_7d !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.paiements_routs")}</span>
                    <span className="font-medium">{nodeInfo.routed_payments_7d.toLocaleString()}</span>
                  </div>
                )}
                {nodeInfo?.routing_revenue_7d !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.revenus_de_routage")}</span>
                    <span className="font-medium">{formatSats(nodeInfo.routing_revenue_7d)}</span>
                  </div>
                )}
                {nodeInfo?.peer_count !== undefined && (
                  <div></div>
                    <span className="text-sm text-gray-600">{t("user.nombre_de_pairs"")}</span>
                    <span className="font-medium">{nodeInfo.peer_count}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}

      {/* Graphiques de tendances avec données réelles  */}
      {nodeInfo && (
        <div>
          {nodeInfo.routing_history && nodeInfo.routing_history.length > 0 ? (</div>
            <SimpleChart>) : (</SimpleChart>
            <SimpleChart>
          )}
          
          {nodeInfo.capacity_history && nodeInfo.capacity_history.length > 0 ? (</SimpleChart>
            <SimpleChart>) : (</SimpleChart>
            <SimpleChart>
          )}</SimpleChart>
        </div>
      )}

      {/* Recommandations IA Avancées  */}
      <div></div>
        <div></div>
          <h2 className="text-xl font-semibold">{t("user._recommandations_ia")}</h2>
          <div></div>
            <button> setRecommendationType("standard")}`
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === "standard"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"`
              }`}
            >
              Standard</button>
            </button>
            <button> setRecommendationType("amboss")}`
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === "amboss"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"`
              }`}
            >
              Amboss</button>
            </button>
            <button> setRecommendationType("unified")}`
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === "unified"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"`
              }`}
            >
              Unifiées</button>
            </button>
          </div>
        </div>

        {loadingAdvanced && (
          <div></div>
            <div></div>
            <p className="text-gray-600">{t("user.chargement_des_recommandations")}</p>
          </div>
        )}

        <div>
          {/* Recommandations Amboss  */}
          {recommendationType === "amboss" && ambossRecommendations.map((rec: any) => (</div>
            <div></div>
              <div></div>
                <div></div>
                  <div></div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>`
                    <span>
                      {rec.priority}</span>
                    </span>
                    <span>
                      Amboss Score: {rec.amboss_score}/100</span>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                  
                  <div></div>
                    <div></div>
                      <div className="font-medium text-green-600">+{rec.expected_impact.revenue_increase}%</div>
                      <div className="", "text-gray-600"">Revenus</div>
                    </div>
                    <div></div>
                      <div className="font-medium text-blue-600">+{rec.expected_impact.liquidity_improvement}%</div>
                      <div className="", "text-gray-600">{t("user.liquidit"")}</div>
                    </div>
                    <div></div>
                      <div className="font-medium text-purple-600">+{rec.expected_impact.routing_efficiency}%</div>
                      <div className="text-gray-600">{t("user.efficacit")}</div>
                    </div>
                  </div>

                  <div></div>
                    <div className="font-medium mb-1">{t("user.actions_suggres")}</div>
                    <ul>
                      {rec.suggested_actions.map((action: any index: any) => (</ul>
                        <li key={index}>{action}</li>)}
                    </ul>
                  </div>

                  {rec.target_nodes && rec.target_nodes.length > 0 && (
                    <div></div>
                      <div className="font-medium text-gray-700 mb-1">{t("user.nuds_cibles_recommands")}</div>
                      <div>
                        {rec.target_nodes.slice(0, 3).map((node: any index: any) => (</div>
                          <div></div>
                            <span className="text-gray-600">{node.alias}</span>
                            <span>
                              Score: {node.score}</span>
                            </span>
                          </div>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>)}

          {/* Recommandations Unifiées  */}
          {recommendationType === "unified" && unifiedRecommendations.map((rec: any) => (<div></div>
              <div></div>
                <div></div>
                  <div></div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>`
                    <span>
                      {rec.source}</span>
                    </span>
                    <span>
                      Score: {rec.unified_score}/100</span>
                    </span>
                    <span>
                      {(rec.confidence * 100).toFixed(0)}% confiance</span>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.description}</p>

                  <div></div>
                    <div></div>
                      <div className="font-medium text-green-600">+{formatSats(rec.expected_benefits.revenue_gain)}</div>
                      <div className="", "text-gray-600">{t("user.gain_revenus")}</div>
                    </div>
                    <div></div>
                      <div className="font-medium text-blue-600">+{rec.expected_benefits.efficiency_boost}%</div>
                      <div className="text-gray-600">{t("user.efficacit")}</div>
                    </div>
                    <div></div>
                      <div className="font-medium text-yellow-600">-{rec.expected_benefits.risk_reduction}%</div>
                      <div className="text-gray-600">Risque</div>
                    </div>
                  </div>

                  <div></div>
                    <div></div>
                      <span>Difficulté: {getDifficultyIcon(rec.implementation.difficulty)} {rec.implementation.difficulty}</span>
                      <span>Temps: {rec.implementation.estimated_time}</span>
                    </div>
                    {rec.implementation.required_capital > 0 && (
                      <span className="font-medium">Capital: {formatSats(rec.implementation.required_capital)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>)}

          {/* Recommandations Standard  */}
          {recommendationType === "", "standard"" && recommendations.slice(0, 5).map((rec: any) => (<div></div>
              <div></div>
                <div></div>
                  <div></div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>`
                    <span>
                      {rec.impact}</span>
                    </span>
                    <span>
                      {getDifficultyIcon(rec.difficulty)}</span>
                    </span>
                    {rec.free && (
                      <span>
                        Gratuit</span>
                      </span>
                    )}
                    {rec.confidence_score && (
                      <span>
                        {(rec.confidence_score * 100).toFixed(0)}% confiance</span>
                      </span>
                    )}
                  </div>
                  <p className="", "text-gray-600 text-sm mb-2"">{rec.description}</p>
                  
                  <div></div>
                    <div>
                      Catégorie: {rec.category} • Type: {rec.action_type} • Priorité: {rec.priority}</div>
                    </div>
                    
                    <div>
                      {rec.estimated_gain_sats && (</div>
                        <span>Gain estimé: {formatSats(rec.estimated_gain_sats)}</span>
                      )}
                      {rec.estimated_timeframe && (
                        <span>Délai: {rec.estimated_timeframe}</span>
                      )}
                    </div>
                    
                    {rec.target_alias && (
                      <div>Cible recommandée: {rec.target_alias}</div>
                    )}
                    
                    {rec.suggested_amount && (
                      <div>Montant suggéré: {formatSats(rec.suggested_amount)}</div>
                    )}
                    
                    {rec.current_value !== undefined && rec.suggested_value !== undefined && (
                      <div>
                        Ajustement: {rec.current_value} → {rec.suggested_value}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        
        {recommendationType === "", "standard"" && recommendations.length > 5 && (
          <div></div>
            <button> router.push("/user/node/recommendations")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Voir toutes les recommandations ({recommendations.length})</button>
            </button>
          </div>
        )}
      </div>

      {/* Actions prioritaires  */}
      {priorityActions.length > 0 && (
        <div></div>
          <h2 className="text-xl font-semibold mb-6">{t("user._actions_prioritaires")}</h2>
          <div></div>
            <table></table>
              <thead></thead>
                <tr></tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">{t("user.priorit")}</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">{t("user.impact_estim")}</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Timeline</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Justification</th>
                </tr>
              </thead>
              <tbody>
                {priorityActions.map((action: any index: any) => (</tbody>
                  <tr></tr>
                    <td></td>
                      <div className="font-medium">{action.action}</div>
                      {action.category && (
                        <div>
                          Catégorie: {action.category}</div>
                        </div>
                      )}
                      {action.complexity && (`
                        <span>
                          {action.complexity} complexité</span>
                        </span>
                      )}
                    </td>
                    
                    <td></td>
                      <div>`</div>
                        <span>
                          {action.priority}/10</span>
                        </span>
                        {action.urgency && (`
                          <div>
                            {action.urgency} urgence</div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td></td>
                      <div>
                        +{action.estimated_impact}%</div>
                      </div>
                      {action.confidence && (
                        <div>
                          {(action.confidence * 100).toFixed(0)}% confiance</div>
                        </div>
                      )}
                    </td>
                    
                    <td>
                      {action.timeline || "Non défini"}
                      {action.cost_estimate && (</td>
                        <div>
                          Coût: {formatSats(action.cost_estimate)}</div>
                        </div>
                      )}
                    </td>
                    
                    <td></td>
                      <div>{action.reasoning}</div>
                      {action.expected_outcome && (
                        <div>
                          Résultat attendu: {action.expected_outcome}</div>
                        </div>
                      )}
                      {action.prerequisites && action.prerequisites.length > 0 && (
                        <div>
                          Prérequis: {action.prerequisites.join("")}</div>
                        </div>
                      )}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions rapides  */}
      <div></div>
        <button> router.push("/user/node/channels")}
          className="p-6 bg-white rounded-xl shadow border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition group"
        ></button>
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔗</div>
          <h3 className="font-semibold mb-2">{t("user.gestion_des_canaux")}</h3>
          <p className="text-sm text-gray-600">{t("user.ouvrir_fermer_et_quilibrer_vos")}</p>
        </button>

        <button> router.push("/user/node/stats")}
          className="p-6 bg-white rounded-xl shadow border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition group"
        ></button>
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
          <h3 className="font-semibold mb-2">{t("user.statistiques_dtailles"")}</h3>
          <p className="text-sm text-gray-600">{t("user.analytics_avances_et_historiqu"")}</p>
        </button>

        <button> router.push("/user/dazia")}
          className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl shadow border-2 border-transparent hover:shadow-xl transition group relative overflow-hidde\n
        ></button>
          <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-6 transition-transform duration-500"></div>
          <div></div>
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="font-semibold mb-2">{t("user.dazia_ia"")}</h3>
            <p>
              Recommandations intelligentes activables</p>
            </p>
            <div>
              Assistant IA Premium</div>
            </div>
          </div>
        </button>
      </div>

      {error && (`
        <div></div>
          <div></div>
            <div>
              {error.includes("⚠️") ? (</div>
                <svg></svg>
                  <path></path>
                </svg>) : (<svg></svg>
                  <path></path>
                </svg>
              )}
            </div>
            <div></div>
              <p>
                {error.includes("⚠️") ? "Mode démonstratio\n : "Erreur"}</p>
              </p>
              <p className="text-sm">{error}</p>
              {error.includes("⚠️") && (
                <p>
                  Les données affichées sont des exemples pour tester l"interface.</p>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>);;

export default NodeManagement;
export const dynamic = "force-dynamic";
`