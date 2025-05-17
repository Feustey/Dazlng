"use client";
import React, { useState } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product');
  const amount = searchParams.get('amount');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const isFormValid = () => {
    return (
      form.fullName &&
      form.email &&
      form.address &&
      form.city &&
      form.postalCode &&
      form.country
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Détails de la commande
  const productDetails = {
    name: product,
    priceEur: parseFloat(amount),
    priceSats: parseFloat(amount) * 1000000, // à ajuster selon le taux
    quantity: 1,
  };

  // Enregistre la commande dans la base après paiement
  const handlePaymentSuccess = async () => {
    setError(null);
    setPaymentSuccess(true);
    // Récupère le user connecté (si connecté)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    let userId = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }
    // Appel API pour enregistrer la commande
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        user_id: userId,
        customer: form,
        product: productDetails,
        total: productDetails.priceSats * productDetails.quantity,
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

  if (!product || !amount) {
    return <div>Produit ou montant manquant. Merci de revenir à la page d'accueil.</div>;
  }

  if (paymentSuccess) {
    return (
      <div className={styles.checkoutContainer}>
        <h1 className={styles.checkoutTitle}>Merci pour votre commande !</h1>
        <div className={styles.successMessage}>
          Paiement réussi ! Merci pour votre commande.<br />
          {orderId && <div>Numéro de commande : <b>{orderId}</b></div>}
          Vous recevrez un email de confirmation sous peu.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Checkout pour {product}</h1>
      <p>Montant à régler : <strong>{amount} €</strong></p>
      <div className={styles.onePageGrid}>
        <form className={styles.formSection} autoComplete="on">
          <div className={styles.formGroup}>
            <label>Nom complet*<br />
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Email*<br />
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Adresse*<br />
              <input type="text" name="address" value={form.address} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Ville*<br />
              <input type="text" name="city" value={form.city} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Code postal*<br />
              <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Pays*<br />
              <input type="text" name="country" value={form.country} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>Téléphone<br />
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className={styles.inputField} />
            </label>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </form>
        <div className={styles.recapSection}>
          <h2 className={styles.orderRecapTitle}>Récapitulatif de la commande</h2>
          <ul className={styles.orderRecapList}>
            <li><b>Produit :</b> {productDetails.name}</li>
            <li><b>Prix :</b> {productDetails.priceEur}€ (~{productDetails.priceSats} sats)</li>
            <li><b>Quantité :</b> {productDetails.quantity}</li>
            <li><b>Total :</b> {productDetails.priceEur * productDetails.quantity}€</li>
          </ul>
          <h3 className={styles.clientInfoTitle}>Informations client</h3>
          <ul className={styles.clientInfoList}>
            <li><b>Nom :</b> {form.fullName}</li>
            <li><b>Email :</b> {form.email}</li>
            <li><b>Adresse :</b> {form.address}, {form.city}, {form.postalCode}, {form.country}</li>
            <li><b>Téléphone :</b> {form.phone}</li>
          </ul>
          <LightningPayment
            amount={productDetails.priceSats}
            productName={productDetails.name}
            onSuccess={handlePaymentSuccess}
            disabled={!isFormValid()}
          />
          {!isFormValid() && (
            <div className={styles.errorMessage}>
              Merci de remplir tous les champs obligatoires pour procéder au paiement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 