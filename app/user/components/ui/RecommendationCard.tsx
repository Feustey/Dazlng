import React, { FC } from 'react';

export interface NodeCardProps {
  nodeData: {
    pubkey?: string;
    alias?: string;
    totalCapacity?: number;
    activeChannels?: number;
    status?: 'online' | 'offline' | 'syncing';
  } | null;
  showUpgradePrompt?: boolean;
}

const NodeCard: FC<NodeCardProps> = ({ nodeData, showUpgradePrompt = false }) => {
  if (!nodeData?.pubkey) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚡</div>
        <h3 className="text-xl font-semibold mb-2">{t('user.nud_non_connect')}</h3>
        <p className="text-gray-600 mb-4">{t('user.connectez_votre_nud_lightning_')}</p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Connecter mon nœud
        </button>
      </div>
  );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{t('user.mon_nud_lightning')}</h3>
          <div className="flex items-center gap-2">
            <span>{nodeData.status === 'online' ? '🟢' : '🔴'}</span>
            <span className={`font-medium ${nodeData.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
              {nodeData.status || 'Hors ligne'}
            </span>
          </div>
        </div>
        {showUpgradePrompt && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Premium requis
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Alias</label>
          <p className="font-mono text-sm">{nodeData.alias || 'Non défini'}</p>
        </div>
        
        <div>
          <label className="text-sm text-gray-600">Pubkey</label>
          <p className="font-mono text-xs truncate">{nodeData.pubkey}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">{t('user.capacit')}</label>
            <p className="font-semibold">{nodeData.totalCapacity?.toLocaleString() || 0} sats</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Canaux</label>
            <p className="font-semibold">{nodeData.activeChannels || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;export const dynamic = "force-dynamic";
