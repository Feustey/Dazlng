"use client";

import React, { useState, useEffect } from "react";

interface ChannelHealth {
  channelId: string;
  alias: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  healthScore: number;
  predictedForceClose: {
    probability: number;
    timeframe: string;
    reason: string;
  };
  status: "healthy" | "warning" | "critical";
  lastUpdate: Date;
}

interface LiveChannelMonitorProps {
  isDemo?: boolean;
  maxChannels?: number;
}

export const LiveChannelMonitor: React.FC<LiveChannelMonitorProps> = ({ 
  isDemo = true, 
  maxChannels = 4 
}) => {
  const [channels, setChannels] = useState<ChannelHealth[]>([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate demo data or connect to real WebSocket
    if (isDemo) {
      // Generate demo channel data
      const demoChannels: ChannelHealth[] = [
        {
          channelId: "850x1840x0",
          alias: "WalletOfSatoshi.com",
          capacity: 1677721.6, // sats
          localBalance: 1258291.2,
          remoteBalance: 419430.4,
          healthScore: 8.7,
          predictedForceClose: {
            probability: 0.12,
            timeframe: "48h",
            reason: "Déséquilibre liquidité"
          },
          status: "healthy",
          lastUpdate: new Date()
        },
        {
          channelId: "751x2156x1",
          alias: "LNBig.com [lnd-01]",
          capacity: 500000.0,
          localBalance: 50000.0,
          remoteBalance: 450000.0,
          healthScore: 9.2,
          predictedForceClose: {
            probability: 0.05,
            timeframe: "7d+",
            reason: "Excellent équilibre"
          },
          status: "healthy",
          lastUpdate: new Date()
        },
        {
          channelId: "742x1945x0",
          alias: "Kraken 🐙⚡",
          capacity: 1000000.0,
          localBalance: 980000.0,
          remoteBalance: 20000.0,
          healthScore: 3.4,
          predictedForceClose: {
            probability: 0.78,
            timeframe: "6h",
            reason: "Liquidité épuisée côté distant"
          },
          status: "critical",
          lastUpdate: new Date()
        },
        {
          channelId: "693x1547x2",
          alias: "Bitrefill",
          capacity: 200000.0,
          localBalance: 110000.0,
          remoteBalance: 90000.0,
          healthScore: 7.8,
          predictedForceClose: {
            probability: 0.23,
            timeframe: "24h",
            reason: "Utilisation intensive"
          },
          status: "warning",
          lastUpdate: new Date()
        }
      ];

      setChannels(demoChannels.slice(0, maxChannels));
      setAlertsCount(demoChannels.filter(c => c.status === "critical" || c.status === "warning").length);
      setIsConnected(true);

      // Simulate real-time updates
      const interval = setInterval(() => {
        setChannels(prev => prev.map(channel => {
          // Simulate small balance changes
          const balanceChange = Math.floor(Math.random() * 20000) - 10000;
          const newLocalBalance = Math.max(0, Math.min(channel.capacity, channel.localBalance + balanceChange));
          const newRemoteBalance = channel.capacity - newLocalBalance;
          
          // Recalculate health score based on balance
          const balanceRatio = Math.min(newLocalBalance, newRemoteBalance) / (channel.capacity / 2);
          const newHealthScore = Math.floor(balanceRatio * 100);
          
          // Update force-close prediction
          const newProbability = newHealthScore < 30 ? 0.7 + Math.random() * 0.3 : 
                                newHealthScore < 60 ? 0.2 + Math.random() * 0.3 : 
                                Math.random() * 0.2;

          return {
            ...channel,
            localBalance: newLocalBalance,
            remoteBalance: newRemoteBalance,
            healthScore: newHealthScore,
            predictedForceClose: {
              ...channel.predictedForceClose,
              probability: newProbability
            },
            status: newHealthScore < 30 ? "critical" as const :
                   newHealthScore < 60 ? "warning" as const : "healthy" as const,
            lastUpdate: new Date()
          };
        }));
      }, 5000); // Update every 5 seconds for demo

      return () => clearInterval(interval);
    } else {
      // Real WebSocket connection would go here
      const ws = new WebSocket("wss://api.dazno.de/live-channels");
      
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChannels(data.channels);
        setAlertsCount(data.alerts);
      };
      
      return () => ws.close();
    }
  }, [isDemo, maxChannels]);

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "text-green-400 bg-green-400/20";
    if (score >= 60) return "text-yellow-400 bg-yellow-400/20";
    if (score >= 40) return "text-orange-400 bg-orange-400/20";
    return "text-red-400 bg-red-400/20";
  };

  const getStatusIcon = (status: ChannelHealth["status"]): string => {
    switch (status) {
      case "healthy": return "🟢";
      case "warning": return "🟡";
      case "critical": return "🔴";
      default: return "⚪";
    }
  };

  const formatSats = (sats: number): string => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k`;
    return sats.toString();
  };

  const formatTimeframe = (timeframe: string): string => {
    return timeframe.replace("h", " heures").replace("d", " jours");
  };

  return (
    <div>
      
      {/* Header  */}
      <div>
        <div>
          <h3 className="text-xl font-bold text-white mr-3">Monitoring IA en direct</h3>
          <div>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
            {isConnected ? "Connecté" : "Déconnecté"}
          </div>
        </div>
        
        <div>
          {alertsCount > 0 && (
            <div>
              <span className="animate-pulse mr-2">⚠️</span>
              {alertsCount} alerte{alertsCount > 1 ? "s" : ""} active{alertsCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Channels Grid  */}
      <div>
        {channels.map(channel => (
          <div key={channel.channelId} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-white">{channel.alias}</h4>
                <p className="text-gray-400 text-sm">{channel.channelId}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(channel.status)}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getHealthColor(channel.healthScore)}`}>
                  {channel.healthScore}/10
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Capacité:</span>
                <span className="text-white">{formatSats(channel.capacity)} sats</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Local:</span>
                <span className="text-blue-400">{formatSats(channel.localBalance)} sats</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Distant:</span>
                <span className="text-green-400">{formatSats(channel.remoteBalance)} sats</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Force-close:</span>
                <span className={`font-medium ${
                  channel.predictedForceClose.probability > 0.5 ? "text-red-400" : 
                  channel.predictedForceClose.probability > 0.2 ? "text-yellow-400" : "text-green-400"
                }`}>
                  {(channel.predictedForceClose.probability * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatTimeframe(channel.predictedForceClose.timeframe)} - {channel.predictedForceClose.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};