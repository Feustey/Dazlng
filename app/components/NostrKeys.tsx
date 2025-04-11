"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@components/ui/button";
import { getAlbyService } from "@/services/albyService";
import { toast } from "sonner";

interface NostrKeysProps {
  onKeysLoaded?: (keys: any) => void;
}

export default function NostrKeys({ onKeysLoaded }: NostrKeysProps) {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<{ pubkey: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
    try {
      const albyService = await getAlbyService();
      const nostrKeys = await albyService.getNostrKeys();
      if (nostrKeys.pubkey) {
        setKeys({ pubkey: nostrKeys.pubkey });
        onKeysLoaded?.(nostrKeys);
        toast.success("Clés Nostr chargées avec succès");
      } else {
        setError("Clé publique non trouvée");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des clés Nostr");
    } finally {
      setLoading(false);
    }
  }, [onKeysLoaded]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  return (
    <div className="space-y-4">
      <Button onClick={loadKeys} disabled={loading} className="w-full">
        {loading ? "Chargement..." : "Actualiser les clés Nostr"}
      </Button>

      {keys && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Clés Nostr</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-mono text-sm break-all">
              Clé publique: {keys.pubkey}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
