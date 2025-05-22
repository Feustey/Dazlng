'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  pubkey: string;
  compte_x: string;
  compte_nostr: string;
  t4g_tokens: number;
  node_id?: string;
}

// Définition du type pour les stats du nœud Lightning
interface NodeStatsData {
  // À adapter selon la structure réelle des stats retournées par l'API
  [key: string]: unknown;
}

// Composant pour afficher les stats du nœud Lightning
function NodeStats({ nodeId }: { nodeId: string }): JSX.Element {
  const [stats, setStats] = useState<NodeStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchStats(): Promise<void> {
      const res = await fetch(`/api/daznode/stats?node_id=${nodeId}`);
      if (res.ok) {
        setStats(await res.json());
      }
      setLoading(false);
    }
    fetchStats();
  }, [nodeId]);
  if (loading) return <div>Chargement des statistiques du nœud...</div>;
  if (!stats) return <div>Aucune statistique disponible pour ce nœud.</div>;
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Statistiques du nœud Lightning</h2>
      <pre className="text-xs overflow-x-auto bg-gray-100 p-2 rounded">{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}

interface Facture {
  id: string;
  date: string;
  montant: number;
  statut: string;
  url: string;
}

const AccountPage: React.FC = () => {
  const [tab, setTab] = useState<'infos' | 'tokens' | 'daznode' | 'factures'>('infos');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [form, setForm] = useState<Omit<UserData, 'id' | 'email' | 't4g_tokens'>>({
    nom: '',
    prenom: '',
    pubkey: '',
    compte_x: '',
    compte_nostr: '',
    node_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [factures, setFactures] = useState<Facture[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchUserData(): Promise<void> {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        router.replace('/auth/login');
        return;
      }
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          pubkey: data.pubkey || '',
          compte_x: data.compte_x || '',
          compte_nostr: data.compte_nostr || '',
          node_id: data.node_id || '',
        });
        // Simule un fetch de factures (à remplacer par un vrai appel API)
        setFactures([
          { id: 'FAC-2024-001', date: '2024-04-01', montant: 149.99, statut: 'Payée', url: '#' },
          { id: 'FAC-2024-002', date: '2024-05-01', montant: 149.99, statut: 'En attente', url: '#' },
        ]);
      } else {
        router.replace('/auth/login');
      }
      setLoading(false);
    }
    fetchUserData();
  }, [router, supabase]);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  const handleUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Informations mises à jour avec succès.');
      setUserData((prev) => prev ? { ...prev, ...form } : prev);
    } else {
      setMessage('Erreur lors de la mise à jour.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      <div className="flex mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded-t-md font-bold ${tab === 'infos' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('infos')}
        >
          Mes informations
        </button>
        <button
          className={`px-4 py-2 rounded-t-md font-bold ${tab === 'tokens' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('tokens')}
        >
          Mes T4G tokens
        </button>
        {userData?.node_id && (
          <button
            className={`px-4 py-2 rounded-t-md font-bold ${tab === 'daznode' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('daznode')}
          >
            Abonnement DazNode
          </button>
        )}
        <button
          className={`px-4 py-2 rounded-t-md font-bold ${tab === 'factures' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('factures')}
        >
          Factures
        </button>
      </div>

      {tab === 'infos' && (
        <form className="bg-white rounded-lg shadow-md p-6 mb-8" onSubmit={handleUpdate}>
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Nom</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Prénom</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Pubkey</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.pubkey}
                onChange={e => setForm({ ...form, pubkey: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Compte X (Twitter)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.compte_x}
                onChange={e => setForm({ ...form, compte_x: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Compte Nostr</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.compte_nostr}
                onChange={e => setForm({ ...form, compte_nostr: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Node ID Lightning</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                value={form.node_id}
                onChange={e => setForm({ ...form, node_id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
                value={userData.email}
                disabled
              />
            </div>
          </div>
          {message && <div className="text-green-600 mt-4">{message}</div>}
          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Mettre à jour'}
          </button>
        </form>
      )}

      {tab === 'tokens' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mes T4G tokens</h2>
          <p className="text-2xl font-bold mb-2">{userData.t4g_tokens ?? 1}</p>
          <p className="text-gray-600">Vous avez gagné 1 T4G token pour votre inscription.</p>
        </div>
      )}

      {tab === 'daznode' && userData?.node_id && (
        <NodeStats nodeId={userData.node_id} />
      )}

      {tab === 'factures' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Factures</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {factures.map((facture) => (
                <tr key={facture.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{facture.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{facture.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{facture.montant} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${facture.statut === 'Payée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href={facture.url} className="text-indigo-600 hover:text-indigo-900" download>Télécharger</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default AccountPage; 