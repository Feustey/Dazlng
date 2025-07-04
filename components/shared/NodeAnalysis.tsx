"use client";

import React, { useEffect, useState } from "react";
import { daznoApi } from "@/lib/services/dazno-api";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/shared/ui";
import { NodeStatus } from "@/lib/services/dazno-api";
import { useTranslations } from "next-intl";

interface NodeAnalysisProps {
  pubkey: string;
  className?: string;
}

const NodeAnalysis: React.FC<NodeAnalysisProps> = ({ pubkey, className = "" }) => {
  const [nodeInfo, setNodeInfo] = useState<NodeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const t = useTranslations("NodeAnalysis");

  useEffect(() => {
    const fetchNodeInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const info = await daznoApi.getNodeStatus(pubkey);
        setNodeInfo(info);
      } catch (err) {
        console.error("Failed to fetch node info:", err);
        setError("Erreur lors de la récupération des informations du nœud");
        toast({
          title: "Erreur",
          description: t("nodeanalysis_error"),
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNodeInfo();
  }, [pubkey, toast, t]);

  if (loading) {
    return (
      <div className={className}>
        <div>Chargement...</div>
      </div>
    );
  }

  if (error || !nodeInfo) {
    return (
      <div className={className}>
        <p className="text-red-500 mb-4">{error || "Erreur inattendue"}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div>
        <h2>
          {nodeInfo.alias}
        </h2>

        <div>
          <div>
            <p>
              Status: <span>
                {nodeInfo.status === "online" ? "En ligne" : "Hors ligne"}
              </span>
            </p>
            
            {nodeInfo.lastSeen && (
              <p>
                Dernière activité: <span>
                  {new Date(nodeInfo.lastSeen).toLocaleString()}
                </span>
              </p>
            )}
          </div>

          <div>
            {nodeInfo.channels !== undefined && (
              <p>
                Canaux: <span className="font-medium">{nodeInfo.channels}</span>
              </p>
            )}
            
            {nodeInfo.capacity !== undefined && (
              <p>
                Capacité: <span>
                  {nodeInfo.capacity.toLocaleString()} sats
                </span>
              </p>
            )}
          </div>
        </div>

        {nodeInfo.metrics && (
          <div>
            <h3 className="text-lg font-semibold mb-3">{t("metriques")}</h3>
            
            <div>
              <div>
                <p className="text-gray-600">{t("disponibilite")}</p>
                <div>
                  <div>
                    <div>
                    </div>
                  </div>
                  <span>
                    {Math.round(nodeInfo.metrics.availability * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-600">{t("fiabilite")}</p>
                <div>
                  <div>
                    <div>
                    </div>
                  </div>
                  <span>
                    {Math.round(nodeInfo.metrics.reliability * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Performance</p>
                <div>
                  <div>
                    <div>
                    </div>
                  </div>
                  <span>
                    {Math.round(nodeInfo.metrics.performance * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeAnalysis;