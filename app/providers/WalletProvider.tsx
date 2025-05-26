'use client'

import { ReactNode, createContext, useContext, useState, useCallback } from 'react'

interface SimpleWalletState {
  isConnected: boolean
  address: string | null
  connect: (walletType: string) => Promise<void>
  disconnect: () => Promise<void>
  isConnecting: boolean
}

const WalletContext = createContext<SimpleWalletState | null>(null)

export function CustomWalletProvider({ children }: { children: ReactNode }): ReactNode {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async (walletType: string) => {
    console.log('Tentative de connexion wallet:', walletType)
    setIsConnecting(true)
    
    try {
      if (walletType === 'pera') {
        // Pour Pera Wallet
        if (typeof window !== 'undefined') {
          // Vérifier si Pera Wallet est installé
          const { PeraWalletConnect } = await import('@perawallet/connect')
          const peraWallet = new PeraWalletConnect()
          
          const accounts = await peraWallet.connect()
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            console.log('Connexion Pera réussie:', accounts[0])
          }
        }
      } else {
        // Pour les autres wallets, simulation temporaire
        setTimeout(() => {
          setAddress('ALGO' + Math.random().toString(36).substring(2, 15).toUpperCase())
          setIsConnected(true)
          console.log('Connexion simulée pour:', walletType)
        }, 1500)
      }
    } catch (error) {
      console.error('Erreur connexion wallet:', error)
      alert('Erreur lors de la connexion. Assurez-vous que votre wallet est installé.')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    console.log('Déconnexion wallet')
    setIsConnected(false)
    setAddress(null)
    setIsConnecting(false)
  }, [])

  const walletState: SimpleWalletState = {
    isConnected,
    address,
    connect,
    disconnect,
    isConnecting
  }

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): SimpleWalletState {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within CustomWalletProvider')
  }
  return context
} 