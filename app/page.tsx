"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { formatBitcoin, formatNumber } from "@/lib/utils";
import { getCurrentStats, getHistoricalData, type NodeStats, type HistoricalData } from "@/lib/api";
import { Activity, Bolt, Database, Wallet, History, Heart, BarChart3, Bitcoin, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeInfoDisplay } from "@/components/NodeInfo";

const NODE_PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";

function NodeInfo() {
  const [pubkey, setPubkey] = useState(NODE_PUBKEY); // Utilisez la constante comme valeur initiale
  const [nodeData, setNodeData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://1ml.com/node/${pubkey}/json`);
      const data = await res.json();
      setNodeData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Appel automatique au montage
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <input
          value={pubkey}
          onChange={(e) => setPubkey(e.target.value)}
          placeholder="Entrez pubkey"
          className="flex-1 p-2 border rounded"
        />
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Rechercher
        </button>
      </div>
      {nodeData && (
        <pre className="mt-4 p-4 bg-muted rounded">
          {JSON.stringify(nodeData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function Home() {
  // ... (le reste du code Home reste inchangé)
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  // ... (autres états et fonctions)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* ... (contenu existant) */}
      
      <NodeInfo /> {/* Remplacez NodeInfoDisplay par le composant local */}
      
      {/* ... (reste du code) */}
    </div>
  );
}
