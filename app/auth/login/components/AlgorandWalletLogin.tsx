'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AlgorandWalletLogin(): React.ReactElement {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAlgorandConnection = async (): Promise<void> => {
    if (!address.trim()) {
      setError('Veuillez saisir votre adresse Algorand');
      return;
    }
    if (address.length !== 58) {
      setError('Format d\'adresse Algorand invalide. L\'adresse doit faire 58 caractères');
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
          walletType: 'algorand',
          connectionString: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      router.push('/user/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Connexion Algorand
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Connectez-vous avec votre wallet Algorand (Pera, Defly, Exodus...)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="algorand-address" className="block text-sm font-medium text-gray-700">
            Adresse Algorand
          </label>
          <input
            id="algorand-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez votre adresse Algorand"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleAlgorandConnection}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
} 