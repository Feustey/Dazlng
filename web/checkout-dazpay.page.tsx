"use client";
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CheckoutDazpayPage(): React.ReactElement {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    if (!form.fullName || !form.email || !form.address || !form.city || !form.postalCode || !form.country) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setShowPayment(true);
  };

  const product = {
    name: 'Dazpay',
    priceEur: 49,
    priceSats: 170000,
    quantity: 1,
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
        product,
        total: product.priceSats * product.quantity,
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

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout Dazpay</h1>
      {paymentSuccess ? (
        <div className="text-center text-green-500 text-lg font-semibold">
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          <div className="mt-2 text-gray-700">Vous recevrez un email de confirmation sous peu.</div>
        </div>
      ) : showPayment ? (
        <>
          <h2 className="text-xl font-semibold mb-3">Récapitulatif de la commande</h2>
          <ul className="mb-4 text-gray-700">
            <li><b>Produit :</b> {product.name}</li>
            <li><b>Prix :</b> {product.priceEur}€ (~{product.priceSats} sats)</li>
            <li><b>Quantité :</b> {product.quantity}</li>
            <li><b>Total :</b> {product.priceEur * product.quantity}€</li>
          </ul>
          <h3 className="text-lg font-medium mb-2">Informations client</h3>
          <ul className="mb-6 text-gray-700">
            <li><b>Nom :</b> {form.fullName}</li>
            <li><b>Email :</b> {form.email}</li>
            <li><b>Adresse :</b> {form.address}, {form.city}, {form.postalCode}, {form.country}</li>
            <li><b>Téléphone :</b> {form.phone}</li>
          </ul>
          {/* Remplacer par le composant de paiement réel */}
          <button onClick={handlePaymentSuccess} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold text-lg transition mb-4">Simuler le paiement</button>
          <button className="w-full text-red-500 hover:underline mt-2" onClick={() => setShowPayment(false)}>
            &larr; Modifier les informations
          </button>
          {error && <div className="text-red-500 mt-3">{error}</div>}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nom complet*</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Email*</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Adresse*</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Ville*</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Code postal*</label>
            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Pays*</label>
            <input type="text" name="country" value={form.country} onChange={handleChange} required className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <div>
            <label className="block font-medium mb-1">Téléphone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 focus:border-orange-500" />
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-3 rounded-lg transition">Procéder au paiement</button>
          {error && <div className="text-red-500 mt-3">{error}</div>}
        </form>
      )}
    </div>
  );
} 