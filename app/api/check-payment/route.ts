import { NextResponse } from 'next/server';
import { logger } from '@/src/utils/logger';

export async function POST(request: Request) {
  try {
    const { paymentHash } = await request.json();

    // Vérification du paiement avec l'API Lightning
    const response = await fetch(`${process.env.LIGHTNING_API_URL}/v1/invoice/${paymentHash}`, {
      headers: {
        'X-Api-Key': process.env.LIGHTNING_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    
    logger.info('Payment status checked:', { paymentHash, status: data.settled });

    return NextResponse.json({ settled: data.settled });
  } catch (error) {
    logger.error('Error checking payment:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
} 