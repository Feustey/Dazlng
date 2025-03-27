import 'dotenv/config';
import { connectToDatabase } from '../lib/mongodb';
import Node from '../models/Node';

async function migrateDatabase() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Mettre à jour tous les documents pour renommer le champ
    const result = await Node.updateMany(
      {},
      [
        {
          $set: {
            active_channels: '$active_channel_count'
          }
        },
        {
          $unset: 'active_channel_count'
        }
      ]
    );

    console.log(`Migration completed. Updated ${result.modifiedCount} documents.`);

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateDatabase(); 