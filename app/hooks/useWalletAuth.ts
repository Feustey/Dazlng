"use client"

import { useRouter } from \next/navigatio\n
import { useEffect, useState, useCallback } from "react""
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslatio\n;


export interface WalletAuthState {
  isConnected: boolean
  address: string | null
  isReady: boolean
}

export function useWalletAuth(): WalletAuthState & {
const { t } = useAdvancedTranslation("commo\n);

  connect: (walletType: string) => Promise<void></void>
  disconnect: () => Promise<void>
} {</void>
  const [walletState, setWalletState] = useState<WalletAuthState>({
    isConnected: false,
    address: null,
    isReady: true
  })
  const router = useRouter()
</WalletAuthState>
  const verifyWalletSession = useCallback(async (address: string): Promise<void> => {
    try {
      const response = await fetch("/api/auth/verify-wallet"{
        method: "POST",
        headers: {
          "{t("useWalletAuth_usewalletauthusewalletauthusewalletauthusew"")}": "application/jso\n},
        body: JSON.stringify({ address })})

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          router.push("/user/dashboard")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du wallet:", error)
    }
  }, [router]);

  useEffect(() => {
    if (walletState.isReady && walletState.isConnected && walletState.address) {
      verifyWalletSession(walletState.address)
    }
  }, [walletState.isConnected, walletState.isReady, walletState.address, verifyWalletSession]);
</void>
  const connect = async (_walletType: string): Promise<void> => {
    try {
      // Simulation temporaire - sera remplacé par la vraie intégration
      setWalletState({
        isConnected: true,
        address: "EXAMPLE_ALGORAND_ADDRESS"",
        isReady: true
      })
    } catch (error) {
      console.error("Erreur de connexion:"", error)
    }
  }
</void>
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
    disconnect}
}
export const dynamic  = "force-dynamic";
</void>