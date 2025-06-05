"use client";

import React, { FC, useEffect, useState } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';

const SettingsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
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

  useEffect(() => {
    async function fetchUserProfile(): Promise<void> {
      if (authLoading) return; // Attendre que l'auth soit chargée
      
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const userData = data.user;
          setForm({
            nom: userData.nom || '',
            prenom: userData.prenom || '',
            email: userData.email || '',
            pubkey: userData.pubkey || '',
            compte_x: userData.compte_x || '',
            compte_nostr: userData.compte_nostr || '',
          });
        } else {
          console.error('Erreur lors du chargement du profil:', res.status);
          setMessage('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setMessage('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user, session, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    
    if (!session) {
      setMessage('Session expirée, veuillez vous reconnecter');
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        setMessage('✅ Modifications enregistrées !');
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await res.json();
        setMessage(`❌ Erreur: ${errorData.error?.message || 'Erreur lors de la sauvegarde'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('❌ Erreur de connexion');
    }
  };

  // États de chargement
  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos paramètres...</p>
          </div>
        </div>
      </div>
    );
  }

  // Vérification de l'authentification
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center p-8">
          <p className="text-red-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <div className="text-sm text-gray-500">
          Connecté en tant que {user.email}
        </div>
      </div>
      
      <form className="bg-white rounded-xl shadow p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input 
              type="text" 
              name="nom" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
              value={form.nom} 
              onChange={handleChange}
              placeholder="Votre nom de famille" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
            <input 
              type="text" 
              name="prenom" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
              value={form.prenom} 
              onChange={handleChange}
              placeholder="Votre prénom" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
              value={form.email} 
              onChange={handleChange}
              disabled
              title="L'email ne peut pas être modifié"
            />
            <p className="text-xs text-gray-500 mt-1">L'adresse email ne peut pas être modifiée</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Clé publique Lightning</label>
            <input 
              type="text" 
              name="pubkey" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm" 
              value={form.pubkey} 
              onChange={handleChange}
              placeholder="02a1b2c3d4e5f6..."
            />
            <p className="text-xs text-gray-500 mt-1">Votre clé publique Bitcoin/Lightning pour l'authentification avancée</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compte X (Twitter)</label>
            <input 
              type="text" 
              name="compte_x" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
              value={form.compte_x} 
              onChange={handleChange}
              placeholder="@votre_handle" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clé publique Nostr</label>
            <input 
              type="text" 
              name="compte_nostr" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm" 
              value={form.compte_nostr} 
              onChange={handleChange}
              placeholder="npub1..." 
            />
          </div>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}
        
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-semibold"
        >
          💾 Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
