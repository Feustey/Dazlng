"use client";
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DazboxCheckoutPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!form.fullName || !form.email || !form.address || !form.city || !form.postalCode || !form.country) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setShowPayment(true);
  };

  const product = {
    name: 'Dazbox',
    priceEur: 399,
    priceSats: 1300000,
    quantity: 1,
  };

  const handlePaymentSuccess = async () => {
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
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Checkout Dazbox</h1>
      {paymentSuccess ? (
        <div style={{ textAlign: 'center', color: '#22c55e', fontSize: 20 }}>
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          Vous recevrez un email de confirmation sous peu.
        </div>
      ) : showPayment ? (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Récapitulatif de la commande</h2>
          <ul style={{ marginBottom: 16 }}>
            <li><b>Produit :</b> {product.name}</li>
            <li><b>Prix :</b> {product.priceEur}€ (~{product.priceSats} sats)</li>
            <li><b>Quantité :</b> {product.quantity}</li>
            <li><b>Total :</b> {product.priceEur * product.quantity}€</li>
          </ul>
          <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Informations client</h3>
          <ul style={{ marginBottom: 24 }}>
            <li><b>Nom :</b> {form.fullName}</li>
            <li><b>Email :</b> {form.email}</li>
            <li><b>Adresse :</b> {form.address}, {form.city}, {form.postalCode}, {form.country}</li>
            <li><b>Téléphone :</b> {form.phone}</li>
          </ul>
          {/* Remplacer par le composant de paiement réel */}
          <button onClick={handlePaymentSuccess} style={{ background: '#22c55e', color: '#fff', padding: 12, borderRadius: 6, fontWeight: 600, fontSize: 18, border: 'none', cursor: 'pointer' }}>Simuler le paiement</button>
          <button style={{ marginTop: 24, color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowPayment(false)}>
            &larr; Modifier les informations
          </button>
          {error && <div style={{ color: '#e11d48', marginTop: 12 }}>{error}</div>}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Nom complet*<br />
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email*<br />
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Adresse*<br />
              <input type="text" name="address" value={form.address} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Ville*<br />
              <input type="text" name="city" value={form.city} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Code postal*<br />
              <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Pays*<br />
              <input type="text" name="country" value={form.country} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Téléphone<br />
              <input type="text" name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            </label>
          </div>
          <button type="submit" style={{ width: '100%', background: '#f7931a', color: '#fff', fontWeight: 600, fontSize: 18, padding: 12, border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Procéder au paiement
          </button>
          {error && <div style={{ color: '#e11d48', marginTop: 12 }}>{error}</div>}
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5vw',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1A2236',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    maxWidth: 400,
  },
  button: {
    background: '#1A2236',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 8,
    padding: '14px 32px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
    boxShadow: 'none',
    marginTop: 8,
  },
}; 