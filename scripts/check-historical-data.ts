import "dotenv/config";
import { connectToDatabase } from "@/lib";
import { Node } from "@/models";

const PUBKEY =
  "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";

async function checkHistoricalData() {
  try {
    await connectToDatabase();
    console.log("Connected to MongoDB");

    // Récupérer les données historiques
    const historicalData = await Node.find({ pubkey: PUBKEY })
      .sort({ timestamp: -1 })
      .limit(30);

    console.log(`Found ${historicalData.length} historical records`);

    // Afficher les données
    historicalData.forEach((record) => {
      console.log("\nRecord:", {
        timestamp: record.timestamp,
        total_peers: record.total_peers,
        active_channels: record.active_channels,
        total_capacity: record.total_capacity,
        total_volume: record.total_volume,
        total_fees: record.total_fees,
      });
    });
  } catch (error) {
    console.error("Error checking historical data:", error);
    process.exit(1);
  }
}

// Exécuter la vérification
checkHistoricalData();
