import { NextRequest, NextResponse } from 'next/server';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    nodes: number;
    apiCalls: number;
    storage: string;
  };
  popular?: boolean;
  trialDays?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const plans: Plan[] = [
      {
        id: 'free',
        name: 'Gratuit',
        description: 'Parfait pour commencer',
        price: 0,
        currency: 'SATS',
        interval: 'month',
        features: [
          'Connexion d\'un nœud',
          'Statistiques de base',
          'Support communautaire',
          'Alertes par email'
        ],
        limits: {
          nodes: 1,
          apiCalls: 1000,
          storage: '100 MB'
        }
      },
      {
        id: 'basic',
        name: 'Basic',
        description: 'Optimisation et statistiques avancées',
        price: 10000,
        currency: 'SATS',
        interval: 'month',
        features: [
          'Tout du plan Gratuit',
          'Optimisation automatique des frais',
          'Statistiques avancées',
          'Recommandations IA',
          'Alertes temps réel',
          'Support prioritaire'
        ],
        limits: {
          nodes: 3,
          apiCalls: 10000,
          storage: '1 GB'
        },
        trialDays: 14
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Toutes les fonctionnalités + IA avancée',
        price: 30000,
        currency: 'SATS',
        interval: 'month',
        features: [
          'Tout du plan Basic',
          'IA avancée pour optimisation',
          'Rééquilibrage automatique',
          'Analyse prédictive',
          'API complète',
          'Intégrations tierces',
          'Support 24/7',
          'Rapports personnalisés'
        ],
        limits: {
          nodes: 10,
          apiCalls: 100000,
          storage: '10 GB'
        },
        popular: true,
        trialDays: 30
      },
      {
        id: 'enterprise',
        name: 'Business',
        description: 'Solution sur mesure pour les entreprises avec commissions réduites',
        price: 15000,
        currency: 'SATS',
        interval: 'month',
        features: [
          'Tout du plan Premium',
          'Nœuds illimités',
          'API illimitée',
          'Commissions réduites à 0,5%',
          'Support dédié',
          'Intégration sur mesure',
          'SLA garantis',
          'Formation équipe',
          'Déploiement on-premise'
        ],
        limits: {
          nodes: -1, // Illimité
          apiCalls: -1, // Illimité
          storage: 'Illimité'
        }
      }
    ];

    return NextResponse.json<ApiResponse<Plan[]>>({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 });
  }
}
