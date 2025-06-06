"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';

interface Channel {
  id: string;
  remotePubkey: string;
  remoteAlias?: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: 'active' | 'inactive' | 'pending' | 'closing';
  isPrivate: boolean;
  channelPoint: string;
  feeRatePerKw: number;
  baseFee: number;
  feeRate: number;
  timelock: number;
  minHtlc: number;
  maxHtlc: number;
  lastUpdate: string;
  uptime: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

const NodeChannelsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const router = useRouter();

  const getUserPubkey = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_pubkey');
    }
    return null;
  };

  const fetchChannels = useCallback(async (): Promise<void> => {
    if (authLoading) return; // Attendre que l'auth soit chargée
    
    if (!user || !session) {
      setError('Vous devez être connecté pour voir vos canaux');
      setLoading(false);
      return;
    }

    const pubkey = getUserPubkey();
    if (!pubkey) {
      setError('Aucun nœud connecté');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const statusFilter = filter !== 'all' ? `?status=${filter}` : '';
      
      const response = await fetch(`/api/network/node/${pubkey}/channels${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des canaux');
      }

      const result: ApiResponse<Channel[]> = await response.json();
      
      if (result.success && result.data) {
        setChannels(result.data);
      } else {
        throw new Error(result.error?.message || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des canaux:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filter, user, session, authLoading]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleCloseChannel = async (channelId: string, force = false): Promise<void> => {
    if (!session) return;

    const pubkey = getUserPubkey();
    if (!pubkey) return;

    try {
      const response = await fetch(`/api/network/node/${pubkey}/channels/${channelId}?force=${force}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchChannels(); // Recharger la liste
      }
    } catch (err) {
      console.error('Erreur lors de la fermeture du canal:', err);
    }
  };

  const getStatusBadge = (status: Channel['status']): JSX.Element => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      closing: 'bg-red-100 text-red-800'
    };

    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      closing: 'Fermeture'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // États de chargement
  if (authLoading || loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos canaux...</p>
          </div>
        </div>
      </div>
    );
  }

  // Vérification de l'authentification
  if (!user) {
    return (
      <div className="space-y-8">
        <div className="text-center p-8">
          <p className="text-red-600">Vous devez être connecté pour accéder à cette page.</p>
          <a href="/auth/login" className="text-indigo-600 hover:underline mt-2 inline-block">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des canaux</h1>
          <div className="text-sm text-gray-500">
            Connecté en tant que {user.email}
          </div>
        </div>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-2">❌ Erreur</h3>
          <p>{error}</p>
          {error.includes('Aucun nœud') && (
            <button
              onClick={() => router.push('/user/node')}
              className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Connecter un nœud
            </button>
          )}
          {!error.includes('Aucun nœud') && (
            <button 
              onClick={fetchChannels}
              className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des canaux</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Connecté en tant que {user.email}
          </div>
          <button
            onClick={() => setShowNewChannelModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            ⚡ Ouvrir un canal
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total des canaux</div>
          <div className="text-2xl font-bold">{channels.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Canaux actifs</div>
          <div className="text-2xl font-bold text-green-600">
            {channels.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Capacité totale</div>
          <div className="text-2xl font-bold">
            {(channels.reduce((sum, c) => sum + c.capacity, 0) / 100000000).toFixed(2)} BTC
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Balance locale</div>
          <div className="text-2xl font-bold text-blue-600">
            {(channels.reduce((sum, c) => sum + c.localBalance, 0) / 100000000).toFixed(2)} BTC
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'inactive', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : 
               status === 'inactive' ? 'Inactifs' : 'En attente'}
            </button>
          ))}
        </div>

        {/* Liste des canaux */}
        {channels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun canal</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore de canaux Lightning.'
                : `Aucun canal ${filter === 'active' ? 'actif' : filter === 'inactive' ? 'inactif' : 'en attente'}.`
              }
            </p>
            <button
              onClick={() => setShowNewChannelModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              Ouvrir votre premier canal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {channel.remoteAlias || `${channel.remotePubkey.substring(0, 20)}...`}
                      </h3>
                      {getStatusBadge(channel.status)}
                      {channel.isPrivate && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          Privé
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm font-mono mb-2">
                      {channel.remotePubkey}
                    </p>
                    <div className="text-xs text-gray-500 space-x-4">
                      <span>Capacité: {(channel.capacity / 100000000).toFixed(2)} BTC</span>
                      <span>Local: {(channel.localBalance / 100000000).toFixed(2)} BTC</span>
                      <span>Remote: {(channel.remoteBalance / 100000000).toFixed(2)} BTC</span>
                      <span>Uptime: {channel.uptime}%</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-bold">
                      {((channel.localBalance / channel.capacity) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Balance locale</div>
                    <button
                      onClick={() => handleCloseChannel(channel.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
                
                {/* Barre de balance */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(channel.localBalance / channel.capacity) * 100}%` }}
                  ></div>
                </div>
                
                {/* Détails techniques */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">Fee Rate</div>
                      <div>{channel.feeRate / 1000000} ppm</div>
                    </div>
                    <div>
                      <div className="font-medium">Base Fee</div>
                      <div>{channel.baseFee} sats</div>
                    </div>
                    <div>
                      <div className="font-medium">Min HTLC</div>
                      <div>{channel.minHtlc} sats</div>
                    </div>
                    <div>
                      <div className="font-medium">Timelock</div>
                      <div>{channel.timelock} blocks</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nouveau canal - Implémentation basique */}
      {showNewChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Ouvrir un nouveau canal</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Utilisez votre interface de nœud habituelle pour le moment.
            </p>
            <button
              onClick={() => setShowNewChannelModal(false)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeChannelsPage;