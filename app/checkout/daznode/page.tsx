"use client";
import React, { useState, Suspense } from 'react';
import LightningPayment from '../../../components/web/LightningPayment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product') || '';
  const amount = searchParams.get('amount') || '';

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
  const [useAsBilling, setUseAsBilling] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const supabase = createClientComponentClient();

  const isFormValid = () => {
    return (
      form.firstName &&
      form.lastName &&
      form.email &&
      form.address &&
      form.city &&
      form.postalCode &&
      form.country
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Détails de la commande
  const productDetails = {
    name: product,
    priceEur: parseFloat(amount),
    priceSats: 300000, // Toujours 300 000 sats pour Dazbox version simplifiée
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
    <div className={styles.checkoutContainer} style={{maxWidth: '900px', flexDirection: 'row', display: 'flex', gap: '32px'}}>
      <div style={{flex: 2}}>
        <h1 className={styles.checkoutTitle}>Expédition</h1>
        <form className={styles.formSection} autoComplete="on" style={{gap: 0}}>
          <div style={{display: 'flex', gap: '16px'}}>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label>Prénom*<br />
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className={styles.inputField} />
              </label>
            </div>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label>Nom*<br />
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={styles.inputField} />
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Email*<br />
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup} style={{width: '100%'}}>
            <label>Adresse*<br />
              <input type="text" name="address" value={form.address} onChange={handleChange} required className={styles.inputField} style={{width: '100%'}} />
            </label>
            <button type="button" style={{marginTop: 4, fontSize: '0.95em', color: '#5d5dfc', background: 'none', border: 'none', cursor: 'pointer'}} onClick={() => setForm(f => ({...f, address2: ''}))}>Ajouter une ligne</button>
            {form.address2 !== undefined && (
              <input type="text" name="address2" value={form.address2} onChange={handleChange} placeholder="Complément d'adresse" className={styles.inputField} style={{marginTop: 4, width: '100%'}} />
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Pays*<br />
              <select name="country" value={form.country} onChange={handleChange} required className={styles.inputField}>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="États-Unis">États-Unis</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
            </label>
          </div>
          <div style={{display: 'flex', gap: '16px'}}>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label>Ville*<br />
                <input type="text" name="city" value={form.city} onChange={handleChange} required className={styles.inputField} />
              </label>
            </div>
            <div className={styles.formGroup} style={{flex: 1}}>
              <label>Code postal*<br />
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required className={styles.inputField} />
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Téléphone<br />
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className={styles.inputField} />
            </label>
          </div>
          <div className={styles.formGroup} style={{marginTop: 8}}>
            <label style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <input type="checkbox" checked={useAsBilling} onChange={() => setUseAsBilling(v => !v)} style={{accentColor: '#5d5dfc'}} />
              Utiliser comme adresse de facturation
            </label>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </form>
      </div>
      <div className={styles.recapSection} style={{flex: 1, minWidth: 260, maxWidth: 340, alignSelf: 'flex-start'}}>
        <h2 className={styles.orderRecapTitle}>Résumé</h2>
        <ul className={styles.orderRecapList}>
          <li style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>{productDetails.name}</span>
            <span><b>{productDetails.priceSats.toLocaleString('fr-FR')} sats</b></span>
          </li>
        </ul>
        <div style={{fontSize: '1.3rem', fontWeight: 600, margin: '18px 0 8px 0', color: '#5d5dfc'}}>Total : {productDetails.priceSats.toLocaleString('fr-FR')} sats</div>
        {showLightning ? (
          <LightningPayment
            amount={productDetails.priceSats}
            productName={productDetails.name}
            onSuccess={handlePaymentSuccess}
          />
        ) : (
          <button
            className={styles.inputField}
            style={{marginTop: 18, background: '#5d5dfc', color: '#fff', fontWeight: 600, cursor: 'pointer'}}
            disabled={!isFormValid()}
            onClick={e => { e.preventDefault(); if (isFormValid()) setShowLightning(true); }}
          >
            Paiement (afficher le QR code)
          </button>
        )}
        {/* Bloc Paiement Lightning (affiché après validation dans la version complète) */}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <CheckoutContent />
    </Suspense>
  );
} 