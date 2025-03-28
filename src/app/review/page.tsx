'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { IPeerOfPeer } from "@/models/PeerOfPeer";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const nodePubkey = searchParams.get('pubkey') || '';
  const [peersOfPeers, setPeersOfPeers] = useState<IPeerOfPeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchPeersOfPeers = async () => {
    if (!nodePubkey) {
      setError('La pubkey du nœud est requise');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/nodes/peers-of-peers?pubkey=${nodePubkey}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des pairs des pairs');
      }
      const data = await response.json();
      setPeersOfPeers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updatePeersOfPeers = async () => {
    if (!nodePubkey) {
      setError('La pubkey du nœud est requise');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch('/api/nodes/peers-of-peers/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pubkey: nodePubkey }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des pairs des pairs');
      }

      await fetchPeersOfPeers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchPeersOfPeers();
  }, [nodePubkey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Revue de votre nœud
      </h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="peers">Pairs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Vue d'ensemble</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
        <TabsContent value="channels">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Canaux</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
        <TabsContent value="peers">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Pairs des pairs</h2>
              <Button
                onClick={updatePeersOfPeers}
                disabled={updating || !nodePubkey}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {updating ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
            {!nodePubkey ? (
              <div className="text-yellow-500 dark:text-yellow-400 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                Veuillez fournir une pubkey de nœud dans l'URL (ex: /review?pubkey=YOUR_PUBKEY)
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {peersOfPeers.map((peer) => (
                  <div
                    key={peer.peerPubkey}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {peer.alias}
                      </h3>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: peer.color }}
                      ></div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>Plateforme: {peer.platform}</p>
                      <p>Version: {peer.version}</p>
                      <p>Capacité totale: {peer.total_capacity.toLocaleString()} sats</p>
                      <p>Canaux actifs: {peer.active_channels}</p>
                      <p>Frais moyens: {peer.avg_fee_rate_ppm} ppm</p>
                      <p>Uptime: {peer.uptime}%</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pubkey: {peer.peerPubkey.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="performance">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Performance</h2>
            {/* Contenu à venir */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 