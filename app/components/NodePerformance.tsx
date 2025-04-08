"use client";

import { Card } from "./ui/card";
import { BarChart3, Zap, DollarSign, TrendingUp } from "lucide-react";

interface PerformanceStats {
  successRate: number;
  routingTime: number;
  averageFee: number;
  monthlyVolume: number;
  weeklyStats: {
    day: string;
    volume: number;
    successRate: number;
  }[];
}

interface NodePerformanceProps {
  stats: PerformanceStats;
}

export default function NodePerformance({ stats }: NodePerformanceProps) {
  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}k sats`;
    }
    return `${sats} sats`;
  };

  const maxVolume = Math.max(...stats.weeklyStats.map((stat) => stat.volume));
  const minVolume = Math.min(...stats.weeklyStats.map((stat) => stat.volume));

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold text-foreground">Taux de succès</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {stats.successRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-secondary/10 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Zap className="h-5 w-5 text-secondary mr-2" />
            <h3 className="font-semibold text-foreground">Temps de routage</h3>
          </div>
          <p className="text-2xl font-bold text-secondary">
            {stats.routingTime}ms
          </p>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-accent mr-2" />
            <h3 className="font-semibold text-foreground">Frais moyens</h3>
          </div>
          <p className="text-2xl font-bold text-accent">
            {stats.averageFee} sats
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
            <h3 className="font-semibold text-foreground">Volume mensuel</h3>
          </div>
          <p className="text-2xl font-bold text-muted-foreground">
            {formatSats(stats.monthlyVolume)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Performance hebdomadaire
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {stats.weeklyStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                {stat.day}
              </div>
              <div className="h-32 flex flex-col justify-end">
                <div
                  className="bg-primary rounded-t"
                  style={{
                    height: `${
                      ((stat.volume - minVolume) / (maxVolume - minVolume)) *
                      100
                    }%`,
                  }}
                />
                <div className="text-xs mt-1 text-foreground">
                  {formatSats(stat.volume)}
                  <br />
                  {stat.successRate.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
