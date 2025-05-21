"use client";
import React, { useState, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

function CheckoutContent(): React.ReactElement {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'France',
    phone: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [useAsBilling, setUseAsBilling] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const isFormValid = (): boolean => {
    return Boolean(
      form.firstName &&
      form.lastName &&
      form.email &&
      form.address &&
      form.city &&
      form.postalCode &&
      form.country
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const BASE_PRICE_SATS = 400000;
  const PROMO_CODE = 'BITCOINWEEK';
  const DISCOUNT_PERCENTAGE = 10;

  const getPrice = (): number => {
    if (promoApplied) {
      return Math.round(BASE_PRICE_SATS * (1 - DISCOUNT_PERCENTAGE / 100));
    }
    return BASE_PRICE_SATS;
  };

  const productDetails = {
    name: 'DazBox',
    priceSats: getPrice(),
    quantity: 1,
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

  if (showLightning) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Paiement Lightning</h1>
        <LightningPayment 
          amount={getPrice()} 
          productName="DazBox" 
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Commander votre DazBox</h1>
          <p className="text-gray-600">Finalisez votre commande en quelques étapes simples</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de commande - 2/3 de l'écran sur desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Adresse de livraison</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                <input 
                  type="text" 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complément d'adresse</label>
                <input 
                  type="text" 
                  name="address2" 
                  value={form.address2} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville*</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal*</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={form.postalCode} 
                    onChange={handleChange} 
                    required 
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays*</label>
                <select 
                  name="country" 
                  value={form.country} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="billing" 
                  name="useAsBilling" 
                  checked={useAsBilling} 
                  onChange={(e) => setUseAsBilling(e.target.checked)} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="billing" className="ml-2 block text-sm text-gray-700">
                  Utiliser comme adresse de facturation
                </label>
              </div>
            </div>
          </div>
          
          {/* Récapitulatif commande - 1/3 de l'écran sur desktop */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Résumé</h2>
              
              <div className="flex items-center mb-6">
                <div>
                  <h3 className="font-semibold text-lg">DazBox</h3>
                  <p className="text-sm text-white/80">Votre nœud Lightning personnel</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Prix</span>
                  <span className="font-semibold">{BASE_PRICE_SATS.toLocaleString('fr-FR')} sats</span>
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
                
                <button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  onClick={() => setShowLightning(true)}
                  disabled={!isFormValid()}
                >
                  <span>Paiement Lightning</span>
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 9l-6 6 1.41 1.41L11 12.83l4.59 4.58L17 16l-6-6z" />
                    <path d="M11 4L5 10l1.41 1.41L11 7.83l4.59 4.58L17 11l-6-6z" />
                  </svg>
                </button>
                
                <p className="text-xs text-center mt-4 text-white/70">Paiement 100% sécurisé via Bitcoin Lightning Network</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage(): React.ReactElement {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
} 