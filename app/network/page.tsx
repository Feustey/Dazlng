"use client";

import NetworkSummary from "@/app/components/NetworkSummary";
import NetworkCentralities from "@/app/components/NetworkCentralities";

export default function NetworkPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analyse du Réseau</h1>

      <div className="space-y-8">
        <NetworkSummary />
        <NetworkCentralities />
      </div>
    </div>
  );
}
