'use client'

import { useWallet } from '@/app/providers/WalletProvider'

export function WalletConnect(): JSX.Element {
  const wallet = useWallet()
  
  const walletOptions = [
    { id: 'pera', name: 'Pera Wallet', icon: '📱', description: 'Application mobile officielle' },
    { id: 'defly', name: 'Defly Wallet', icon: '🦋', description: 'Wallet DeFi avancé' },
    { id: 'exodus', name: 'Exodus Wallet', icon: '🚀', description: 'Multi-crypto wallet' }
  ]

  const handleConnect = async (walletId: string): Promise<void> => {
    try {
      await wallet.connect(walletId)
    } catch (error) {
      console.error('Erreur de connexion wallet:', error)
    }
  }

  const handleDisconnect = async (): Promise<void> => {
    try {
      await wallet.disconnect()
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    }
  }

  return (
    <div className="space-y-6">
      {!wallet.isConnected ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez votre wallet Algorand
          </h3>
          <div className="grid gap-3">
            {walletOptions.map((walletOption) => (
              <button
                key={walletOption.id}
                onClick={() => handleConnect(walletOption.id)}
                disabled={wallet.isConnecting}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl">{walletOption.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{walletOption.name}</div>
                  <div className="text-sm text-gray-500">Connecter avec {walletOption.name}</div>
                </div>
                {wallet.isConnecting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Wallet connecté
              </h3>
              <p className="text-sm text-green-700">
                Adresse: {wallet.address?.slice(0, 8)}...
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Déconnecter
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center text-xs text-gray-500">
        <p>Wallets compatibles : Pera, Defly, Exodus</p>
        <p className="mt-1">Assurez-vous d'avoir votre wallet installé</p>
      </div>
    </div>
  )
} 