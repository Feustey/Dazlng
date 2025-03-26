import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const historyModule = {
  async GET() {
    try {
      const history = await prisma.history.findMany({
        orderBy: {
          date: 'desc'
        },
        take: 30 // Limite aux 30 derniers jours
      });

      return NextResponse.json(history);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'historique' },
        { status: 500 }
      );
    }
  }
};

export default historyModule; 