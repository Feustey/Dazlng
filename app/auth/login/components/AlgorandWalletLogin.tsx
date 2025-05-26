'use client'

import { WalletConnect } from '@/app/components/shared/ui/WalletConnect'

export default function AlgorandWalletLogin(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connexion Algorand Wallet
        </h2>
        <p className="text-gray-600 mb-6">
          Connectez-vous avec votre wallet Algorand (Pera, Defly, Exodus...)
        </p>
      </div>

      <WalletConnect />

      <div className="border-t border-gray-200 pt-4">
        <div className="text-center text-xs text-gray-500">
          <p>Wallet compatible : Pera Wallet, Defly Wallet, Exodus Wallet</p>
          <p className="mt-1">Sécurisé par la blockchain Algorand</p>
        </div>
      </div>
    </div>
  )
} 