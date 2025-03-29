import { NextResponse } from 'next/server';
import { prisma, testConnection } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Début de la requête GET /api/stats');
    
    // Test de la connexion
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Échec de la connexion à MongoDB');
      return NextResponse.json(
        { error: 'Impossible de se connecter à MongoDB. Vérifiez la configuration de la base de données.' },
        { status: 503 }
      );
    }
    
    // Récupération des statistiques
    const stats = await prisma.history.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 1
    });

    if (!stats || stats.length === 0) {
      return NextResponse.json(
        { error: 'Aucune statistique disponible' },
        { status: 404 }
      );
    }

<<<<<<< HEAD
    return NextResponse.json(stats[0]);
=======
    // Formater les données pour correspondre à l'interface NodeStats
    const formattedStats = {
      pubkey: currentStats.pubkey,
      alias: currentStats.alias,
      platform: currentStats.platform,
      version: currentStats.version,
      total_fees: currentStats.total_fees,
      avg_fee_rate_ppm: currentStats.avg_fee_rate_ppm,
      total_capacity: currentStats.total_capacity,
      active_channels: currentStats.active_channel_count,
      total_volume: currentStats.total_volume,
      total_peers: currentStats.total_peers,
      uptime: currentStats.uptime,
      opened_channel_count: currentStats.opened_channel_count,
      color: currentStats.color,
      address: currentStats.address,
      closed_channel_count: currentStats.closed_channel_count,
      pending_channel_count: currentStats.pending_channel_count,
      avg_capacity: currentStats.avg_capacity,
      avg_fee_rate: currentStats.avg_fee_rate,
      avg_base_fee_rate: currentStats.avg_base_fee_rate,
      last_update: currentStats.timestamp.toISOString()
    };

    return NextResponse.json(formattedStats);
>>>>>>> efd30f0 (Fix: Correction du nom de champ active_channel_count à active_channels pour correspondre à l'interface NodeStats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    
    let statusCode = 503;
    let errorMessage = 'Erreur lors de la récupération des statistiques';
    
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      if (error.message.includes('MONGODB_URI n\'est pas définie')) {
        errorMessage = 'Configuration MongoDB manquante. Vérifiez les variables d\'environnement.';
      } else if (error.message.includes('503') || error.message.includes('indisponible')) {
        errorMessage = 'Le service externe est temporairement indisponible. Veuillez réessayer plus tard.';
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Timeout lors de la connexion au service. Veuillez réessayer plus tard.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 