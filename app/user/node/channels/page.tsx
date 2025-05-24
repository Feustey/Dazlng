"use client";

import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };

  const fetchChannels = useCallback(async (): Promise<void> => {
    const pubkey = getUserPubkey();
    if (!pubkey) {
      setError('Aucun nœud connecté');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      const statusFilter = filter !== 'all' ? `?status=${filter}` : '';
      
      const response = await fetch(`/api/network/node/${pubkey}/channels${statusFilter}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
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
  }, [filter]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleCloseChannel = async (channelId: string, force = false): Promise<void> => {
    const pubkey = getUserPubkey();
    if (!pubkey) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/network/node/${pubkey}/channels/${channelId}?force=${force}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
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

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Gestion des canaux</h1>
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Gestion des canaux</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <h3 className="font-semibold">Erreur</h3>
          <p>{error}</p>
          {error.includes('Aucun nœud') && (
            <button
              onClick={() => router.push('/user/node')}
              className="mt-2 text-sm underline"
            >
              Connecter un nœud
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des canaux</h1>
        <button
          onClick={() => setShowNewChannelModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Ouvrir un canal
        </button>
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
            {channels.reduce((sum, c) => sum + c.capacity, 0).toLocaleString()} sats
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Balance locale</div>
          <div className="text-2xl font-bold">
            {channels.reduce((sum, c) => sum + c.localBalance, 0).toLocaleString()} sats
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex gap-2 mb-4">
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nœud distant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance locale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {channel.remoteAlias || 'Nœud anonyme'}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {channel.remotePubkey.substring(0, 16)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {channel.capacity.toLocaleString()} sats
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {channel.localBalance.toLocaleString()} sats
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(channel.localBalance / channel.capacity) * 100}%`
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(channel.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {channel.baseFee} msat + {channel.feeRate} ppm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/user/node/channels/${channel.id}`)}
                      className="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      Détails
                    </button>
                    {channel.status === 'active' && (
                      <button
                        onClick={() => handleCloseChannel(channel.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Fermer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {channels.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">Aucun canal trouvé</div>
            <button
              onClick={() => setShowNewChannelModal(true)}
              className="mt-2 text-purple-600 hover:text-purple-900"
            >
              Ouvrir votre premier canal
            </button>
          </div>
        )}
      </div>

      {/* Modal pour nouveau canal (placeholder) */}
      {showNewChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Ouvrir un nouveau canal</h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en développement. Utilisez votre interface Lightning habituelle pour l'instant.
            </p>
            <button
              onClick={() => setShowNewChannelModal(false)}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
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