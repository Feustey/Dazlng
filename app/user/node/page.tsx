"use client";

import React, { useState, useEffect, FC, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';

interface NodeStats {
  // Statistiques de base
  alias?: string;
  pubkey: string;
  totalCapacity: number;
  channelCount: number;
  lastUpdate: string;
  
  // Métriques avancées
  centrality?: {
    betweenness: number;
    closeness: number;
    degree: number;
  };
  
  // Historique et performance
  uptime?: number;
  avgFeeRate?: number;
  revenueLastWeek?: number;
  
  // Canaux
  channels?: {
    active: number;
    inactive: number;
    avgCapacity: number;
    medianCapacity: number;
    oldestAge: string;
    youngestAge: string;
  };
}

interface NodeHistory {
  capacityGrowth?: Array<{ date: string; value: number }>;
  channelGrowth?: Array<{ date: string; value: number }>;
  revenueGrowth?: Array<{ date: string; value: number }>;
}

const NodeManagement: FC = () => {
  const { session } = useSupabase();
  const [pubkey, setPubkey] = useState<string | null>(null);

  // Fonction pour sauvegarder la pubkey dans le profil utilisateur
  const savePubkeyToProfile = async (pubkeyValue: string): Promise<void> => {
    try {
      if (!session?.access_token) {
        console.warn('Pas de session disponible pour sauvegarder la pubkey');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pubkey: pubkeyValue })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur lors de la sauvegarde de la pubkey:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      console.log('Pubkey sauvegardée avec succès dans le profil');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la pubkey:', error);
      // Ne pas bloquer l'expérience utilisateur, juste logger l'erreur
    }
  };
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [_history, setHistory] = useState<NodeHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchNodeData = useCallback(async (nodeId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://api.dazno.de/network/analyze/${nodeId}`, {
        headers: {
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      setStats(data);
      
      // Sauvegarder la pubkey dans la base de données ET localStorage
      await savePubkeyToProfile(nodeId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_pubkey', nodeId);
      }

    } catch (err) {
      console.error('Erreur lors de la récupération des données du nœud:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPubkey = localStorage.getItem('user_pubkey');
      if (savedPubkey) {
        setPubkey(savedPubkey);
        fetchNodeData(savedPubkey);
      }
    }
  }, [fetchNodeData]);

  const handleWebLNConnection = async (): Promise<void> => {
    try {
      // Type webln correctement
      interface WebLN {
        enable(): Promise<void>;
        getInfo?(): Promise<{ node?: { pubkey?: string } }>;
      }
      
      const windowWithWebLN = window as { webln?: WebLN };
      const webln = windowWithWebLN.webln;
      
      if (!webln) {
        throw new Error('WebLN non disponible. Veuillez installer une extension compatible comme Alby.');
      }
      
      await webln.enable();
      
      // Essayer d'obtenir les infos du nœud si la méthode existe
      if (typeof webln.getInfo === 'function') {
        const info = await webln.getInfo();
        if (info?.node?.pubkey) {
          setPubkey(info.node.pubkey);
          await fetchNodeData(info.node.pubkey);
          return;
        }
      }
      
      // Si getInfo n'est pas disponible, demander la pubkey manuellement
      throw new Error('Impossible de récupérer automatiquement la clé publique. Veuillez utiliser la saisie manuelle.');
    } catch (err) {
      setError('Erreur WebLN: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const handleManualPubkey = async (): Promise<void> => {
    const pubkey = prompt('Entrez votre clé publique Lightning (66 caractères hexadécimaux):');
    if (pubkey) {
      // Validation basique du format
      if (!/^[0-9a-fA-F]{66}$/.test(pubkey)) {
        setError('Format de clé publique invalide. Elle doit contenir 66 caractères hexadécimaux.');
        return;
      }
      
      setPubkey(pubkey);
      await savePubkeyToProfile(pubkey);
      await fetchNodeData(pubkey);
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      // Supprimer la pubkey du profil
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
    setStats(null);
    setHistory(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_pubkey');
    }
  };

  // Si pas de pubkey, afficher le formulaire de saisie
  if (!pubkey) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Mon Nœud Lightning</h1>
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Connectez votre nœud</h2>
          <p className="text-gray-600 mb-8">Choisissez comment connecter votre nœud Lightning</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* WebLN */}
            <button 
              onClick={handleWebLNConnection}
              disabled={loading}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">WebLN (Alby)</h3>
              <p className="text-sm text-gray-600">Connexion via extension browser</p>
            </button>

            {/* Saisie manuelle */}
            <button 
              onClick={handleManualPubkey}
              disabled={loading}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">🔑</div>
              <h3 className="font-semibold mb-2">Clé publique</h3>
              <p className="text-sm text-gray-600">Entrez manuellement votre pubkey</p>
            </button>

            {/* DazBox */}
            <button 
              onClick={() => router.push('/checkout/dazbox')}
              disabled={loading}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition bg-gradient-to-br from-purple-50 to-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold mb-2">DazBox</h3>
              <p className="text-sm text-gray-600">Obtenez un nœud plug & play</p>
            </button>
          </div>

          {loading && (
            <div className="mt-6">
              <div className="animate-spin h-8 w-8 mx-auto border-4 border-purple-500 border-t-transparent rounded-full" />
              <p className="mt-2 text-gray-600">Connexion en cours...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin h-12 w-12 mx-auto border-4 border-purple-500 border-t-transparent rounded-full" />
        <p className="mt-4 text-gray-600">Chargement des données du nœud...</p>
      </div>
    );
  }

  // Affichage des statistiques du nœud
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon Nœud Lightning</h1>
        <button
          onClick={handleDisconnect}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border"
        >
          Changer de nœud
        </button>
      </div>

      {/* Informations du nœud */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Informations du nœud</h2>
        <div className="space-y-2">
          {stats?.alias && (
            <div>
              <span className="text-sm font-medium text-gray-500">Alias: </span>
              <span className="text-gray-900">{stats.alias}</span>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-500">Clé publique: </span>
            <span className="font-mono text-sm text-gray-900 break-all">{pubkey}</span>
          </div>
          {stats?.lastUpdate && (
            <div>
              <span className="text-sm font-medium text-gray-500">Dernière mise à jour: </span>
              <span className="text-gray-900">{new Date(stats.lastUpdate).toLocaleString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Informations principales */}
      {stats && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Statistiques principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Capacité Totale</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.totalCapacity?.toLocaleString() || 'N/A'} sats
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre de Canaux</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.channelCount || 'N/A'}
              </p>
            </div>
            {stats.channels && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Canaux Actifs</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.channels.active} / {stats.channelCount}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Capacité Moyenne</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stats.channels.avgCapacity?.toLocaleString() || 'N/A'} sats
                  </p>
                </div>
              </>
            )}
            {stats.uptime !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Uptime</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.uptime.toFixed(2)}%
                </p>
              </div>
            )}
            {stats.revenueLastWeek !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Revenu (7j)</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.revenueLastWeek.toLocaleString()} sats
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Métriques de centralité */}
      {stats?.centrality && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Métriques de Centralité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Betweenness</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {stats.centrality.betweenness.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">Importance dans les chemins de routage</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Closeness</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {stats.centrality.closeness.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">Proximité au réseau</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Degree</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {stats.centrality.degree.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">Nombre de connexions directes</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/user/node/channels')}
          className="p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="font-semibold">Canaux</h3>
          <p className="text-sm text-gray-600">Gérez vos canaux</p>
        </button>

        <button
          onClick={() => router.push('/user/node/stats')}
          className="p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold">Statistiques</h3>
          <p className="text-sm text-gray-600">Analysez vos performances</p>
        </button>

        <button
          onClick={() => router.push('/user/node/recommendations')}
          className="p-4 bg-white rounded-xl border hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">💡</div>
          <h3 className="font-semibold">Optimisations</h3>
          <p className="text-sm text-gray-600">Recommandations IA</p>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h3 className="font-semibold">Erreur</h3>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Masquer
          </button>
        </div>
      )}
    </div>
  );
};

export default NodeManagement;
