import { NextResponse } from 'next/server';
import { dazNodeSubscriptionService } from '@/lib/services/daznode-subscription-service';
import { DazNodeSubscriptionSchema } from '@/types/daznode';

export async function POST(req: Request) {
  try {
    // Récupérer et valider les données
    const data = await req.json();
    const validatedData = DazNodeSubscriptionSchema.parse(data);

    // Créer l'abonnement
    const result = await dazNodeSubscriptionService.createSubscription(validatedData);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Erreur route /api/daznode/subscribe:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'SUBSCRIPTION_ERROR',
        message: error instanceof Error ? error.message : 'Erreur inattendue'
      }
    }, { status: 400 });
  }
} 
export const dynamic = "force-dynamic";
