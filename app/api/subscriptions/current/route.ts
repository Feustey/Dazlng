import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

async function getUserFromRequest(req: NextRequest): Promise<{ id: string } | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { id: user.id } : null;
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

    // Simulation des données d'abonnement
    const mockSubscription: Subscription = {
      id: `sub_${user.id}`,
      userId: user.id,
      planId: 'free',
      planName: 'Gratuit',
      status: 'active',
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
      data: mockSubscription
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