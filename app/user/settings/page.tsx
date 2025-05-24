"use client";

import React, { FC, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SettingsPage: FC = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    pubkey: '',
    compte_x: '',
    compte_nostr: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchUser(): Promise<void> {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          pubkey: data.pubkey || '',
          compte_x: data.compte_x || '',
          compte_nostr: data.compte_nostr || '',
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) setMessage('Modifications enregistrées !');
    else setMessage('Erreur lors de la sauvegarde');
  };

  if (loading) return <div>Chargement…</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
      <form className="bg-white rounded-xl shadow p-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Nom</label>
            <input type="text" name="nom" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.nom} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Prénom</label>
            <input type="text" name="prenom" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.prenom} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input type="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Pubkey Lightning</label>
            <input type="text" name="pubkey" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.pubkey} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Compte X (Twitter)</label>
            <input type="text" name="compte_x" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.compte_x} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Compte Nostr</label>
            <input type="text" name="compte_nostr" className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900" value={form.compte_nostr} onChange={handleChange} />
          </div>
        </div>
        {message && <div className="text-green-600 mt-4">{message}</div>}
        <button type="submit" className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">Enregistrer</button>
      </form>
    </div>
  );
};

export default SettingsPage;
