import 'dotenv/config';
import connectToDatabase from '../lib/mongodb';
import Node from '../models/Node';

async function checkImportedData() {
  try {
    await connectToDatabase();
    console.log('Connecté à MongoDB');

    const count = await Node.countDocuments();
    console.log(`Nombre total de nœuds importés : ${count}`);

    const latestNode = await Node.findOne().sort({ timestamp: -1 });
    console.log('\nDernier nœud importé :');
    console.log(JSON.stringify(latestNode, null, 2));

    const oldestNode = await Node.findOne().sort({ timestamp: 1 });
    console.log('\nPlus ancien nœud importé :');
    console.log(JSON.stringify(oldestNode, null, 2));

  } catch (error) {
    console.error('Erreur lors de la vérification des données :', error);
  } finally {
    process.exit(0);
  }
}

checkImportedData(); 