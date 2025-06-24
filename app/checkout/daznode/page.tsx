"use client";
import React, { useState, useEffect, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { useSupabase } from '@/app/providers/SupabaseProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPubkeyError } from '../../../utils/validation';

// Configuration des plans DazNode
const DAZNODE_PLANS = {
  professional: {
    name: 'DazNode Professional',
    type: 'daznode',
    priceSats: 10000,
    description: 'Plan professionnel avec IA et analytics'
  },
  enterprise: {
    name: 'DazNode Enterprise',
    type: 'daznode',
    priceSats: 400000,
    description: 'Solution enterprise complète'
  }
} as const;

type Plan = keyof typeof DAZNODE_PLANS;

function CheckoutContent(): React.FC {
  const { user, session } = useSupabase();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    email: '',
    pubkey: '',
  });
  const [_isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [pubkeyError, setPubkeyError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const router = useRouter();

  // Récupération du plan depuis l'URL
  const planFromUrl = searchParams.get('plan') as Plan;
  const selectedPlan = DAZNODE_PLANS[planFromUrl] || DAZNODE_PLANS.professional;

  // Pré-remplissage automatique pour les utilisateurs connectés
  useEffect(() => {
    const loadUserData = async (): Promise<void> => {
      if (user && session?.access_token) {
        setIsLoadingUserData(true);
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setForm(prev => ({
              ...prev,
              email: userData.email || '',
              pubkey: userData.pubkey || ''
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setIsLoadingUserData(false);
        }
      }
    };

    loadUserData();
  }, [user, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePubkeyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setForm({ ...form, pubkey: value });
    setPubkeyError(getPubkeyError(value));
  };

  const isFormValid = (): boolean => {
    return Boolean(
      form.email &&
      form.pubkey &&
      !pubkeyError
};
  };

  const getPrice = (): number => {
    let price = selectedPlan.priceSats;
    if (isAnnual) {
      price = price * 12;
    }
    return price;
  };

  const productDetails = {
    name: selectedPlan.name,
    priceSats: getPrice(),
    quantity: 1,
    isAnnual: isAnnual
  };

  const handlePaymentSuccess = async (txId: string): Promise<void> => {
    setTransactionId(txId);
    setPaymentSuccess(true);
    const token = session?.access_token;
    const userId = user?.id || null;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: userId,
        product_type: selectedPlan.type,
        plan: planFromUrl,
        billing_cycle: isAnnual ? 'yearly' : 'monthly',
        customer: form,
        product: {
          ...productDetails,
          discountPercentage: 0,
        },
        total: productDetails.priceSats,
        status: 'payée',
        transaction_id: txId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrderId(data.id);
      router.push('/checkout/success');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!isFormValid()) return;
    try {
      setShowLightning(true);
      // Création de la commande + facture en un seul appel
      const orderRef = `${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
      const invoiceRes = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getPrice(),
          description: `${selectedPlan.name}${isAnnual ? ' (Abonnement Annuel)' : ''} - ${orderRef}`,
          metadata: {
            product_type: selectedPlan.type,
            customer: form,
            plan: planFromUrl,
            billing_cycle: isAnnual ? 'yearly' : 'monthly',
            order_ref: orderRef
          }
        })
      });
      const invoiceData = await invoiceRes.json();
      if (!invoiceData.success) throw new Error(invoiceData.error?.message || 'Erreur création facture');
    } catch (error) {
      setShowLightning(false);
      console.error('Erreur lors de la création de la facture:', error);
    }
  };

  if (showLightning) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Paiement Lightning</h1>
        <LightningPayment 
          amount={getPrice()} 
          productName={`${selectedPlan.name}${isAnnual ? ' (Abonnement Annuel)' : ''}`}
          onSuccess={(txId: string) => handlePaymentSuccess(txId)}
          onCancel={() => setShowLightning(false)}
        />
      </div>
};
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Merci pour votre commande !</h1>
        <div className="text-center text-green-500 text-lg bg-green-100/10 rounded-xl p-4 mt-4">
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          {transactionId && <div>Transaction ID : <b>{transactionId}</b></div>}
          Vous recevrez un email de confirmation sous peu.
        </div>
      </div>
};
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-2">
            {selectedPlan.name}
          </h1>
          <p className="text-indigo-200">{selectedPlan.description}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-white">
              {getPrice().toLocaleString()} <span className="text-lg text-gray-400">sats</span>
            </div>
            <div className="text-gray-400 mt-2">
              {isAnnual ? 'Abonnement annuel' : 'Abonnement mensuel'}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-xl p-2 flex gap-2">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-lg transition-all ${!isAnnual ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-lg transition-all ${isAnnual ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
              >
                Annuel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="pubkey" className="block text-sm font-medium text-gray-200 mb-2">
                Clé publique Lightning
              </label>
              <input
                type="text"
                id="pubkey"
                name="pubkey"
                value={form.pubkey}
                onChange={handlePubkeyChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="02abc..."
              />
              {pubkeyError && (
                <p className="mt-2 text-sm text-red-400">{pubkeyError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                isFormValid()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Payer avec Lightning
            </button>
          </form>
        </div>
      </div>
    </div>
};
}

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
};
}
