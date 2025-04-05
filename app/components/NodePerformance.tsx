"use client";

import { Card } from "@/app/components/ui/card";
import { TrendingUp, TrendingDown, Clock, Zap, BarChart3 } from "lucide-react";

interface PerformanceStats {
  successRate: number;
  routingTime: number;
  averageFee: number;
  monthlyVolume: number;
  weeklyStats: {
    date: string;
    successRate: number;
    volume: number;
  }[];
}

interface NodePerformanceProps {
  stats?: PerformanceStats;
}

export default function NodePerformance({ stats }: NodePerformanceProps) {
  // Données de démonstration si aucune statistique n'est fournie
  const defaultStats: PerformanceStats = {
    successRate: 98.5,
    routingTime: 125,
    averageFee: 0.05,
    monthlyVolume: 50000000,
    weeklyStats: [
      { date: "Lun", successRate: 97.8, volume: 12000000 },
      { date: "Mar", successRate: 98.2, volume: 13500000 },
      { date: "Mer", successRate: 98.7, volume: 14200000 },
      { date: "Jeu", successRate: 98.5, volume: 13800000 },
      { date: "Ven", successRate: 98.9, volume: 15000000 },
      { date: "Sam", successRate: 98.3, volume: 11000000 },
      { date: "Dim", successRate: 98.6, volume: 10500000 },
    ],
  };

  const performanceStats = stats || defaultStats;

  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}k sats`;
    }
    return `${sats} sats`;
  };

  // Trouver les valeurs min et max pour le graphique
  const maxVolume = Math.max(
    ...performanceStats.weeklyStats.map((stat) => stat.volume)
  );
  const minVolume = Math.min(
    ...performanceStats.weeklyStats.map((stat) => stat.volume)
  );
  const volumeRange = maxVolume - minVolume;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="font-semibold text-gray-800">
              Taux de succès des paiements
            </h4>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {performanceStats.successRate}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Sur les 7 derniers jours
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="font-semibold text-gray-800">
              Temps moyen de routage
            </h4>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {performanceStats.routingTime}ms
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Temps de traitement moyen
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <Zap className="h-5 w-5 text-purple-500 mr-2" />
            <h4 className="font-semibold text-gray-800">Frais moyens</h4>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {performanceStats.averageFee}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Par transaction</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-5 w-5 text-orange-500 mr-2" />
            <h4 className="font-semibold text-gray-800">Volume mensuel</h4>
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {formatSats(performanceStats.monthlyVolume)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Transactions traitées
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">
          Performance hebdomadaire
        </h4>
        <div className="h-64 flex items-end space-x-2">
          {performanceStats.weeklyStats.map((stat, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t"
                style={{
                  height: `${((stat.volume - minVolume) / volumeRange) * 100}%`,
                  minHeight: "20px",
                }}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{stat.date}</div>
              <div className="text-xs font-medium text-orange-600">
                {formatSats(stat.volume)}
              </div>
              <div className="text-xs text-green-600">{stat.successRate}%</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
