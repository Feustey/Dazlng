"use client";
import React, { useState, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const [error, setError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const supabase = createClientComponentClient();

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
      setError(null);
    } else {
      setError('Code promo invalide');
    }
  };

  const handlePaymentSuccess = async (): Promise<void> => {
    setError(null);
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
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrderId(data.id);
    } else {
      setError("Erreur lors de l'enregistrement de la commande.");
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-[480px] mx-auto my-12 p-8 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl flex flex-col gap-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Merci pour votre commande !</h1>
        <div className="text-center text-green-500 text-lg bg-green-100/10 rounded-xl p-4 mt-4">
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          Vous recevrez un email de confirmation sous peu.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] flex flex-col md:flex-row gap-8 mx-auto my-12 p-6 bg-[rgba(20,20,40,0.85)] rounded-[24px] shadow-2xl">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 text-center">Commander votre DazBox</h1>
        <form className="flex flex-col gap-4" autoComplete="on">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-semibold">Prénom*<br />
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
              </label>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-semibold">Nom*<br />
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email*<br />
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
            </label>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="font-semibold">Adresse*<br />
              <input type="text" name="address" value={form.address} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
            </label>
            <button type="button" className="mt-1 text-sm text-[#5d5dfc] bg-none border-none cursor-pointer" onClick={() => setForm(f => ({...f, address2: ''}))}>Ajouter une ligne</button>
            {form.address2 !== undefined && (
              <input type="text" name="address2" value={form.address2} onChange={handleChange} placeholder="Complément d'adresse" className="mt-1 p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Pays*<br />
              <select name="country" value={form.country} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]">
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="États-Unis">États-Unis</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
            </label>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-semibold">Ville*<br />
                <input type="text" name="city" value={form.city} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
              </label>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-semibold">Code postal*<br />
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Téléphone<br />
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="p-3 rounded-lg bg-[#18182c] text-white text-base w-full outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]" />
            </label>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <label className="flex items-center gap-2 font-medium">
              <input type="checkbox" checked={useAsBilling} onChange={() => setUseAsBilling(v => !v)} className="accent-[#5d5dfc]" />
              Utiliser comme adresse de facturation
            </label>
          </div>
          {error && <div className="text-[#ff5a5a] bg-[#ff5a5a14] rounded-lg p-3 mt-4 text-center text-base">{error}</div>}
        </form>
      </div>
      <div className="flex-1 min-w-[260px] max-w-[340px] self-start bg-white/10 rounded-2xl p-6 mt-4 text-[#eaeaff] text-base shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-white">Résumé</h2>
        <ul className="mb-4 pl-0 list-none">
          <li className="flex justify-between">
            <span>{productDetails.name}</span>
            <span><b>{BASE_PRICE_SATS.toLocaleString('fr-FR')} sats</b></span>
          </li>
          {promoApplied && (
            <li className="flex justify-between text-green-400 mt-2">
              <span>Réduction ({DISCOUNT_PERCENTAGE}%)</span>
              <span>-{(BASE_PRICE_SATS * DISCOUNT_PERCENTAGE / 100).toLocaleString('fr-FR')} sats</span>
            </li>
          )}
        </ul>
        {!promoApplied && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)} 
                placeholder="Code promo" 
                className="p-2 rounded-lg bg-[#18182c] text-white text-sm flex-1 outline-none transition-shadow shadow-sm focus:shadow-[0_0_0_2px_#5d5dfc]"
              />
              <button 
                onClick={() => applyPromoCode()} 
                className="px-3 py-2 bg-[#5d5dfc] text-white text-sm font-semibold rounded-lg hover:bg-[#4a3dfc]"
              >
                Appliquer
              </button>
            </div>
            <div className="text-xs mt-1 text-yellow-200">Essayez "BITCOINWEEK" pour -10% !</div>
          </div>
        )}
        <div className="text-lg font-bold my-4 text-[#5d5dfc]">
          Total : {productDetails.priceSats.toLocaleString('fr-FR')} sats
        </div>
        {showLightning ? (
          <LightningPayment
            amount={productDetails.priceSats}
            productName={productDetails.name}
            onSuccess={handlePaymentSuccess}
          />
        ) : (
          <button
            className="mt-4 w-full p-3 rounded-lg bg-[#5d5dfc] text-white font-semibold text-base cursor-pointer transition hover:bg-[#4a3dfc] disabled:opacity-50"
            disabled={!isFormValid()}
            onClick={e => { e.preventDefault(); if (isFormValid()) setShowLightning(true); }}
          >
            Paiement (afficher le QR code)
          </button>
        )}
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