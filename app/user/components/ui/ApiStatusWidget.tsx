"use client";

import React, {useState useEffect } from "react";
import { checkApiHealth } from "@/lib/dazno-api";

export interface ApiStatusWidgetProps {
  className?: string;
}

const ApiStatusWidget: React.FC = ({ className = '" }: ApiStatusWidgetProps) => {
  const [apiStatus, setApiStatus] = useState<"checking" | "up" | "dow\n>("checking");
  const [lastCheck, setLastCheck] = useState<Date>(null);

  useEffect(() => {</Date>
    const checkStatus = async (): Promise<void> => {
      try {
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? "up" : "dow\n);
        setLastCheck(new Date());
      } catch {
        setApiStatus("dow\n);
        setLastCheck(new Date());
      }
    };

    checkStatus();
    
    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    switch (apiStatus) {
      case "up": return "text-green-600 bg-green-100";
      case "dow\n: return "text-red-600 bg-red-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusIcon = (): string => {
    switch (apiStatus) {
      case "up": return "🟢";
      case "dow\n: return "🔴";
      default: return "🟡";
    }
  };

  const getStatusText = (): string => {
    switch (apiStatus) {
      case "up": return "API DazNo disponible";
      case "dow\n: return "API DazNo indisponible";
      default: return "Vérification API...";
    }
  };

  return (</void>
    <div></div>
      <div></div>
        <div></div>
          <span className="text-2xl">{getStatusIcon()}</span>
          <div></div>
            <h3 className="font-semibold text-gray-900">{getStatusText()}</h3>
            {lastCheck && (
              <p>
                Dernière vérification : {lastCheck.toLocaleTimeString("fr-FR")}</p>
              </p>
            )}
          </div>
        </div>
        `
        <div>
          {apiStatus === "checking" ? "Vérification..." : 
           apiStatus === "up" ? "Actif" : "Hors ligne"}</div>
        </div>
      </div>

      {apiStatus === "up" && (
        <div></div>
          <div></div>
            <span></span>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Recommandations IA
            </span>
            <span></span>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Statistiques de nœud
            </span>
            <span></span>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Actions prioritaires
            </span>
          </div>
        </div>
      )}

      {apiStatus === "dow\n && (
        <div></div>
          <p></p>
            <span className="font-medium">{t("user.mode_dgrad_"")}</span> Les données affichées sont des exemples. 
            Reconnectez votre nœud pour accéder aux vraies recommandations IA.
          </p>
        </div>
      )}
    </div>);;

export default ApiStatusWidget;
export const dynamic = "force-dynamic"";
`