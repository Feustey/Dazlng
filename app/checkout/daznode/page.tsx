"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LightningCheckout } from '@/components/checkout/LightningCheckout';

interface Plan {
  name: string;
  price: number;
  features: string[];
}

const plans: Record<string, Plan> = {
  starter: {
    name: "Starter",
    price: 50000,
    features: [
      "1 node Lightning",
      "Monitoring IA 24/7",
      "Prédiction force-close",
      "Dashboard temps réel",
      "Support email"
    ]
  },
  pro: {
    name: "Pro",
    price: 150000,
    features: [
      "3 nodes Lightning",
      "Optimisation routing automatique",
      "Alertes WhatsApp/Telegram",
      "Support prioritaire",
      "DazBox incluse"
    ]
  },
  enterprise: {
    name: "Enterprise",
    price: 400000,
    features: [
      "Nodes illimités",
      "API access complète",
      "Support 24/7",
      "Configuration sur-mesure",
      "SLA 99.9%"
    ]
  }
};

function DazNodeCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && plans[planParam]) {
      setSelectedPlan(plans[planParam]);
    } else {
      // Default to Pro plan if no plan specified
      setSelectedPlan(plans.pro);
    }
    setLoading(false);
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    // Redirect to success page or dashboard
    router.push('/user?payment=success');
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    // Could redirect to error page or show error modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan non trouvé</h1>
          <p className="text-gray-600 mb-6">Le plan demandé n'existe pas.</p>
          <button
            onClick={() => router.push('/daznode')}
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Retour aux plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/daznode')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Retour à DazNode
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Checkout DazNode</h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <LightningCheckout
          plan={selectedPlan}
          amount={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>Paiement sécurisé via Lightning Network • Commission 1% incluse</p>
            <p className="mt-2">
              Questions ? Contactez-nous à{' '}
              <a href="mailto:support@daznode.com" className="text-yellow-600 hover:text-yellow-500">
                support@daznode.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DazNodeCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    }>
      <DazNodeCheckoutContent />
    </Suspense>
  );
}
