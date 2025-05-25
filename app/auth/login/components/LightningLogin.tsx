'use client';

import { useLightningAuth } from '@/hooks/useLightningAuth';

export default function LightningLogin(): React.ReactElement {
  const { isAuthenticated, publicKey, error, isLoading, authenticateWithLightning, logout } = useLightningAuth();

  if (isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                ⚡ Connecté avec Lightning
              </h3>
              <p className="text-sm text-green-600 mt-1 break-all">
                Clé publique: {publicKey?.slice(0, 20)}...
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connexion Lightning
        </h2>
        <p className="text-gray-600 mb-6">
          Connectez-vous instantanément avec votre portefeuille Lightning
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={authenticateWithLightning}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Connexion en cours...
            </>
          ) : (
            <>
              ⚡ Se connecter avec Lightning
            </>
          )}
        </button>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Extensions supportées: Alby, Joule, LndHub</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <div className="flex items-center mb-1">
          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <strong>Authentification Lightning</strong>
        </div>
        <p>Votre wallet Lightning doit supporter la signature de messages.</p>
        <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
          <li>Assurez-vous qu'Alby ou votre wallet est déverrouillé</li>
          <li>Configurez une Master Key dans Alby si nécessaire</li>
          <li>Autorisez la signature du message de connexion</li>
        </ul>
      </div>
    </div>
  );
} 