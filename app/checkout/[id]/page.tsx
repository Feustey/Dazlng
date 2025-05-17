"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';

const PRODUCTS: Record<string, { name: string; price: number; available: boolean; description: string }> = {
  '1': { name: 'dazbox', price: 300000, available: true, description: 'Paiement unique' },
  '2': { name: 'dazia', price: 100000, available: true, description: 'Abonnement annuel' },
  '3': { name: 'dazpay', price: 0, available: false, description: 'Bientôt disponible' },
};

export default function CheckoutPage() {
  const params = useParams();
  const id = params?.id as string;
  const [paymentRequest, setPaymentRequest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !PRODUCTS[id]) {
      setError('Produit non trouvé');
      setLoading(false);
      return;
    }
    if (!PRODUCTS[id].available) {
      setError('Ce produit n\'est pas encore disponible.');
      setLoading(false);
      return;
    }
    const fetchInvoice = async () => {
      try {
        const res = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: PRODUCTS[id].price,
            description: PRODUCTS[id].name,
          }),
        });
        const data = await res.json();
        if (data.paymentRequest) {
          setPaymentRequest(data.paymentRequest);
        } else {
          setError('Erreur lors de la création de la facture');
        }
      } catch (e) {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!paymentRequest) return <div>Impossible de générer la facture.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h1>Paiement pour {PRODUCTS[id].name}</h1>
      <p>{PRODUCTS[id].description}</p>
      <p>Montant : {PRODUCTS[id].price} sats</p>
      <div style={{ background: 'white', padding: 16, display: 'inline-block' }}>
        <QRCode value={paymentRequest} size={256} />
      </div>
      <p style={{ wordBreak: 'break-all', marginTop: 16 }}>{paymentRequest}</p>
    </div>
  );
} 