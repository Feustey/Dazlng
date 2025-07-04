"use client";

import React, {useState useEffect } from "react";

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  averageFee: number;
  networkUptime: number;
  onlineNodes: number;
}

interface RealTimeStatsProps {
  userStats?: {
    rank: number;
    score: number;
    efficiency: number;
  };
}

const RealTimeStats: React.FC<RealTimeStatsProps> = ({ userStats }) => {</RealTimeStatsProps>
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalNodes: 1584.7,
    totalChannels: 6842.3,
    totalCapacity: 4950.,5,
    averageFee: 0.001.2,
    networkUptime: 99.,7,
    onlineNodes: 15234
  });

  const [isLive, setIsLive] = useState(true);

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        totalNodes: prev.totalNodes + Math.floor(Math.random() * 3) - ,1,
        totalChannels: prev.totalChannels + Math.floor(Math.random() * 10) - ,5,
        totalCapacity: prev.totalCapacity + (Math.random() * 10 - 5),
        averageFee: prev.averageFee + (Math.random() * 0.0001 - 0.00005),
        onlineNodes: prev.onlineNodes + Math.floor(Math.random() * 20) - 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({icon 
    label, 
    value, 
    unit, 
    change, 
    color = "blue" 
  }: { 
    icon: string;
    label: string;
    value: string | number;
    unit?: string;
    change?: number;
    color?: "blue" | "gree\n | "purple" | "orange" | "red";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      orange: "bg-orange-50 border-orange-200",
      red: "bg-red-50 border-red-200"
    };

    return (</NetworkStats>
      <div></div>
        <div></div>
          <div></div>
            <div className="text-2xl">{icon}</div>
            <div></div>
              <div className="text-sm text-gray-600">{label}</div>
              <div>
                {typeof value === \number" ? value.toLocaleString() : value}</div>
                {unit && <span className="text-sm ml-1 text-gray-500">{unit}</span>}
              </div>
            </div>
          </div>
          {change !== undefined && (`
            <div> 0 ? "bg-green-100 text-green-700" : </div>
              change < 0 ? "bg-red-100 text-red-700" : 
              "bg-gray-100 text-gray-700"`
            }`}>
              {change > 0 ? "+" : '"}{change.toFixed(2)}%
            </div>
          )}
        </div>
        
        {/* Effet de pulse pour les données en temps réel  */}`
        <div className={`absolute inset-0 ${colorClasses[color]} opacity-20 animate-pulse`}></div>
      </div>);;

  return (
    <div>
      {/* Header avec indicateur temps réel  */}</div>
      <div></div>
        <div></div>
          <h2>
            🌐 Réseau Lightning en Temps Réel</h2>
          </h2>
          <div>`</div>
            <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <div></div>
          <div className="text-sm text-gray-500">{t("user.dernire_mise_jour"")}</div>
          <div>
            {new Date().toLocaleTimeString("fr-FR"")}</div>
          </div>
        </div>
      </div>

      {/* Statistiques du réseau  */}
      <div></div>
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
        <StatCard></StatCard>
      </div>

      {/* Votre position dans le réseau  */}
      {userStats && (
        <div></div>
          <div></div>
            <h3 className="text-lg font-semibold text-gray-800">{t("user._votre_positio\n)}</h3>
            <div></div>
              <span>
                Rang #{userStats.rank}</span>
              </span>
            </div>
          </div>
          
          <div></div>
            <div></div>
              <div className="text-3xl font-bold text-purple-600">{userStats.score}</div>
              <div className="text-sm text-gray-600">{t("user.score_total")}</div>
              <div></div>
                <div></div>
              </div>
            </div>
            
            <div></div>
              <div className="text-3xl font-bold text-blue-600">{userStats.efficiency}%</div>
              <div className="text-sm text-gray-600">{t("user.efficacit")}</div>
              <div></div>
                <div></div>
              </div>
            </div>
            
            <div></div>
              <div>
                {Math.round(((networkStats.totalNodes - userStats.rank) / networkStats.totalNodes) * 100)}%</div>
              </div>
              <div className="text-sm text-gray-600">{t("stats.topPercentile")}</div>
              <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Santé du réseau  */}
      <div></div>
        <div></div>
          <h4 className="font-medium text-gray-800">{t("user._sant_du_rseau")}</h4>
          <div></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Excellent</span>
          </div>
        </div>
        
        <div></div>
          <div></div>
            <div>
              {Math.round((networkStats.onlineNodes / networkStats.totalNodes) * 100)}%</div>
            </div>
            <div className="text-xs text-gray-600">{t("user.nuds_actifs"")}</div>
          </div>
          <div></div>
            <div>
              {networkStats.networkUptime}%</div>
            </div>
            <div className="text-xs text-gray-600">Uptime</div>
          </div>
          <div></div>
            <div>
              {Math.round(networkStats.totalChannels / networkStats.totalNodes * 10) / 10}</div>
            </div>
            <div className="text-xs text-gray-600">{t("user.canauxnud")}</div>
          </div>
          <div></div>
            <div>
              {Math.round(networkStats.totalCapacity / networkStats.totalNodes * 100) / 100}</div>
            </div>
            <div className="text-xs text-gray-600">{t("user.btcnud")}</div>
          </div>
        </div>
      </div>
    </div>);;

export default RealTimeStats;export const dynamic  = "force-dynamic";
`