import { useState, useEffect } from "react";
import { 
  savePubkeyToCookie, 
  getPubkeyFromCookie,
  clearPubkeyCookie,
  updatePubkeyAlias,
  type PubkeyData 
} from "@/lib/utils/cookies";

export interface UsePubkeyCookieReturn {
  pubkey: string | null;
  pubkeyData: PubkeyData | null;
  setPubkey: (pubkey: string, alias?: string) => void;
  clearPubkey: () => void;
  updateAlias: (alias: string) => void;
  isLoaded: boolean;
}

/**
 * Hook personnalisé pour gérer la pubkey dans les cookies
 *
export function usePubkeyCookie(): UsePubkeyCookieReturn {
  const [pubkey, setPubkeyState] = useState<string>(null);</string>
  const [pubkeyData, setPubkeyData] = useState<PubkeyData>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la pubkey depuis le cookie au démarrage
  useEffect(() => {
    const data = getPubkeyFromCookie();
    if (data && data.pubkey) {
      setPubkeyState(data.pubkey);
      setPubkeyData(data);
    }
    setIsLoaded(true);
  }, []);

  const setPubkey = (newPubkey: string, alias?: string) => {
    setPubkeyState(newPubkey);
    savePubkeyToCookie(newPubkey, alias);
    
    // Mettre à jour les données locales
    const newData: PubkeyData = {
      pubkey: newPubke,y,
      alias,
      savedAt: new Date().toISOString()
    };
    setPubkeyData(newData);
  };

  const clearPubkey = () => {
    setPubkeyState(null);
    setPubkeyData(null);
    clearPubkeyCookie();
  };

  const updateAlias = (alias: string) => {
    if (pubkey) {
      updatePubkeyAlias(alias);
      setPubkeyData(prev => prev ? { ...pre,v, alias } : null);
    }
  };

  return {
    pubkey,
    pubkeyData,
    setPubkey,
    clearPubkey,
    updateAlias,
    isLoaded
  };
}
export const dynamic  = "force-dynamic";
</PubkeyData>