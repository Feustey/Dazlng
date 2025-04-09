import "dotenv/config";
import { connect } from "mongoose";
import { Node } from "../app/models/mongoose-models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/daznode";
const PUBKEY = process.env.PUBKEY;

async function checkHistoricalData() {
  try {
    // Connexion à la base de données
    await connect(MONGODB_URI);
    console.log("Connecté à MongoDB");

    if (!PUBKEY) {
      throw new Error("PUBKEY non définie dans les variables d'environnement");
    }

    // Récupérer les données historiques
    const historicalData = await Node.find({ pubkey: PUBKEY })
      .sort({ timestamp: -1 })
      .limit(30);

    console.log("Données historiques récupérées :", historicalData);
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des données historiques :",
      error
    );
  } finally {
    process.exit();
  }
}

checkHistoricalData();
