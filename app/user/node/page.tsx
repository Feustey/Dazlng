"use client";

import React, { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { daznoApi, isValidLightningPubkey } from '@/lib/dazno-api';
import type { NodeInfo, DaznoRecommendation, PriorityAction } from '@/lib/dazno-api';
import ApiStatusWidget from '@/app/user/components/ui/ApiStatusWidget';

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

  // Charger le profil utilisateur au démarrage
  useEffect(() => {
    const loadUserProfile = async (): Promise<void> => {
      if (!session?.access_token) {
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
          
          // Si l'utilisateur a déjà une pubkey, la charger
          if (data.profile?.pubkey) {
            setPubkey(data.profile.pubkey);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
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

      // Appels parallèles à l'API DazNo réelle
      const [nodeInfoResponse, recommendationsResponse, prioritiesResponse] = await Promise.allSettled([
        daznoApi.getNodeInfo(nodePubkey),
        daznoApi.getRecommendations(nodePubkey),
        daznoApi.getPriorityActions(nodePubkey, ['optimize', 'rebalance', 'fees'])
      ]);

      // Traitement des résultats
      if (nodeInfoResponse.status === 'fulfilled') {
        setNodeInfo(nodeInfoResponse.value);
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

    } catch (err) {
      console.error('Erreur lors du chargement des données du nœud:', err);
      setError('Impossible de charger les données du nœud. Vérifiez que la clé publique est correcte.');
    } finally {
      setLoading(false);
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
    await savePubkeyToProfile(pubkeyInput);
  };



  const handleDisconnect = async (): Promise<void> => {
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

    setPubkey(null);
    setNodeInfo(null);
    setRecommendations([]);
    setPriorityActions([]);
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
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
              <h4 className="font-medium mb-1">Erreur</h4>
              <p className="text-sm">{error}</p>
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
          <button
            onClick={handleDisconnect}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border hover:bg-gray-50 transition"
          >
            Changer de nœud
          </button>
        </div>
      </div>

      {loading && !nodeInfo && (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600">Chargement des données du nœud...</p>
        </div>
      )}

      {/* Informations générales du nœud */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Alias: </span>
                <span className="text-gray-900">{nodeInfo?.alias || 'Non défini'}</span>
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
          
          {nodeInfo?.health_score && (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 px-6 py-4 rounded-xl border-2 ${getHealthScoreColor(nodeInfo.health_score)}`}>
                  {nodeInfo.health_score}%
                </div>
                <div className="text-sm font-medium text-gray-700">Score de santé</div>
                {nodeInfo.network_rank && nodeInfo.total_network_nodes && (
                  <div className="text-xs text-gray-500 mt-1">
                    Classé #{nodeInfo.network_rank} / {nodeInfo.total_network_nodes.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Métriques principales */}
      {nodeInfo && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {formatSats(nodeInfo.capacity || 0)}
              </div>
              <div className="text-sm text-gray-600">Capacité totale</div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {nodeInfo.active_channels || nodeInfo.channels || 0}
              </div>
              <div className="text-sm text-gray-600">Canaux actifs</div>
              {nodeInfo.inactive_channels && (
                <div className="text-xs text-gray-500 mt-1">
                  {nodeInfo.inactive_channels} inactifs
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {nodeInfo.uptime_percentage ? `${nodeInfo.uptime_percentage.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {nodeInfo.forwarding_efficiency ? `${nodeInfo.forwarding_efficiency.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Efficacité de routage</div>
            </div>
          </div>

          {/* Métriques SparkSeer avancées */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">📊 Métriques Avancées SparkSeer</h2>
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

      {/* Recommandations IA */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">🤖 Recommandations IA</h2>
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((rec) => (
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
                    
                    {/* Détails SparkSeer enrichis */}
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
          
          {recommendations.length > 5 && (
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
      )}

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
          onClick={() => router.push('/user/node/recommendations')}
          className="p-6 bg-white rounded-xl shadow border-2 border-transparent hover:border-indigo-200 hover:shadow-lg transition group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💡</div>
          <h3 className="font-semibold mb-2">Optimisations IA</h3>
          <p className="text-sm text-gray-600">Recommandations personnalisées</p>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-semibold mb-1">Erreur</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Masquer
          </button>
        </div>
      )}
    </div>
  );
};

export default NodeManagement;
