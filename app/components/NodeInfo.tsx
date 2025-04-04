"use client";

import * as React from "react";

import { useEffect, useState } from "react";

import { useSettings } from "@/app/contexts/SettingsContext";
import { NodeInfo as NodeInfoType } from "@/app/lib/types";
import { fetchNodeInfo, saveNodeHistory } from "@/app/lib/services/nodeService";
import { formatBitcoin } from "@/app/lib/utils";
import { Card } from "@/app/components/ui/card";

interface NodeInfoProps {
  pubkey: string;
}

export function NodeInfoDisplay({ pubkey }: NodeInfoProps) {
  const [nodeInfo, setNodeInfo] = useState<NodeInfoType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNodeInfo(pubkey);
        setNodeInfo(data);
        saveNodeHistory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      }
    };

    fetchData();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pubkey]);

  if (error) {
    return (
      <Card className="p-6 bg-destructive/10 text-destructive">
        <p>{error}</p>
      </Card>
    );
  }

  if (!nodeInfo) {
    return (
      <Card className="p-6">
        <p>Chargement des informations du nœud...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Informations du Nœud</h3>
          <div className="text-sm text-muted-foreground">
            Dernière mise à jour:{" "}
            {new Date(nodeInfo.last_update * 1000).toLocaleString()}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Alias</p>
            <p className="font-medium">{nodeInfo.alias}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clé Publique</p>
            <p className="font-medium truncate">{nodeInfo.pub_key}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Capacité Totale</p>
            <p className="font-medium">
              {formatBitcoin(nodeInfo.capacity, currency === "btc")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nombre de Canaux</p>
            <p className="font-medium">{nodeInfo.channelcount}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-semibold mb-3">Classement du Nœud</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Capacité</p>
              <p className="font-medium">#{nodeInfo.noderank.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nombre de Canaux</p>
              <p className="font-medium">#{nodeInfo.noderank.channelcount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Âge</p>
              <p className="font-medium">#{nodeInfo.noderank.age}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
