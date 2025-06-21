"use client";
import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LightningPayment } from '@/components/shared/ui/LightningPayment';
import 'aos/dist/aos.css';

// Configuration dynamique des plans DazBox
const DAZBOX_PLANS = {
  starter: {
    name: 'DazBox Starter',
    type: 'dazbox',
    priceSats: 400000
  },
  pro: {
    name: 'DazBox Pro',
    type: 'dazbox',
    priceSats: 500000
  }
} as const;

type Plan = keyof typeof DAZBOX_PLANS;

interface CheckoutState {
  status: 'idle' | 'paid' | 'expired' | 'error';
  error?: string;
  orderId?: string;
}

function CheckoutContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') as Plan;
  const plan = DAZBOX_PLANS[planParam] ? planParam : 'starter';
  const selectedPlan = DAZBOX_PLANS[plan];
  
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ status: 'idle' });

  useEffect(() => {
    const initAOS = async () => {
      if (typeof window !== 'undefined') {
        const aos = await import('aos');
        aos.init({ 
          once: true,
          duration: 800,
          easing: 'ease-out-cubic',
        });
      }
    };
    initAOS();
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    toast.success('Paiement réussi ! Vous allez être redirigé.');
    setCheckoutState(prev => ({ ...prev, status: 'paid' }));
    router.push('/checkout/success');
  }, [router]);

  const handlePaymentError = useCallback((error: Error) => {
    toast.error(error.message || 'Une erreur est survenue lors du paiement.');
    setCheckoutState({ status: 'error', error: error.message });
  }, []);

  const handlePaymentExpired = useCallback(() => {
    toast.error('La facture a expiré. Veuillez en générer une nouvelle.');
    setCheckoutState(prev => ({ ...prev, status: 'expired' }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full mx-auto" data-aos="fade-up">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Paiement {selectedPlan.name}
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Finalisez votre commande en procédant au paiement via le Lightning Network.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <LightningPayment
                amount={selectedPlan.priceSats}
                description={`Abonnement ${selectedPlan.name}`}
                metadata={{
                  product_type: 'dazbox',
                  plan: plan,
                }}
                onPaid={handlePaymentSuccess}
                onError={handlePaymentError}
                onExpired={handlePaymentExpired}
              />
            </div>

            {checkoutState.status === 'error' && (
              <div className="mt-6 text-center text-red-500">
                <p>Erreur: {checkoutState.error}</p>
                <button 
                  onClick={() => setCheckoutState({ status: 'idle' })}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          DazBox &copy; {new Date().getFullYear()} - Paiement sécurisé
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p>Chargement...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
} 