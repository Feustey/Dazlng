"use client";

import React, { FC, useEffect, useState } from 'react';

export interface NodeStats {
  totalCapacity: number;
  routingRevenue: number;
  channelCount: number;
  uptime: number;
}

const NodeStatsPage: FC = () => {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch node stats from API
    setTimeout(() => {
      setStats({
        totalCapacity: 1500000,
        routingRevenue: 25000,
        channelCount: 12,
        uptime: 99.8
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Statistiques détaillées</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Capacité totale</h3>
          <div className="text-3xl font-bold text-blue-600">{stats?.totalCapacity?.toLocaleString()} sats</div>
        </div>
        {/* Plus de widgets stats... */}
      </div>
    </div>
  );
};

export default NodeStatsPage;