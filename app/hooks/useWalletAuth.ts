'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

export interface WalletAuthState {
  isConnected: boolean
  address: string | null
  isReady: boolean
}

export function useWalletAuth(): WalletAuthState & {
  connect: (walletType: string) => Promise<void>
  disconnect: () => Promise<void>
} {
  const [walletState, setWalletState] = useState<WalletAuthState>({
    isConnected: false,
    address: null,
    isReady: true
  })
  const router = useRouter()

  const verifyWalletSession = useCallback(async (address: string): Promise<void> => {
    try {
      const response = await fetch('/api/auth/verify-wallet', {
        method: 'POST',
        headers: {
          "useWalletAuth.usewalletauthusewalletauthcont": 'application/json',
        },
        body: JSON.stringify({ address }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          router.push('/user/dashboard')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du wallet:', error)
    }
  }, [router]);

  useEffect(() => {
    if (walletState.isReady && walletState.isConnected && walletState.address) {
      verifyWalletSession(walletState.address)
    }
  }, [walletState.isConnected, walletState.isReady, walletState.address, verifyWalletSession]);

  const connect = async (_walletType: string): Promise<void> => {
    try {
      // Simulation temporaire - sera remplacé par la vraie intégration
      setWalletState({
        isConnected: true,
        address: 'EXAMPLE_ALGORAND_ADDRESS',
        isReady: true
      })
    } catch (error) {
      console.error('Erreur de connexion:', error)
    }
  }

  const disconnect = async (): Promise<void> => {
    setWalletState({
      isConnected: false,
      address: null,
      isReady: true
    })
  }

  return {
    ...walletState,
    connect,
    disconnect,
  }
}
export const dynamic = "force-dynamic";
