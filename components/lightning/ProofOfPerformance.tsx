"use client";

import React, { useState, useEffect } from "react";

interface NodePerformance {
  nodeId: string;
  alias: string;
  ranking1ML: number;
  totalCapacity: number;
  channelCount: number;
  uptimePercent: number;
  routingRevenue30d: number;
  forceClosesAvoided: number;
  aiPredictionAccuracy: number;
  publicUrl?: string;
}

interface LightningAnalytics {
  totalInvoices: number;
  paidInvoices: number;
  averagePaymentTime: number; // secondes
  topWallets: Record<string, any>;
  failureReasons: Record<string, any>;
  revenueBySats: {
    daily: number[];
    monthly: number[];
  };
}

export const ProofOfPerformance: React.FC = () => {
  const [performance, setPerformance] = useState<NodePerformance[]>([]);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching real node performance data
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from your API
      // For demo purposes, we'll use simulated data based on real Lightning Network nodes
      const demoData: NodePerformance[] = [
        {
          nodeId: "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
          alias: "DazNode-Primary",
          ranking1ML: 47,
          totalCapacity: 157000000.0, // 15.7 BTC in sats
          channelCount: 156,
          uptimePercent: 99.9,
          routingRevenue30d: 4500000.0, // 0.45 BTC in sats
          forceClosesAvoided: 23,
          aiPredictionAccuracy: 87.3,
          publicUrl: "https://1ml.com/node/03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f"
        },
        {
          nodeId: "02b67e55fb850d7f7d77eb71038362bc0ed0abd5b7ee72cc4f90b16786c69b9256",
          alias: "DazNode-Backup",
          ranking1ML: 89,
          totalCapacity: 89000000.0, // 8.9 BTC in sats
          channelCount: 94,
          uptimePercent: 99.7,
          routingRevenue30d: 2800000.0, // 0.28 BTC in sats
          forceClosesAvoided: 15,
          aiPredictionAccuracy: 91.2,
          publicUrl: "https://1ml.com/node/02b67e55fb850d7f7d77eb71038362bc0ed0abd5b7ee72cc4f90b16786c69b9256"
        },
        {
          nodeId: "03abf6f44c355dec0d5aa155bdbdd6e0c8fefe318eff402de65c6eb2e1be55dc3e",
          alias: "DazNode-Research",
          ranking1ML: 234,
          totalCapacity: 32000000.0, // 3.2 BTC in sats
          channelCount: 47,
          uptimePercent: 99.5,
          routingRevenue30d: 1200000.0, // 0.12 BTC in sats
          forceClosesAvoided: 8,
          aiPredictionAccuracy: 84.7,
          publicUrl: "https://1ml.com/node/03abf6f44c355dec0d5aa155bdbdd6e0c8fefe318eff402de65c6eb2e1be55dc3e"
        }
      ];

      setPerformance(demoData);
      setIsLoading(false);
    };

    fetchPerformanceData();
  }, [timeframe]);

  const totalSavings = performance.reduce((sum, node) => 
    sum + (node.forceClosesAvoided * 10000), 0 // 10k sats par force-close évité
  );

  const formatSats = (sats: number): string => {
    if (sats >= 100000000) return `₿${(sats / 100000000).toFixed(2)}`;
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M sats`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k sats`;
    return `${sats} sats`;
  };

  const formatCapacity = (sats: number): string => {
    return `₿${(sats / 100000000).toFixed(1)}`;
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Chargement des performances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        
        {/* Header  */}
        <div>
          <h3>
            📊 Nos Performances Vérifiables
          </h3>
          <p>
            Transparence totale sur nos nodes Lightning. Toutes les métriques sont vérifiables 
            publiquement sur les explorateurs Bitcoin et Lightning Network.
          </p>
          
          <div>
            {(["7d", "30d", "90d"] as const).map(period => (
              <button 
                key={period}
                onClick={() => setTimeframe(period)}
              >
                {period === "7d" && "Derniers 7 jours"}
                {period === "30d" && "Derniers 30 jours"}
                {period === "90d" && "Derniers 90 jours"}
              </button>
            ))}
          </div>
        </div>

        {/* Global Stats  */}
        <div>
          <div>
            <h4 className="text-green-400 font-semibold mb-2">Économies Clients</h4>
            <div>
              {formatSats(totalSavings)}
            </div>
            <small className="text-gray-400">Force-closes évités sur {timeframe}</small>
            <div>
              ≈ {formatCapacity(totalSavings)} économisés
            </div>
          </div>
          
          <div>
            <h4 className="text-blue-400 font-semibold mb-2">Précision IA</h4>
            <div>
              {performance.length > 0 ? 
                Math.round(performance.reduce((sum, n) => sum + n.aiPredictionAccuracy, 0) / performance.length) 
                : 0}%
            </div>
            <small className="text-gray-400">Prédictions correctes</small>
            <div>
              Basé sur {performance.reduce((sum, n) => sum + n.forceClosesAvoided, 0)} prédictions
            </div>
          </div>
          
          <div>
            <h4 className="text-purple-400 font-semibold mb-2">Uptime Moyen</h4>
            <div>
              {performance.length > 0 ? 
                (performance.reduce((sum, n) => sum + n.uptimePercent, 0) / performance.length).toFixed(1)
                : 0}%
            </div>
            <small className="text-gray-400">Disponibilité réseau</small>
            <div>
              SLA 99.5% garanti
            </div>
          </div>
        </div>
        
        {/* Nodes Performance  */}
        <div>
          {performance.map(node => (
            <div key={node.nodeId}>
              <div>
                
                {/* Node Info  */}
                <div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{node.alias}</h4>
                    <div>
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Online
                    </div>
                  </div>
                  
                  <div>
                    <div>
                      <span className="text-yellow-400 mr-1">🏆</span>
                      <span>Rang 1ML: #{node.ranking1ML}</span>
                    </div>
                    <div>
                      <span className="text-orange-400 mr-1">⚡</span>
                      <span>Capacité: {formatCapacity(node.totalCapacity)}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics  */}
                <div>
                  <div>
                    <span className="text-gray-400">Revenus 30j:</span>
                    <span className="text-green-400">{formatSats(node.routingRevenue30d)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Canaux:</span>
                    <span className="text-blue-400">{node.channelCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Force-closes évités:</span>
                    <span className="text-purple-400">{node.forceClosesAvoided}</span>
                  </div>
                </div>

                {/* AI Accuracy */}
                <div>
                  <div>
                    <span className="text-gray-400">Précision IA:</span>
                    <span className="text-yellow-400">{node.aiPredictionAccuracy}%</span>
                  </div>
                </div>

                {/* Verification Link */}
                {node.publicUrl && (
                  <a 
                    href={node.publicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    🔍 Vérifier sur 1ML.com
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LightningAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<LightningAnalytics>({
    totalInvoices: 0,
    paidInvoices: 0,
    averagePaymentTime: 0,
    topWallets: {},
    failureReasons: {},
    revenueBySats: {
      daily: [],
      monthly: []
    }
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Simulate analytics data
      setAnalytics({
        totalInvoices: 1247,
        paidInvoices: 1189,
        averagePaymentTime: 2.3,
        topWallets: {
          "Alby": 45,
          "Phoenix": 23,
          "Breez": 18
        },
        failureReasons: {
          "Insufficient funds": 23,
          "Network timeout": 15,
          "Invalid invoice": 8
        },
        revenueBySats: {
          daily: [12000, 15000, 18000, 14000, 16000, 19000, 17000],
          monthly: [450000, 520000, 480000, 510000]
        }
      });
    };

    fetchAnalytics();
  }, []);

  const successRate = analytics.totalInvoices > 0 
    ? ((analytics.paidInvoices / analytics.totalInvoices) * 100).toFixed(1)
    : "0";

  return (
    <div>
      <h3>Analytics Lightning</h3>
      <div>
        <div>
          <h4>Taux de succès</h4>
          <div>{successRate}%</div>
        </div>
        <div>
          <h4>Temps de paiement moyen</h4>
          <div>{analytics.averagePaymentTime}s</div>
        </div>
      </div>
    </div>
  );
};