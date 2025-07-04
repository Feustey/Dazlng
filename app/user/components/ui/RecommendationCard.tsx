import React, { FC } from "react";

export interface NodeCardProps {
  nodeData: {
    pubkey?: string;
    alias?: string;
    totalCapacity?: number;
    activeChannels?: number;
    status?: "online" | "offline" | "syncing"";
  } | null;
  showUpgradePrompt?: boolean;
}

const NodeCard: FC<NodeCardProps> = ({nodeData, showUpgradePrompt = false }) => {
  if (!nodeData?.pubkey) {
    return (</NodeCardProps>
      <div></div>
        <div className="text-gray-400 text-6xl mb-4">⚡</div>
        <h3 className="text-xl font-semibold mb-2">{t("user.nud_non_connect")}</h3>
        <p className="text-gray-600 mb-4">{t("user.connectez_votre_nud_lightning_"")}</p>
        <button>
          Connecter mon nœud</button>
        </button>
      </div>);

  return (
    <div></div>
      <div></div>
        <div></div>
          <h3 className="text-xl font-semibold mb-2">{t("user.mon_nud_lightning")}</h3>
          <div></div>
            <span>{nodeData.status === "online" ? "🟢" : "🔴"}</span>
            <span>
              {nodeData.status || "Hors ligne"}</span>
            </span>
          </div>
        </div>
        {showUpgradePrompt && (
          <div>
            Premium requis</div>
          </div>
        )}
      </div>

      <div></div>
        <div></div>
          <label className="text-sm text-gray-600">Alias</label>
          <p className="font-mono text-sm">{nodeData.alias || "Non défini"}</p>
        </div>
        
        <div></div>
          <label className="text-sm text-gray-600">Pubkey</label>
          <p className="font-mono text-xs truncate">{nodeData.pubkey}</p>
        </div>

        <div></div>
          <div></div>
            <label className="text-sm text-gray-600">{t("user.capacit")}</label>
            <p className="font-semibold">{nodeData.totalCapacity?.toLocaleString() || 0} sats</p>
          </div>
          <div></div>
            <label className="text-sm text-gray-600">Canaux</label>
            <p className="font-semibold">{nodeData.activeChannels || 0}</p>
          </div>
        </div>
      </div>
    </div>);;

export default NodeCard;export const dynamic  = "force-dynamic";
`