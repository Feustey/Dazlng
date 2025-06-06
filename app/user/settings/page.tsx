"use client";

import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/SupabaseProvider';

const SettingsPage: FC = () => {
  const { user, session, loading: authLoading } = useSupabase();
  const router = useRouter();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    pubkey: '',
    compte_x: '',
    compte_nostr: '',
    phone: '',
    phone_verified: false,
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
            phone: userData.phone || '',
            phone_verified: userData.phone_verified || false,
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

      {/* CTA DazBox pour les utilisateurs sans nœud */}
      {!form.pubkey && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🚀 Vous n'avez pas encore votre propre nœud Lightning ?
              </h3>
              <p className="text-gray-600 mb-4">
                Découvrez la <strong>DazBox</strong> - un nœud Lightning Network prêt à l'emploi, 
                livré configuré et optimisé par nos experts. Installation en 5 minutes, maintenance zéro !
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/checkout/dazbox')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-md"
                >
                  📦 Commander ma DazBox
                </button>
                <button
                  onClick={() => router.push('/dazbox')}
                  className="border border-orange-300 text-orange-700 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  📖 En savoir plus
                </button>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Livraison gratuite • Support 24/7 • Garantie 2 ans
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
