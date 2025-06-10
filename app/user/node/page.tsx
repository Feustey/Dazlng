"use client";

import React, { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { daznoApi, isValidLightningPubkey } from '@/lib/dazno-api';
import type { NodeInfo, DaznoRecommendation, PriorityAction } from '@/lib/dazno-api';
import ApiStatusWidget from '@/app/user/components/ui/ApiStatusWidget';
import { 
  savePubkeyToCookie, 
  getValidPubkeyFromCookie, 
  clearPubkeyCookie,
  updatePubkeyAlias 
} from '@/lib/utils/cookies';

// Nouvelles interfaces pour les endpoints avancés
interface AmbossNodeInfo {
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

interface AmbossRecommendation {
  id: string;
  type: 'channel_management' | 'fee_optimization' | 'liquidity_management';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
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

interface UnifiedRecommendation {
  id: string;
  source: 'amboss' | 'sparkseer' | 'openai' | 'hybrid';
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
    difficulty: 'easy' | 'medium' | 'hard';
    estimated_time: string;
    required_capital: number;
  };
  unified_score: number;
}

const NodeManagement: FC = () => {
  const { session } = useSupabase();
  const router = useRouter();
  
  // États principaux
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [_userProfile, setUserProfile] = useState<any>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [recommendations, setRecommendations] = useState<DaznoRecommendation[]>([]);
  const [priorityActions, setPriorityActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pubkeyInput, setPubkeyInput] = useState('');

  // Nouveaux états pour les endpoints avancés
  const [ambossNodeInfo, setAmbossNodeInfo] = useState<AmbossNodeInfo | null>(null);
  const [ambossRecommendations, setAmbossRecommendations] = useState<AmbossRecommendation[]>([]);
  const [unifiedRecommendations, setUnifiedRecommendations] = useState<UnifiedRecommendation[]>([]);
  const [recommendationType, setRecommendationType] = useState<'standard' | 'amboss' | 'unified'>('unified');
  const [loadingAdvanced, setLoadingAdvanced] = useState(false);

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_DAZNO_API_URL || 'https://api.dazno.de';

  // Fonctions pour les nouveaux endpoints
  const fetchAmbossNodeInfo = async (nodePubkey: string): Promise<AmbossNodeInfo | null> => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/node/${nodePubkey}/info/amboss`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erreur fetch Amboss node info:', error);
      return null;
    }
  };

  const fetchAmbossRecommendations = async (nodePubkey: string): Promise<AmbossRecommendation[]> => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/channels/recommendations/amboss`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pubkey: nodePubkey,
          analysis_type: 'comprehensive',
          max_recommendations: 10
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.recommendations || [] : [];
    } catch (error) {
      console.error('Erreur fetch Amboss recommendations:', error);
      return [];
    }
  };

  const fetchUnifiedRecommendations = async (nodePubkey: string): Promise<UnifiedRecommendation[]> => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/channels/recommendations/unified`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pubkey: nodePubkey,
          sources: ['amboss', 'sparkseer', 'openai'],
          prioritize_by: 'revenue_potential',
          max_recommendations: 15
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data.recommendations || [] : [];
    } catch (error) {
      console.error('Erreur fetch unified recommendations:', error);
      return [];
    }
  };

  // Charger le profil utilisateur et vérifier le cookie au démarrage
  useEffect(() => {
    const loadUserProfile = async (): Promise<void> => {
      // D'abord, vérifier s'il y a une pubkey dans le cookie
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
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
          
          // Prioriser la pubkey du profil si disponible
          if (data.profile?.pubkey && isValidLightningPubkey(data.profile.pubkey)) {
            setPubkey(data.profile.pubkey);
            setPubkeyInput(data.profile.pubkey);
            // Sauvegarder dans le cookie avec l'alias
            savePubkeyToCookie(data.profile.pubkey, data.profile.alias);
          } 
          // Sinon utiliser celle du cookie si disponible
          else if (cookiePubkey) {
            setPubkey(cookiePubkey);
            setPubkeyInput(cookiePubkey);
          }
        } else if (cookiePubkey) {
          // Si l'API échoue mais qu'on a un cookie, l'utiliser
          setPubkey(cookiePubkey);
          setPubkeyInput(cookiePubkey);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        // En cas d'erreur, essayer quand même le cookie
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
  }, [pubkey]);

  const loadNodeData = async (nodePubkey: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier d'abord la disponibilité de l'API
      const apiHealth = await daznoApi.checkHealth();
      const isApiAvailable = apiHealth.status !== 'unavailable';

      // Appels parallèles à l'API DazNo réelle
      const [nodeInfoResponse, recommendationsResponse, prioritiesResponse] = await Promise.allSettled([
        daznoApi.getNodeInfo(nodePubkey),
        daznoApi.getRecommendations(nodePubkey),
        daznoApi.getPriorityActions(nodePubkey, ['optimize', 'rebalance', 'fees'])
      ]);

      // Traitement des résultats
      if (nodeInfoResponse.status === 'fulfilled') {
        setNodeInfo(nodeInfoResponse.value);
        // Mettre à jour l'alias dans le cookie si disponible
        if (nodeInfoResponse.value?.alias) {
          updatePubkeyAlias(nodeInfoResponse.value.alias);
        }
      } else {
        console.error('Erreur lors du chargement des infos du nœud:', nodeInfoResponse.reason);
      }

      if (recommendationsResponse.status === 'fulfilled') {
        setRecommendations(recommendationsResponse.value);
      } else {
        console.error('Erreur lors du chargement des recommandations:', recommendationsResponse.reason);
      }

      if (prioritiesResponse.status === 'fulfilled') {
        setPriorityActions(prioritiesResponse.value);
      } else {
        console.error('Erreur lors du chargement des actions prioritaires:', prioritiesResponse.reason);
      }

      // Charger les données avancées en parallèle
      await loadAdvancedData(nodePubkey);

      // Afficher un avertissement si l'API n'est pas disponible
      if (!isApiAvailable) {
        setError('⚠️ L\'API d\'analyse n\'est pas disponible. Les données affichées sont des exemples génériques. Vérifiez votre connexion réseau ou réessayez plus tard.');
      }

    } catch (err) {
      console.error('Erreur lors du chargement des données du nœud:', err);
      setError('Impossible de charger les données du nœud. Vérifiez que la clé publique est correcte.');
    } finally {
      setLoading(false);
    }
  };

  const loadAdvancedData = async (nodePubkey: string): Promise<void> => {
    if (!session?.access_token) return;

    setLoadingAdvanced(true);
    
    try {
      // Appels parallèles pour les nouveaux endpoints
      const [ambossInfo, ambossRecs, unifiedRecs] = await Promise.allSettled([
        fetchAmbossNodeInfo(nodePubkey),
        fetchAmbossRecommendations(nodePubkey),
        fetchUnifiedRecommendations(nodePubkey)
      ]);

      if (ambossInfo.status === 'fulfilled' && ambossInfo.value) {
        setAmbossNodeInfo(ambossInfo.value);
      }

      if (ambossRecs.status === 'fulfilled') {
        setAmbossRecommendations(ambossRecs.value);
      }

      if (unifiedRecs.status === 'fulfilled') {
        setUnifiedRecommendations(unifiedRecs.value);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données avancées:', error);
    } finally {
      setLoadingAdvanced(false);
    }
  };

  const savePubkeyToProfile = async (pubkeyValue: string): Promise<void> => {
    if (!session?.access_token) return;

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pubkey: pubkeyValue })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      console.log('Pubkey sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la pubkey:', error);
    }
  };

  const handlePubkeySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isValidLightningPubkey(pubkeyInput)) {
      setError('Format de clé publique invalide. Elle doit contenir 66 caractères hexadécimaux.');
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

  const _handleDisconnect = async (): Promise<void> => {
    try {
      if (session?.access_token) {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ pubkey: null })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la pubkey:', error);
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
    setPubkeyInput('');
  };

  // Fonctions utilitaires pour l'affichage
  const formatSats = (sats: number): string => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    }
    return sats.toLocaleString('fr-FR') + ' sats';
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // Graphique simple pour les tendances
  const SimpleChart: React.FC<{ data: number[]; title: string }> = ({ data, title }) => {
    if (data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="flex items-end gap-1 h-32 mb-4">
          {data.map((value, index) => {
            const height = ((value - min) / range) * 100;
            return (
              <div
                key={index}
                className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t flex-1 min-h-2"
                style={{ height: `${Math.max(height, 10)}%` }}
                title={`Jour ${index + 1}: ${formatSats(value)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>7 jours</span>
          <span>Aujourd'hui</span>
        </div>
      </div>
    );
  };

  // Si l'utilisateur n'est pas connecté
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre nœud.</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Se connecter
        </button>
      </div>
    );
  }

  // Si pas de pubkey configurée, afficher le formulaire de saisie
  if (!pubkey) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">⚡ Mon Nœud Lightning</h1>
          <p className="text-gray-600 mb-8">
            Connectez votre nœud Lightning pour accéder aux analytics et recommandations IA
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Connectez votre nœud</h2>
          


          {/* Formulaire de saisie manuelle */}
          <form onSubmit={handlePubkeySubmit} className="space-y-4">
            <div>
              <label htmlFor="pubkey" className="block text-sm font-medium text-gray-700 mb-2">
                Clé publique de votre nœud (66 caractères hexadécimaux)
              </label>
              <input
                type="text"
                id="pubkey"
                value={pubkeyInput}
                onChange={(e) => setPubkeyInput(e.target.value)}
                placeholder="03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                maxLength={66}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Votre clé publique ne sera utilisée qu'en lecture pour récupérer les statistiques publiques
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || pubkeyInput.length !== 66}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Connecter mon nœud'}
            </button>
          </form>

          {error && (
            <div className={`p-4 rounded-lg border ${
              error.includes('⚠️') 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {error.includes('⚠️') ? (
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {error.includes('⚠️') ? 'Mode démonstration' : 'Erreur'}
                  </p>
                  <p className="text-sm">{error}</p>
                  {error.includes('⚠️') && (
                    <p className="text-xs mt-1 opacity-75">
                      Les données affichées sont des exemples pour tester l'interface.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Affichage principal avec les données du nœud
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">⚡ Mon Nœud Lightning</h1>
          <p className="text-gray-600">
            Analytics et recommandations IA pour optimiser vos performances
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ApiStatusWidget />
      
        </div>
      </div>

      {loading && !nodeInfo && (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600">Chargement des données du nœud...</p>
        </div>
      )}

      {/* Informations générales du nœud avec Amboss */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Alias: </span>
                <span className="text-gray-900">{nodeInfo?.alias || ambossNodeInfo?.alias || 'Non défini'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Clé publique: </span>
                <span className="font-mono text-sm text-gray-900 break-all">{pubkey}</span>
              </div>
              {nodeInfo?.total_network_nodes && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Réseau Lightning: </span>
                  <span className="text-gray-900">{nodeInfo.total_network_nodes.toLocaleString()} nœuds</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              {nodeInfo?.health_score ? (
                <div className={`text-6xl font-bold mb-2 px-6 py-4 rounded-xl border-2 ${getHealthScoreColor(nodeInfo.health_score)}`}>
                  {nodeInfo.health_score}%
                </div>
              ) : ambossNodeInfo?.performance_score ? (
                <div className={`text-6xl font-bold mb-2 px-6 py-4 rounded-xl border-2 ${getHealthScoreColor(ambossNodeInfo.performance_score)}`}>
                  {ambossNodeInfo.performance_score}%
                </div>
              ) : (
                <div className="text-6xl font-bold mb-2 px-6 py-4 rounded-xl border-2 text-gray-400 bg-gray-50 border-gray-200">
                  N/A
                </div>
              )}
              <div className="text-sm font-medium text-gray-700">
                {ambossNodeInfo ? 'Score Performance Amboss' : 'Score de santé'}
              </div>
              {nodeInfo?.network_rank && nodeInfo?.total_network_nodes && (
                <div className="text-xs text-gray-500 mt-1">
                  Classé #{nodeInfo.network_rank} / {nodeInfo.total_network_nodes.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métriques Amboss enrichies */}
        {ambossNodeInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">📊 Métriques Amboss</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Connectivité</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Centralité:</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.centrality * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accessibilité:</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.reachability * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stabilité:</span>
                    <span className="font-medium">{(ambossNodeInfo.connectivity_metrics.stability * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Analyse des frais</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux médian:</span>
                    <span className="font-medium">{ambossNodeInfo.fee_analysis.median_fee_rate} ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compétitivité:</span>
                    <span className={`font-medium ${
                      ambossNodeInfo.fee_analysis.fee_competitiveness === 'high' ? 'text-green-600' :
                      ambossNodeInfo.fee_analysis.fee_competitiveness === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {ambossNodeInfo.fee_analysis.fee_competitiveness}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score optimisation:</span>
                    <span className="font-medium">{ambossNodeInfo.fee_analysis.optimization_score}/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Liquidité</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liquidité totale:</span>
                    <span className="font-medium">{formatSats(ambossNodeInfo.liquidity_metrics.total_liquidity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance locale:</span>
                    <span className="font-medium">{formatSats(ambossNodeInfo.liquidity_metrics.local_balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ratio d'équilibre:</span>
                    <span className="font-medium">{(ambossNodeInfo.liquidity_metrics.balance_ratio * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Métriques principales */}
      {(nodeInfo || ambossNodeInfo) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {formatSats((nodeInfo?.capacity || ambossNodeInfo?.capacity) || 0)}
              </div>
              <div className="text-sm text-gray-600">Capacité totale</div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {nodeInfo?.active_channels || nodeInfo?.channels || ambossNodeInfo?.channels || 0}
              </div>
              <div className="text-sm text-gray-600">Canaux actifs</div>
              {nodeInfo?.inactive_channels && (
                <div className="text-xs text-gray-500 mt-1">
                  {nodeInfo.inactive_channels} inactifs
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {nodeInfo?.uptime_percentage ? `${nodeInfo.uptime_percentage.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {nodeInfo?.forwarding_efficiency ? `${nodeInfo.forwarding_efficiency.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Efficacité de routage</div>
            </div>
          </div>

          {/* Métriques avancées */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">📊 Métriques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Centralité */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Centralité du réseau</h3>
                {nodeInfo.betweenness_centrality !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Betweenness:</span>
                    <span className="font-medium">{(nodeInfo.betweenness_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
                {nodeInfo.closeness_centrality !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Closeness:</span>
                    <span className="font-medium">{(nodeInfo.closeness_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
                {nodeInfo.eigenvector_centrality !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Eigenvector:</span>
                    <span className="font-medium">{(nodeInfo.eigenvector_centrality * 100).toFixed(3)}%</span>
                  </div>
                )}
              </div>

              {/* Frais et HTLC */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Configuration des frais</h3>
                {nodeInfo.base_fee_median !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Frais de base (médian):</span>
                    <span className="font-medium">{nodeInfo.base_fee_median} sats</span>
                  </div>
                )}
                {nodeInfo.fee_rate_median !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taux de frais (médian):</span>
                    <span className="font-medium">{nodeInfo.fee_rate_median} ppm</span>
                  </div>
                )}
                {nodeInfo.htlc_minimum_msat !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">HTLC min:</span>
                    <span className="font-medium">{(nodeInfo.htlc_minimum_msat / 1000).toFixed(0)} sats</span>
                  </div>
                )}
              </div>

              {/* Performance */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Performance (7 jours)</h3>
                {nodeInfo.routed_payments_7d !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paiements routés:</span>
                    <span className="font-medium">{nodeInfo.routed_payments_7d.toLocaleString()}</span>
                  </div>
                )}
                {nodeInfo.routing_revenue_7d !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenus de routage:</span>
                    <span className="font-medium">{formatSats(nodeInfo.routing_revenue_7d)}</span>
                  </div>
                )}
                {nodeInfo.peer_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nombre de pairs:</span>
                    <span className="font-medium">{nodeInfo.peer_count}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}

      {/* Graphiques de tendances avec données réelles */}
      {nodeInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {nodeInfo.routing_history && nodeInfo.routing_history.length > 0 ? (
            <SimpleChart 
              data={nodeInfo.routing_history}
              title="📊 Évolution des revenus de routage"
            />
          ) : (
            <SimpleChart 
              data={[12000, 15000, 18000, 14000, 22000, 19000, 25000]}
              title="📊 Évolution des revenus (données simulées)"
            />
          )}
          
          {nodeInfo.capacity_history && nodeInfo.capacity_history.length > 0 ? (
            <SimpleChart 
              data={nodeInfo.capacity_history}
              title="⚡ Évolution de la capacité"
            />
          ) : (
            <SimpleChart 
              data={[45000000, 47000000, 46000000, 50000000, 48000000, 52000000, 50000000]}
              title="⚡ Évolution de la capacité (données simulées)"
            />
          )}
        </div>
      )}

      {/* Recommandations IA Avancées */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">🤖 Recommandations IA</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setRecommendationType('standard')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === 'standard'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setRecommendationType('amboss')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === 'amboss'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Amboss
            </button>
            <button
              onClick={() => setRecommendationType('unified')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                recommendationType === 'unified'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unifiées
            </button>
          </div>
        </div>

        {loadingAdvanced && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full mb-4" />
            <p className="text-gray-600">Chargement des recommandations avancées...</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Recommandations Amboss */}
          {recommendationType === 'amboss' && ambossRecommendations.map((rec) => (
            <div key={rec.id} className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                      Amboss Score: {rec.amboss_score}/100
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">+{rec.expected_impact.revenue_increase}%</div>
                      <div className="text-gray-600">Revenus</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">+{rec.expected_impact.liquidity_improvement}%</div>
                      <div className="text-gray-600">Liquidité</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="font-medium text-purple-600">+{rec.expected_impact.routing_efficiency}%</div>
                      <div className="text-gray-600">Efficacité</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="font-medium mb-1">Actions suggérées:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.suggested_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  {rec.target_nodes && rec.target_nodes.length > 0 && (
                    <div className="mt-3 text-xs">
                      <div className="font-medium text-gray-700 mb-1">Nœuds cibles recommandés:</div>
                      <div className="space-y-1">
                        {rec.target_nodes.slice(0, 3).map((node, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{node.alias}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              Score: {node.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Recommandations Unifiées */}
          {recommendationType === 'unified' && unifiedRecommendations.map((rec) => (
            <div key={rec.id} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.source === 'amboss' ? 'bg-purple-100 text-purple-600' :
                      rec.source === 'sparkseer' ? 'bg-blue-100 text-blue-600' :
                      rec.source === 'openai' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {rec.source}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      Score: {rec.unified_score}/100
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {(rec.confidence * 100).toFixed(0)}% confiance
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-600">+{formatSats(rec.expected_benefits.revenue_gain)}</div>
                      <div className="text-gray-600">Gain revenus</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-600">+{rec.expected_benefits.efficiency_boost}%</div>
                      <div className="text-gray-600">Efficacité</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="font-medium text-yellow-600">-{rec.expected_benefits.risk_reduction}%</div>
                      <div className="text-gray-600">Risque</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Difficulté: {getDifficultyIcon(rec.implementation.difficulty)} {rec.implementation.difficulty}</span>
                      <span>Temps: {rec.implementation.estimated_time}</span>
                    </div>
                    {rec.implementation.required_capital > 0 && (
                      <span className="font-medium">Capital: {formatSats(rec.implementation.required_capital)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Recommandations Standard */}
          {recommendationType === 'standard' && recommendations.slice(0, 5).map((rec) => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                      {rec.impact}
                    </span>
                    <span className="text-sm">
                      {getDifficultyIcon(rec.difficulty)}
                    </span>
                    {rec.free && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                        Gratuit
                      </span>
                    )}
                    {rec.confidence_score && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {(rec.confidence_score * 100).toFixed(0)}% confiance
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>
                      Catégorie: {rec.category} • Type: {rec.action_type} • Priorité: {rec.priority}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {rec.estimated_gain_sats && (
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
                        Ajustement: {rec.current_value} → {rec.suggested_value}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendationType === 'standard' && recommendations.length > 5 && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/user/node/recommendations')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Voir toutes les recommandations ({recommendations.length})
            </button>
          </div>
        )}
      </div>

      {/* Actions prioritaires */}
      {priorityActions.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">🎯 Actions prioritaires</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Priorité</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Impact estimé</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Timeline</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Justification</th>
                </tr>
              </thead>
              <tbody>
                {priorityActions.map((action, index) => (
                  <tr key={action.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{action.action}</div>
                      {action.category && (
                        <div className="text-xs text-gray-500 mt-1">
                          Catégorie: {action.category}
                        </div>
                      )}
                      {action.complexity && (
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                          action.complexity === 'low' ? 'bg-green-100 text-green-600' :
                          action.complexity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {action.complexity} complexité
                        </span>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          action.priority <= 3 ? 'bg-red-100 text-red-600' :
                          action.priority <= 6 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {action.priority}/10
                        </span>
                        {action.urgency && (
                          <div className={`text-xs ${
                            action.urgency === 'high' ? 'text-red-600' :
                            action.urgency === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {action.urgency} urgence
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <div className="font-semibold text-indigo-600">
                        +{action.estimated_impact}%
                      </div>
                      {action.confidence && (
                        <div className="text-xs text-gray-500 mt-1">
                          {(action.confidence * 100).toFixed(0)}% confiance
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-center text-sm">
                      {action.timeline || 'Non défini'}
                      {action.cost_estimate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Coût: {formatSats(action.cost_estimate)}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>{action.reasoning}</div>
                      {action.expected_outcome && (
                        <div className="text-xs text-green-600 mt-1">
                          Résultat attendu: {action.expected_outcome}
                        </div>
                      )}
                      {action.prerequisites && action.prerequisites.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Prérequis: {action.prerequisites.join(', ')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/user/node/channels')}
          className="p-6 bg-white rounded-xl shadow border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔗</div>
          <h3 className="font-semibold mb-2">Gestion des canaux</h3>
          <p className="text-sm text-gray-600">Ouvrir, fermer et équilibrer vos canaux</p>
        </button>

        <button
          onClick={() => router.push('/user/node/stats')}
          className="p-6 bg-white rounded-xl shadow border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
          <h3 className="font-semibold mb-2">Statistiques détaillées</h3>
          <p className="text-sm text-gray-600">Analytics avancées et historiques</p>
        </button>

        <button
          onClick={() => router.push('/user/dazia')}
          className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl shadow border-2 border-transparent hover:shadow-xl transition group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 transform -skew-y-6 group-hover:skew-y-6 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="font-semibold mb-2">Dazia IA</h3>
            <p className="text-sm opacity-90">
              Recommandations intelligentes activables
            </p>
            <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
              Assistant IA Premium
            </div>
          </div>
        </button>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${
          error.includes('⚠️') 
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {error.includes('⚠️') ? (
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {error.includes('⚠️') ? 'Mode démonstration' : 'Erreur'}
              </p>
              <p className="text-sm">{error}</p>
              {error.includes('⚠️') && (
                <p className="text-xs mt-1 opacity-75">
                  Les données affichées sont des exemples pour tester l'interface.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeManagement;
