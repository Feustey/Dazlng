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

    // Retourner les données directement depuis le modèle History
    const currentStats = stats[0];
    return NextResponse.json({
      id: currentStats.id,
      date: currentStats.date,
      price: currentStats.price,
      volume: currentStats.volume,
      marketCap: currentStats.marketCap,
      createdAt: currentStats.createdAt,
      updatedAt: currentStats.updatedAt
    });
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