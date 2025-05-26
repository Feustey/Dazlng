'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NWCLogin(): React.ReactElement {
  const [connectionString, setConnectionString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleNWCConnection = async (): Promise<void> => {
    if (!connectionString.trim()) {
      setError('Veuillez saisir votre URL de connexion NWC');
      return;
    }
    if (!connectionString.startsWith('nostr+walletconnect://')) {
      setError('Format NWC invalide. L\'URL doit commencer par "nostr+walletconnect://"');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/wallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletType: 'nwc',
          connectionString: connectionString.trim()
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de connexion NWC');
      }
      const { token } = await response.json();
      localStorage.setItem('jwt', token);
      router.push('/user/dashboard');
    } catch (err) {
      console.error('Erreur de connexion NWC:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (): Promise<void> => {
    if (!connectionString.trim()) {
      setError('Veuillez saisir votre URL de connexion NWC');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/wallet/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletType: 'nwc',
          connectionString: connectionString.trim()
        }),
      });
      if (response.ok) {
        setError(null);
        alert('✅ Connexion NWC testée avec succès !');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de test de connexion');
      }
    } catch (err) {
      console.error('Erreur de test NWC:', err);
      setError(err instanceof Error ? err.message : 'Erreur de test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connexion Wallet Lightning
        </h2>
        <p className="text-gray-600 mb-6">
          Connectez-vous via Nostr Wallet Connect (NWC)
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="nwcUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL de connexion NWC :
          </label>
          <textarea
            id="nwcUrl"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
            placeholder="nostr+walletconnect://bb1f1651165d82007a0c6404930cd7fe01b4b3fe3b2b3fa38c1fe880d3c766dd?relay=wss://relay.getalby.com/v1&secret=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
            rows={4}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Obtenez cette URL depuis votre wallet compatible NWC (Alby Hub, Zeus, etc.)
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="flex space-x-3">
          <button
            onClick={handleTestConnection}
            disabled={isLoading || !connectionString.trim()}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Test...' : 'Tester'}
          </button>
          <button
            onClick={handleNWCConnection}
            disabled={isLoading || !connectionString.trim()}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div className="text-sm text-blue-800">
            <h4 className="font-medium mb-1">Comment obtenir votre URL NWC ?</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Alby Hub :</strong> Allez dans "Connections" → "Connect a new app" → Copiez l'URL</li>
              <li><strong>Zeus :</strong> Settings → Lightning → Nostr Wallet Connect → Share</li>
              <li><strong>Autres wallets :</strong> Cherchez "NWC" ou "Nostr Wallet Connect" dans les paramètres</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="text-center text-xs text-gray-500">
          <p>Wallets compatibles : Alby Hub, Zeus, BlueWallet, Phoenix, Breez</p>
          <p className="mt-1">Sécurisé par le protocole Nostr Wallet Connect (NIP-47)</p>
        </div>
      </div>
    </div>
  );
} 