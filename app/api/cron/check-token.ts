import type { NextApiRequest, NextApiResponse } from 'next';
import { checkTokenExpiry } from '../../../scripts/monitor-tokens';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérifier le secret de la tâche CRON
  if (req.headers['x-cron-secret'] !== (process.env.CRON_SECRET ?? "")) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    await checkTokenExpiry();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du token' });
  }
}
