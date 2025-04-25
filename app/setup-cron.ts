import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function setupCron() {
  try {
    // Chemin absolu vers le script de mise à jour
    const updateScriptPath = path.resolve(__dirname, 'update-daily.ts');
    
    // Créer la commande cron pour exécuter le script une fois par jour à minuit
    const cronCommand = `0 0 * * * cd ${process.cwd()} && npx ts-node ${updateScriptPath} >> cron.log 2>&1`;
    
    // Ajouter la tâche cron
    await execAsync(`(crontab -l 2>/dev/null | grep -v "${updateScriptPath}"; echo "${cronCommand}") | crontab -`);
    
    console.log('Cron job setup completed successfully');
  } catch (error) {
    console.error('Error setting up cron job:', error);
    process.exit(1);
  }
}

// Exécuter la configuration
setupCron(); 