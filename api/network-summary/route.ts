import { NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Données de résumé réseau simulées pour le déploiement
const mockNetworkSummary = {
  totalNodes: 15000,
  totalChannels: 85000,
  totalCapacity: "5000000000",
  avgChannelSize: "58823",
  lastUpdate: new Date().toISOString(),
  nodesByCountry: {
    US: 4500,
    DE: 2800,
    FR: 1500,
    GB: 1200,
    JP: 900,
  },
  capacityHistory: [
    { date: new Date("2024-01-01").toISOString(), value: 4500000000 },
    { date: new Date("2024-02-01").toISOString(), value: 4700000000 },
    { date: new Date("2024-03-01").toISOString(), value: 4900000000 },
    { date: new Date("2024-04-01").toISOString(), value: 5000000000 },
  ],
  avgCapacityPerChannel: 58823,
  avgChannelsPerNode: 5.67,
  version: "1.0.0",
};

export async function GET() {
  try {
    // Pour le déploiement, on retourne toujours les données simulées
    console.log(
      "API network-summary route: utilisation des données simulées pour le déploiement"
    );
    return NextResponse.json(mockNetworkSummary);
  } catch (error) {
    console.error("Error fetching network summary:", error);

    // En cas d'erreur, on retourne quand même les données simulées
    console.log(
      "API network-summary route: utilisation des données simulées suite à une erreur"
    );
    return NextResponse.json(mockNetworkSummary);
  }
}
