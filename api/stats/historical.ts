import { NextApiRequest, NextApiResponse } from "next";

// Données fictives pour les statistiques historiques
const mockHistoricalData = {
  network_growth: {
    timestamps: [
      "2023-01-01",
      "2023-02-01",
      "2023-03-01",
      "2023-04-01",
      "2023-05-01",
      "2023-06-01",
      "2023-07-01",
      "2023-08-01",
      "2023-09-01",
      "2023-10-01",
      "2023-11-01",
      "2023-12-01",
    ],
    nodes_count: [
      8000, 8250, 8500, 8700, 9000, 9300, 9600, 10000, 10500, 11000, 11800,
      12500,
    ],
    channels_count: [
      20000, 21000, 22000, 24000, 25500, 27000, 28500, 30000, 31500, 33000,
      34500, 35800,
    ],
    capacity: [
      "800000000000",
      "850000000000",
      "900000000000",
      "950000000000",
      "1000000000000",
      "1050000000000",
      "1100000000000",
      "1150000000000",
      "1180000000000",
      "1200000000000",
      "1230000000000",
      "1250000000000",
    ],
  },
  fee_rates: {
    timestamps: [
      "2023-01-01",
      "2023-03-01",
      "2023-06-01",
      "2023-09-01",
      "2023-12-01",
    ],
    avg_fee_rate: [250, 240, 230, 210, 200],
    avg_base_fee: [1200, 1150, 1100, 1050, 1000],
  },
  updated_at: new Date().toISOString(),
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Retourner les données simulées
    return res.status(200).json(mockHistoricalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
