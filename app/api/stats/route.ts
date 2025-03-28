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

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      if (error.message.includes('MONGODB_URI n\'est pas définie')) {
        return NextResponse.json(
          { error: 'Configuration MongoDB manquante. Vérifiez les variables d\'environnement.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 503 }
    );
  }
} 