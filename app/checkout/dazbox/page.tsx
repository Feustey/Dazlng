"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'react-hot-toast';
import { LightningPayment } from '@/components/shared/ui/LightningPayment';

// ✅ Configuration centralisée
const _PRODUCT_CONFIG = {
  DAZBOX: {
    name: 'DazBox',
    type: 'dazbox' as const,
    basePriceBTC: 0.004,
    get basePriceSats(): number { return Math.round(this.basePriceBTC * 100000000); }
  }
} as const;

// Configuration dynamique des plans DazBox
const DAZBOX_PLANS = {
  starter: {
    name: 'DazBox Starter',
    type: 'dazbox',
    priceSats: 400_000
  },
  pro: {
    name: 'DazBox Pro',
    type: 'dazbox',
    priceSats: 500_000
  }
};

// ✅ Validation Zod
const _CheckoutFormSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  address: z.string().min(1, 'L\'adresse est requise'),
  address2: z.string().optional(),
  city: z.string().min(1, 'La ville est requise'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
  phone: z.string().optional(),
});

interface CheckoutState {
  status: 'idle' | 'creating_order' | 'generating_invoice' | 'waiting_payment' | 'paid' | 'expired' | 'error';
  error?: string;
  invoice?: {
    paymentRequest: string;
    paymentHash: string;
    amount: number;
  };
  orderId?: string;
  qrCode?: string;
  orderRef?: string; // Pour le support
}

interface _FormData {
  name: string;
  email: string;
  address?: string;
  plan: 'basic' | 'premium' | 'enterprise';
}

const PLAN_AMOUNTS = {
  basic: 50000,     // 50k sats
  premium: 100000,  // 100k sats
  enterprise: 500000 // 500k sats
} as const;

function CheckoutContent(): React.ReactElement {
  const { user: _user, session: _session } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'starter';
  const _selectedPlan = DAZBOX_PLANS[plan] || DAZBOX_PLANS.starter;
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ status: 'idle' });

  // Hooks pour l'UX
  const _isOnline = useNetworkStatus();
  const _isMobile = useMediaQuery('(max-width: 768px)');

  // ✅ Initialiser AOS une seule fois
  useEffect(() => {
    let aos: typeof import('aos') | undefined;
    const initAOS = async (): Promise<void> => {
      if (typeof window !== 'undefined') {
        aos = await import('aos');
        aos.init({ 
          once: true, // ✅ Animer une seule fois
          duration: 800,
          easing: 'ease-out-cubic',
          mirror: false, // ✅ Pas de re-animation
          anchorPlacement: 'top-bottom'
        });
      }
    };
    
    initAOS();
    
    return () => {
      if (aos) {
        aos.refresh?.();
      }
    };
  }, []);

  // Vérification de paiement
  const verifyPayment = async (orderId: string) => {
    try {
      const order = await fetch('/api/get-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const orderData = await order.json();
      if (orderData.status === 'paid') {
        setCheckoutState(prev => ({ ...prev, status: 'paid' }));
        router.push(`/checkout/success?order=${orderId}`);
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
    }
  };

  useEffect(() => {
    const savedState = localStorage.getItem('lastCheckoutState');
    if (savedState) {
      const { orderId, status } = JSON.parse(savedState);
      if (status === 'waiting_payment') {
        // Vérifier si le paiement a été reçu pendant l'absence
        verifyPayment(orderId);
      }
    }
  }, [verifyPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCheckoutState({ status: 'creating_order' });
      // Appel unique à l'API pour créer commande + facture
      const orderRef = `${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
      const invoiceRes = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: PLAN_AMOUNTS[plan],
          description: `DazBox - ${plan.toUpperCase()} - ${orderRef}`,
          metadata: {
            product_type: 'dazbox',
            customer: {
              name: '',
              email: '',
              address: '',
              plan: plan as 'basic' | 'premium' | 'enterprise'
            },
            plan: plan as 'basic' | 'premium' | 'enterprise',
            billing_cycle: undefined,
            order_ref: orderRef
          }
        })
      });
      const invoiceData = await invoiceRes.json();
      if (!invoiceData.success) throw new Error(invoiceData.error?.message || 'Erreur création facture');
      const invoice = invoiceData.data.invoice;
      const order = invoiceData.data.order;
      setCheckoutState({
        status: 'waiting_payment',
        invoice,
        orderId: order.id,
        orderRef
      });
    } catch (error: any) {
      setCheckoutState({ status: 'error', error: error.message || 'Erreur inconnue' });
    }
  };

  const handleRetry = () => {
    setCheckoutState({ status: 'idle' });
  };

  const renderCheckoutContent = () => {
    switch (checkoutState.status) {
      case 'idle':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Formulaire de paiement */}
            <LightningPayment
              amount={PLAN_AMOUNTS[plan]}
              description={`DazBox ${plan.toUpperCase()}`}
              onPaid={() => {
                setCheckoutState(prev => ({ ...prev, status: 'paid' }));
                router.push('/checkout/success');
              }}
              onError={(error) => {
                setCheckoutState({
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Erreur inconnue'
                });
              }}
              onExpired={() => {
                setCheckoutState(prev => ({ ...prev, status: 'expired' }));
              }}
            />
          </form>
        );

      case 'creating_order':
      case 'generating_invoice':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">
              {checkoutState.status === 'creating_order' 
                ? 'Création de la commande...' 
                : 'Génération de la facture...'}
            </p>
          </div>
        );

      case 'waiting_payment':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            {checkoutState.qrCode && (
              <div className="mb-6">
                <Image
                  src={checkoutState.qrCode}
                  alt="QR Code Lightning"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-mono break-all">
                {checkoutState.invoice?.paymentRequest}
              </p>
            </div>

            <div className="space-y-4 w-full max-w-md">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(checkoutState.invoice?.paymentRequest || '');
                  toast.success('Facture copiée !');
                }}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
              >
                Copier la facture
              </button>

              <button
                onClick={handleRetry}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              En attente du paiement... La page se mettra à jour automatiquement.
              <br/>
              <span className="text-xs">Ne fermez pas cette page</span>
            </p>
          </div>
        );

      case 'paid':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Paiement reçu !</h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre commande. Vous allez être redirigé...
            </p>
          </div>
        );

      case 'expired':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Facture expirée</h2>
            <p className="text-gray-600 mb-6">
              La facture a expiré. Veuillez réessayer.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Réessayer
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">
              {checkoutState.error || 'Une erreur est survenue'}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Réessayer
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Paiement DazBox
            </h1>
            {renderCheckoutContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
} 