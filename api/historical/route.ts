import { NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Données historiques simulées pour le déploiement
const mockHistoricalData = {
  nodes: [
    { date: "2024-01-01", value: 14000 },
    { date: "2024-02-01", value: 14500 },
    { date: "2024-03-01", value: 15000 },
  ],
  channels: [
    { date: "2024-01-01", value: 80000 },
    { date: "2024-02-01", value: 82500 },
    { date: "2024-03-01", value: 85000 },
  ],
  capacity: [
    { date: "2024-01-01", value: 4500000000 },
    { date: "2024-02-01", value: 4750000000 },
    { date: "2024-03-01", value: 5000000000 },
  ],
  timestamp: new Date().toISOString(),
};

export async function GET() {
  try {
    // Pour le déploiement, on retourne toujours les données simulées
    console.log(
      "API historical route: utilisation des données simulées pour le déploiement"
    );
    return NextResponse.json(mockHistoricalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);

    // En cas d'erreur, on retourne quand même les données simulées
    console.log(
      "API historical route: utilisation des données simulées suite à une erreur"
    );
    return NextResponse.json(mockHistoricalData);
  }
}
