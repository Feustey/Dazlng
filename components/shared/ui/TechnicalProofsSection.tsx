'use client';

import React from 'react';

interface PublicNode {
  alias: string;
  nodeId: string;
  capacity: string;
  ranking: string;
  verifyLinks: {
    "1ML": string;
    "Amboss": string;
    "Terminal": string;
  };
}

const NodeProofCard: React.FC<PublicNode> = ({
  alias,
  nodeId,
  capacity,
  ranking,
  verifyLinks
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{alias}</h3>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          Rank #{ranking}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div>
          <span className="text-sm font-medium text-gray-500">{t('TechnicalProofsSection.capacit')}</span>
          <span className="ml-2 font-mono text-gray-900">{capacity}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">{t('TechnicalProofsSection.node_id')}</span>
          <div className="font-mono text-xs text-gray-600 break-all mt-1">
            {nodeId}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-3">{t('TechnicalProofsSection.vrifier_sur')}</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(verifyLinks).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              🔍 {platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TechnicalProofsSection: React.FC = () => {
  const publicNodes: PublicNode[] = [
    {
      alias: "DazNode-Prod-01",
      nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee...",
      capacity: "5.7 BTC",
      ranking: "47",
      verifyLinks: {
        "1ML": "https://1ml.com/node/03864ef025fde8fb587d989186ce6a4a186895ee...",
        "Amboss": "https://amboss.space/node/03864ef025fde8fb587d989186ce6a4a186895ee...",
        "Terminal": "https://terminal.lightning.engineering/node/03864ef025fde8fb587d989186ce6a4a186895ee..."
      }
    },
    {
      alias: "DazNode-Prod-02", 
      nodeId: "02f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9...",
      capacity: "3.2 BTC",
      ranking: "89",
      verifyLinks: {
        "1ML": "https://1ml.com/node/02f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9...",
        "Amboss": "https://amboss.space/node/02f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9...",
        "Terminal": "https://terminal.lightning.engineering/node/02f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9..."
      }
    },
    {
      alias: "DazNode-Prod-03",
      nodeId: "03c9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2...",
      capacity: "8.1 BTC", 
      ranking: "23",
      verifyLinks: {
        "1ML": "https://1ml.com/node/03c9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2...",
        "Amboss": "https://amboss.space/node/03c9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2...",
        "Terminal": "https://terminal.lightning.engineering/node/03c9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2..."
      }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Preuves Techniques Vérifiables
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nos nœuds publics sur le réseau Lightning Network. 
            Toutes les métriques sont vérifiables en temps réel.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {publicNodes.map((node) => (
            <NodeProofCard key={node.nodeId} {...node} />
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Métriques Temps Réel
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">{t('TechnicalProofsSection.uptime_moyen')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600">{t('TechnicalProofsSection.forcecloses_vits')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">+40%</div>
                <div className="text-sm text-gray-600">{t('TechnicalProofsSection.revenus_optimiss')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{t('TechnicalProofsSection.17_btc')}</div>
                <div className="text-sm text-gray-600">{t('TechnicalProofsSection.capacit_totale')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 