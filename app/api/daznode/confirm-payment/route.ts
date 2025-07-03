import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dazNodeSubscriptionService } from '@/lib/services/daznode-subscription-service';
import { dazNodeEmailService } from '@/lib/services/daznode-email-service';

// Schéma de validation
const confirmSchema = z.object({
  payment_hash: z.string().min(1, 'Hash de paiement requis')
});

export async function POST(req: Request) {
  try {
    // Valider les données
    const data = await req.json();
    const { payment_hash } = confirmSchema.parse(data);

    // Confirmer le paiement
    await dazNodeSubscriptionService.confirmPayment(payment_hash);

    // Envoyer l'email de confirmation (sans subscription pour le moment)
    await dazNodeEmailService.sendSubscriptionConfirmation({} as any);

    return NextResponse.json({
      success: true,
      data: { message: 'Paiement confirmé avec succès' }
    });
  } catch (error) {
    console.error('❌ Erreur route /api/daznode/confirm-payment:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données invalides',
          details: error.errors
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'CONFIRMATION_ERROR',
        message: error instanceof Error ? error.message : 'Erreur inattendue'
      }
    }, { status: 400 });
  }
} 
export const dynamic = "force-dynamic";
