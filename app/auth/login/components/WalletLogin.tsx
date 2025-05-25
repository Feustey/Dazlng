'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletLogin(): React.ReactElement {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState('');
  const router = useRouter();

  const walletOptions = [
    {
      id: 'lnd',
      name: 'LND Node',
      icon: '🔗',
      description: 'Connectez votre node LND directement',
      placeholder: 'lnd://admin:macaroon@host:port'
    },
    {
      id: 'clightning',
      name: 'Core Lightning',
      icon: '⚡',
      description: 'Connectez votre node Core Lightning',
      placeholder: 'c-lightning://rune@host:port'
    },
    {
      id: 'nwc',
      name: 'Nostr Wallet Connect',
      icon: '🔑',
      description: 'Utilisez NWC pour vous connecter',
      placeholder: 'nostr+walletconnect://...'
    },
    {
      id: 'lnurl',
      name: 'LNURL-Auth',
      icon: '🔐',
      description: 'Authentification via LNURL',
      placeholder: 'LNURL de votre wallet'
    }
  ];

  const handleWalletConnection = async (): Promise<void> => {
    if (!selectedWallet || !connectionString.trim()) {
      setError('Veuillez sélectionner un wallet et saisir la chaîne de connexion');
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
          walletType: selectedWallet,
          connectionString: connectionString.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion au wallet');
      }

      const { token } = await response.json();
      localStorage.setItem('jwt', token);
      router.push('/user/dashboard');

    } catch (err) {
      console.error('Erreur de connexion wallet:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (): Promise<void> => {
    if (!selectedWallet || !connectionString.trim()) {
      setError('Veuillez sélectionner un wallet et saisir la chaîne de connexion');
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
          walletType: selectedWallet,
          connectionString: connectionString.trim()
        }),
      });

      if (response.ok) {
        setError(null);
        alert('✅ Connexion testée avec succès !');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de test de connexion');
      }
    } catch (err) {
      console.error('Erreur de test:', err);
      setError(err instanceof Error ? err.message : 'Erreur de test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👛</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connexion Wallet/Node
        </h2>
        <p className="text-gray-600 mb-6">
          Connectez-vous directement via votre node Lightning ou wallet
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choisissez votre type de wallet :
        </label>
        
        <div className="grid grid-cols-1 gap-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              onClick={() => setSelectedWallet(wallet.id)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                selectedWallet === wallet.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{wallet.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{wallet.name}</h3>
                  <p className="text-xs text-gray-500">{wallet.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedWallet && (
        <div className="space-y-4">
          <div>
            <label htmlFor="connectionString" className="block text-sm font-medium text-gray-700 mb-2">
              Chaîne de connexion :
            </label>
            <textarea
              id="connectionString"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder={walletOptions.find(w => w.id === selectedWallet)?.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Saisissez les informations de connexion sécurisées de votre {walletOptions.find(w => w.id === selectedWallet)?.name}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isLoading || !connectionString.trim()}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Test...' : 'Tester la connexion'}
            </button>
            
            <button
              type="button"
              onClick={handleWalletConnection}
              disabled={isLoading || !connectionString.trim()}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 mr-1 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <strong>Sécurité</strong>
        </div>
        <p>Vos informations de connexion sont chiffrées et sécurisées.</p>
        <p>Nous ne stockons jamais vos clés privées ou macaroons en plain text.</p>
      </div>
    </div>
  );
} 