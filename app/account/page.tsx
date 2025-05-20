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
}

const AccountPage: React.FC = () => {
  const [tab, setTab] = useState<'infos' | 'tokens'>('infos');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [form, setForm] = useState<Omit<UserData, 'id' | 'email' | 't4g_tokens'>>({
    nom: '',
    prenom: '',
    pubkey: '',
    compte_x: '',
    compte_nostr: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
        });
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
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 rounded-t-md font-bold ${tab === 'infos' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('infos')}
        >
          Mes informations
        </button>
        <button
          className={`px-4 py-2 rounded-t-md font-bold ml-2 ${tab === 'tokens' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('tokens')}
        >
          Mes T4G tokens
        </button>
      </div>

      {tab === 'infos' ? (
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
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mes T4G tokens</h2>
          <p className="text-2xl font-bold mb-2">{userData.t4g_tokens ?? 1}</p>
          <p className="text-gray-600">Vous avez gagné 1 T4G token pour votre inscription.</p>
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