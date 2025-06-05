import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/utils/auth';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  features: string[];
  autoRenew: boolean;
  paymentMethod?: string;
  nextPaymentDate?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Non autorisé'
        }
      }, { status: 401 });
    }

    // Pour l'instant, utiliser directement le mock car il n'y a pas encore de vraie table subscriptions
    // En attendant la création d'abonnements réels, on simule un plan gratuit
    const realSubscription = null;

    // Si pas d'abonnement réel, utiliser le mock
    const subscription = realSubscription || {
      id: `sub_${user.id}`,
      userId: user.id,
      planId: 'free',
      planName: 'Gratuit',
      status: 'active' as const,
      startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      price: 0,
      currency: 'EUR',
      features: [
        'Statistiques de base',
        'Connexion de nœud',
        'Support communautaire'
      ],
      autoRenew: true
    };

    return NextResponse.json<ApiResponse<Subscription>>({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 });
  }
} 