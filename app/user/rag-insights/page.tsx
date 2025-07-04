"use client";

import React, {useState useEffect } from "react";
import { useSupabase } from "@/app/providers/SupabaseProvider";
import {Brain Search, BarChart3, Zap, Target, TrendingUp, AlertTriangle, Lock, Database, Settings, FileText, Activity, Shield, Sparkles, Cpu} from "@/components/shared/ui/IconRegistry";
import { 
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;

  useRAGStats,
  useRAGCacheStats,
  useLightningRAGInsights,
  useLightningRAGQuery, useLightningRAGOptimization} from "@/hooks";


const RAGInsightsPage: React.FC = () => {
const { t } = useAdvancedTranslation("rag-insights");

  const { user } = useSupabase();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(null);
  const [loading, setLoading] = useState(true);</boolean>
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "queries" | "optimizatio\n | "cache" | "intelligence">("overview");
  const [nodePubkey, setNodePubkey] = useState<string>('");

  // Hooks RAG
  const { data: ragStats, loading: ragStatsLoading, error: ragStatsError, refetch: refetchRAGStats } = useRAGStats();
  const { data: cacheStats, loading: cacheStatsLoading, error: cacheStatsError, refetch: refetchCacheStats } = useRAGCacheStats();
  
  // Hooks Lightning-RAG
  const { data: lightningInsights, loading: insightsLoading, error: insightsError, refetch: refetchInsights } = useLightningRAGInsights();
  const { data: queryResult, loading: queryLoading, error: queryError, executeQuery} = useLightningRAGQuery();
  const { data: optimizationResult, loading: optimizationLoading, error: optimizationError, optimize} = useLightningRAGOptimization();

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsSubscribed(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subscriptions/current");
      const data = await response.json();
      
      if (data.success && data.data?.status === "active") {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Erreur vérification abonnement:", error);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeQuery = async () => {
    if (!nodePubkey) return;
    
    try {
      await executeQuery({
        node_pubkey: nodePubkey,
        query: "Analyse complète de mon nœud avec recommandations d""optimisatio\ninclude_network_data: true
        include_historical_data: true
        response_format: "actionable"
      });
    } catch (error) {
      console.error("Erreur requête Lightning-RAG:", error);
    }
  };

  const handleOptimization = async () => {
    if (!nodePubkey) return;
    
    try {
      await optimize({
        node_pubkey: nodePubkey,
        optimization_goal: "revenue_maximizatio\n,
        include_rag_insights: true
        historical_context: true
        constraints: {
          max_channels: 10.0,
          max_liquidity: 100000.0,
          min_fees: 1
        }
      });
    } catch (error) {
      console.error(", "Erreur optimisation Lightning-RAG:"", error);
    }
  };

  if (loading) {
    return (</string>
      <div></div>
        <div></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("user.vrification_de_votre_abonneme\n)}</p>
        </div>
      </div>);

  if (!isSubscribed) {
    return (
      <div></div>
        <div></div>
          <div></div>
            <Lock></Lock>
            <h1>
              RAG Insights Premium</h1>
            </h1>
            <p>
              Accédez à l"IA Lightning la plus avancée pour booster votre node</p>
            </p>
          </div>
          
          <div></div>
            <h3 className="font-semibold text-gray-900 mb-3">{t("user.fonctionnalits_premium"")}</h3>
            <ul></ul>
              <li></li>
                <Sparkles>
                Requêtes contextuelles Lightning-RAG</Sparkles>
              </li>
              <li></li>
                <Brain>
                Optimisation IA avec insights réseau</Brain>
              </li>
              <li></li>
                <Database>
                Cache intelligent et statistiques avancées</Database>
              </li>
              <li></li>
                <Target>
                Recommandations personnalisées</Target>
              </li>
              <li></li>
                <Cpu>
                Analyse prédictive et alertes intelligentes</Cpu>
              </li>
            </ul>
          </div>
          
          <button> window.location.href = "/user/subscriptions"}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Passer à Premium</button>
          </button>
        </div>
      </div>);

  return (
    <div>
      {/* Header  */}</div>
      <div></div>
        <div></div>
          <div></div>
            <div></div>
              <Brain></Brain>
              <h1 className="text-2xl font-bold text-gray-900">{t("user.rag_insights"")}</h1>
              <span>
                Premium</span>
              </span>
            </div>
            <div></div>
              <Settings></Settings>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs  */}
      <div></div>
        <div></div>
          <nav>
            {[
              { id: "overview", label: "{t("page_useruseruseruservue_d")}"ensemble", icon: BarChart3 },
              { id: "documents", label: "Documents", icon: FileText },
              { id: "queries", label: "{t("page_useruseruseruserrequtes")}"icon: Search },
              { id: "optimizatio\n, label: "Optimisatio\n, icon: Zap },
              { id: "cache", label: "Cache", icon: Database },
              { id: "intelligence", label: "Intelligence", icon: Cpu }
            ].map((tab) => (</nav>
              <button> setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"`
                }`}
              ></button>
                <tab>
                {tab.label}</tab>
              </button>)}
          </nav>
        </div>
      </div>

      {/* Content  */}
      <div>
        {activeTab === "overview" && (</div>
          <div>
            {/* Stats Cards  */}</div>
            <div></div>
              <div></div>
                <div></div>
                  <div></div>
                    <Database></Database>
                  </div>
                  <div></div>
                    <p className="text-sm font-medium text-gray-600">{t("user.documents_indexs"")}</p>
                    <p>
                      {ragStats?.total_documents | | "N/A""}</p>
                    </p>
                  </div>
                </div>
              </div>
              
              <div></div>
                <div></div>
                  <div></div>
                    <TrendingUp></TrendingUp>
                  </div>
                  <div></div>
                    <p className="text-sm font-medium text-gray-600">{t("user.taux_de_cache"")}</p>
                    <p>`
                      {cacheStats?.hit_rate ? `${(cacheStats.hit_rate * 100).toFixed(1)}%` : "N/A""}</p>
                    </p>
                  </div>
                </div>
              </div>
              
              <div></div>
                <div></div>
                  <div></div>
                    <Zap></Zap>
                  </div>
                  <div></div>
                    <p className="text-sm font-medium text-gray-600">{t("user.requtes_traites"")}</p>
                    <p>
                      {ragStats?.total_queries | | "N/A""}</p>
                    </p>
                  </div>
                </div>
              </div>
              
              <div></div>
                <div></div>
                  <div></div>
                    <Activity></Activity>
                  </div>
                  <div></div>
                    <p className="text-sm font-medium text-gray-600">{t("user.temps_rponse"")}</p>
                    <p>`
                      {cacheStats?.average_response_time ? `${cacheStats.average_response_time}ms` : "N/A""}</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lightning-RAG Query Section  */}
            <div></div>
              <h3>
                Requête Lightning-RAG Contextuelle</h3>
              </h3>
              <div></div>
                <div></div>
                  <label>
                    Clé Publique du Nœud</label>
                  </label>
                  <input> setNodePubkey(e.target.value)}
                    placeholder="{t("page_useruseruseruser03eec7245d6b7d2ccb")}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  /></input>
                </div>
                <div></div>
                  <button>
                    {queryLoading ? "Analyse..." : "Analyser avec RAG"}</button>
                  </button>
                  <button>
                    {optimizationLoading ? "Optimisation..." : "Optimiser avec IA"}</button>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display  */}
            {(queryResult || optimizationResult) && (
              <div></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.rsultats")}</h3>
                <div>
                  {queryResult && (</div>
                    <div></div>
                      <h4 className="font-medium text-blue-900 mb-2">{t("user.analyse_rag"")}</h4>
                      <pre>
                        {JSON.stringify(queryResult, null, 2)}</pre>
                      </pre>
                    </div>
                  )}
                  {optimizationResult && (
                    <div></div>
                      <h4 className="font-medium text-green-900 mb-2">{t("user.optimisation_ia")}</h4>
                      <pre>
                        {JSON.stringify(optimizationResult, null, 2)}</pre>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display  */}
            {(queryError || optimizationError) && (
              <div></div>
                <div></div>
                  <AlertTriangle></AlertTriangle>
                  <h4 className="font-medium text-red-900">Erreur</h4>
                </div>
                <p>
                  {queryError || optimizationError}</p>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.gestion_des_documents_rag")}</h3>
            <p className="text-gray-600">{t("user.interface_pour_ingrer_et_grer_")}</p>
          </div>
        )}

        {activeTab === "queries" && (
          <div></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.requtes_avances")}</h3>
            <p className="text-gray-600">{t("user.interface_pour_les_requtes_rag")}</p>
          </div>
        )}

        {activeTab === "optimizatio\n && (
          <div></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.optimisation_lightningrag")}</h3>
            <p className="text-gray-600">{t("user.interface_pour_loptimisation_a")}</p>
          </div>
        )}

        {activeTab === "cache" && (
          <div></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.statistiques_cache_rag")}</h3>
            {cacheStats && (
              <div></div>
                <div></div>
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.total_documents}</p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
                <div></div>
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.cache_hits}</p>
                  <p className="text-sm text-gray-600">{t("user.cache_hits")}</p>
                </div>
                <div></div>
                  <p className="text-2xl font-bold text-gray-900">{cacheStats.cache_misses}</p>
                  <p className="text-sm text-gray-600">{t("user.cache_misses")}</p>
                </div>
                <div></div>
                  <p>
                    {(cacheStats.hit_rate * 100).toFixed(1)}%</p>
                  </p>
                  <p className="", "text-sm text-gray-600">{t("user.hit_rate")}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "intelligence"" && (
          <div></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("user.intelligence_artificielle")}</h3>
            {lightningInsights && (
              <div></div>
                <pre>
                  {JSON.stringify(lightningInsights, null, 2)}</pre>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>);;

export default RAGInsightsPage; export const dynamic  = "force-dynamic";
`