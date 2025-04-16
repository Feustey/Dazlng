"use client";

import * as React from "react";

import { useEffect, useState } from "react";
import Card from "./ui/card";
import { formatNumber, formatSats } from "../utils/format";
import { useTranslations } from "next-intl";
import { getNetworkStats } from "@/services/network.service";
import { Users, Zap, Activity, BarChart2 } from "lucide-react";

interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgChannelsPerNode: number;
  activeNodes: number;
  activeChannels: number;
  avgCapacityPerChannel: number;
  networkGrowth: {
    nodes: number;
    channels: number;
  };
}

export async function NetworkStats() {
  const stats = await getNetworkStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Nœuds</h3>
            <p className="text-2xl font-bold">
              {formatNumber(stats.totalNodes)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(stats.activeNodes)} actifs
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/20 rounded-lg">
            <Activity className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Canaux</h3>
            <p className="text-2xl font-bold">
              {formatNumber(stats.totalChannels)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(stats.activeChannels)} actifs
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/20 rounded-lg">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Capacité</h3>
            <p className="text-2xl font-bold">
              {(stats.totalCapacity / 100000000).toFixed(1)} BTC
            </p>
            <p className="text-sm text-muted-foreground">
              Moyenne: {(stats.avgCapacityPerChannel / 100000000).toFixed(3)}{" "}
              BTC
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Croissance</h3>
            <p className="text-2xl font-bold">
              +{formatNumber(stats.networkGrowth.nodes)} nœuds
            </p>
            <p className="text-sm text-muted-foreground">
              +{formatNumber(stats.networkGrowth.channels)} canaux
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
