import { NextResponse } from 'next/server';
import { logger } from '@/src/utils/logger';

export async function POST(request: Request) {
  try {
    const { amount, description } = await request.json();

    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      );
    }

    // Création de la facture avec l'API Lightning
    const response = await fetch(`${process.env.LIGHTNING_API_URL}/v1/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.LIGHTNING_API_KEY || '',
      },
      body: JSON.stringify({
        amount,
        description,
        expiry: 3600, // 1 heure
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }

    const data = await response.json();
    
    logger.info('Invoice created:', { amount, description, paymentHash: data.payment_hash });

    return NextResponse.json({
      paymentRequest: data.payment_request,
      paymentHash: data.payment_hash,
    });
  } catch (error) {
    logger.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
} 