import "dotenv/config";
import { connectToDatabase } from "../app/lib";
import { Node } from "../app/models/mongoose-models";

async function checkImportedData() {
  try {
    await connectToDatabase();
    console.log("Connecté à MongoDB");

    const count = await Node.countDocuments();
    console.log(`Nombre total de nœuds importés : ${count}`);

    const latestNode = await Node.findOne().sort({ timestamp: -1 });
    console.log("\nDernier nœud importé :");
    console.log(JSON.stringify(latestNode, null, 2));

    const oldestNode = await Node.findOne().sort({ timestamp: 1 });
    console.log("\nPlus ancien nœud importé :");
    console.log(JSON.stringify(oldestNode, null, 2));
  } catch (error) {
    console.error("Erreur lors de la vérification des données :", error);
  } finally {
    process.exit(0);
  }
}

checkImportedData();
