"use client";
import React, { useState, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { getPubkeyError } from '../../../utils/validation';

function CheckoutContent(): React.ReactElement {
  const [form, setForm] = useState({
    email: '',
    pubkey: '',
  });
  const [pubkeyError, setPubkeyError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isSigningWithNode, setIsSigningWithNode] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

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
    );
  };

  const BASE_PRICE_SATS = 80000;
  const PROMO_CODE = 'BITCOINWEEK';
  const DISCOUNT_PERCENTAGE = 10;
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const getPrice = (): number => {
    let price = BASE_PRICE_SATS;
    if (isAnnual) {
      price = BASE_PRICE_SATS * 12;
    }
    if (promoApplied) {
      return Math.round(price * (1 - DISCOUNT_PERCENTAGE / 100));
    }
    return price;
  };

  const productDetails = {
    name: 'DazNode',
    priceSats: getPrice(),
    quantity: 1,
    isAnnual: isAnnual
  };

  const applyPromoCode = (): void => {
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
    }
  };

  const handlePaymentSuccess = async (txId: string): Promise<void> => {
    setTransactionId(txId);
    setPaymentSuccess(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    let userId = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: userId,
        customer: form,
        product: {
          ...productDetails,
          promoApplied: promoApplied,
          promoCode: promoApplied ? promoCode : null,
          discountPercentage: promoApplied ? DISCOUNT_PERCENTAGE : 0,
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

  // Simule la récupération de la pubkey via signature LN (à remplacer par une vraie intégration plus tard)
  const handleNodeSign = async (): Promise<void> => {
    // Ici, on simule la récupération d'une pubkey après signature
    // Dans la vraie vie, il faudrait ouvrir un modal, générer un message, demander la signature LN, puis vérifier côté serveur
    // Pour la démo, on met une pubkey factice
    const fakePubkey = '02abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefab';
    setForm({ ...form, pubkey: fakePubkey });
    setPubkeyError(null);
    setIsSigningWithNode(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    // ... code existant (à adapter si besoin)
  };

  if (showLightning) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Paiement Lightning</h1>
        <LightningPayment 
          amount={getPrice()} 
          productName={`DazNode${isAnnual ? ' (Abonnement Annuel)' : ''}`}
          onSuccess={(txId: string) => handlePaymentSuccess(txId)}
          onCancel={() => setShowLightning(false)}
        />
      </div>
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Souscrire à DazNode</h1>
          <p className="text-gray-600">Finalisez votre abonnement en quelques étapes simples</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsSigningWithNode(false)}
              className={`px-4 py-2 rounded ${!isSigningWithNode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Saisie manuelle
            </button>
            <button
              onClick={() => setIsSigningWithNode(true)}
              className={`px-4 py-2 rounded ${isSigningWithNode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Signer avec mon nœud
            </button>
          </div>

          {isSigningWithNode ? (
            <div className="space-y-4">
              <p className="mb-4 text-gray-700">
                Générez un message à signer avec votre nœud Lightning pour prouver que vous en êtes le propriétaire.<br/>
                (Démo : clique sur le bouton pour simuler la récupération de la pubkey)
              </p>
              <button
                onClick={handleNodeSign}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                Récupérer la pubkey via mon nœud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email}
                  onChange={handleChange}
                  required 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé publique Lightning*
                </label>
                <input 
                  type="text" 
                  name="pubkey" 
                  value={form.pubkey}
                  onChange={handlePubkeyChange}
                  required 
                  placeholder="02xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${pubkeyError ? 'border-red-500' : ''}`}
                />
                {pubkeyError && (
                  <p className="mt-1 text-sm text-red-600">{pubkeyError}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Votre clé publique Lightning Network pour recevoir les paiements
                </p>
              </div>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <span>Paiement Lightning</span>
                <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 9l-6 6 1.41 1.41L11 12.83l4.59 4.58L17 16l-6-6z" />
                  <path d="M11 4L5 10l1.41 1.41L11 7.83l4.59 4.58L17 11l-6-6z" />
                </svg>
              </button>
              <p className="text-xs text-center mt-4 text-gray-500">Paiement 100% sécurisé via Bitcoin Lightning Network</p>
            </form>
          )}
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Résumé</h2>
          <div className="flex items-center mb-6">
            <div>
              <h3 className="font-semibold text-lg">DazNode</h3>
              <p className="text-sm text-white/80">Votre nœud Lightning dans le cloud</p>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <span>Formule</span>
            <div className="flex flex-col items-end">
              <div className="flex space-x-2 bg-white/10 rounded-lg p-1.5">
                <button 
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-indigo-800' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setIsAnnual(false)}
                >
                  Mensuel
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${isAnnual ? 'bg-white text-indigo-800' : 'text-white/70 hover:text-white'}`}
                  onClick={() => setIsAnnual(true)}
                >
                  Annuel
                </button>
              </div>
              <span className="text-xs text-yellow-300 mt-1">{isAnnual ? '12 mois prépayés' : 'Paiement mensuel'}</span>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <span>Prix</span>
            <span className="font-semibold">
              {(isAnnual ? BASE_PRICE_SATS * 12 : BASE_PRICE_SATS).toLocaleString('fr-FR')} sats
              {isAnnual && <span className="text-xs text-white/60 ml-1">({BASE_PRICE_SATS.toLocaleString('fr-FR')} × 12)</span>}
            </span>
          </div>
          <div className="mb-4">
            <div className="relative mt-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code promo"
                className="w-full rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 pr-24 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button 
                onClick={() => applyPromoCode()} 
                className="absolute right-1 top-1 bg-yellow-400 text-gray-800 px-3 py-1 rounded font-medium text-sm"
              >
                Appliquer
              </button>
            </div>
            <p className="text-sm text-yellow-300 mt-1">Essayez "BITCOINWEEK" pour -10% !</p>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-white/20 pt-4 mb-6">
            <span>Total</span>
            <span className="text-yellow-300">{getPrice().toLocaleString('fr-FR')} sats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page(): JSX.Element {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
} 