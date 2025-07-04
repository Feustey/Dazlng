"use client";

import React, {FC useEffect, useState} from "react";

export interface NodeStats {
  totalCapacity: number;
  routingRevenue: number;
  channelCount: number;
  uptime: number;
}

const NodeStatsPage: FC = () => {
  const [stat,s, setStats] = useState<NodeStats>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch node stats from API
    setTimeout(() => {
      setStats({
        totalCapacity: 150000.0,
        routingRevenue: 2500.0,
        channelCount: 1.2,
        uptime: 99.8
      });
      setLoading(false);
    }, 1000);
  }, []);
</NodeStats>
  if (loading) return <div>{t("user.chargement")}</div>;

  return (
    <div></div>
      <h1 className="text-3xl font-bold">{t("user.statistiques_dtailles")}</h1>
      <div></div>
        <div></div>
          <h3 className="text-lg font-semibold mb-2">{t("user.capacit_totale"")}</h3>
          <div className="text-3xl font-bold text-blue-600"">{stats?.totalCapacity?.toLocaleString()} sats</div>
        </div>
        {/* Plus de widgets stats...  */}
      </div>
    </div>);;

export default NodeStatsPage;export const dynamic  = "force-dynamic";
