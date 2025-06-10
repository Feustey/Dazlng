"use client";

import React, { useEffect, useState } from "react";
import FunnelAnalytics from "../../../components/shared/ui/FunnelAnalytics";

type UmamiStats = {
  pageviews: number;
  uniques: number;
  bouncerate: number;
  avgDuration: number;
};

export default function AnalyticsPage(): React.ReactElement {
  const [stats, setStats] = useState<UmamiStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = process.env.UMAMI_API_URL;
        const websiteId = process.env.UMAMI_WEBSITE_ID;
        const apiToken = process.env.UMAMI_API_KEY;

        if (!apiUrl || !websiteId || !apiToken) {
          setError("Variables d'environnement Umami manquantes.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${apiUrl}/websites/${websiteId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
            next: { revalidate: 60 }, // cache 1 min
          }
        );

        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des stats Umami");
        }

        const data = await res.json();
        setStats({
          pageviews: data.pageviews.value,
          uniques: data.uniques.value,
          bouncerate: data.bouncerate.value,
          avgDuration: data.avgDuration.value,
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Funnel Analytics */}
      <div className="mb-8">
        <FunnelAnalytics />
      </div>
      
      {/* Umami Stats */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Statistiques Umami</h2>
        {loading && <div>Chargement des statistiques…</div>}
        {error && <div className="text-red-500">{error}</div>}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Visites" value={stats.pageviews} />
            <StatCard label="Visiteurs uniques" value={stats.uniques} />
            <StatCard label="Taux de rebond" value={stats.bouncerate.toFixed(2) + " %"} />
            <StatCard label="Durée moyenne" value={formatDuration(stats.avgDuration)} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }): React.ReactElement {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return "-";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}m ${sec}s`;
}
