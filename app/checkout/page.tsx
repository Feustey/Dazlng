"use client";
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [invoice, setInvoice] = useState<any>(null);
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    const createInvoice = async () => {
      const res = await fetch('/api/create-invoice', { method: 'POST' });
      const data = await res.json();
      setInvoice(data);
    };
    createInvoice();
  }, []);

  useEffect(() => {
    if (!invoice?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/check-invoice?id=${invoice.id}`);
      const data = await res.json();
      if (data.is_confirmed) {
        setStatus('paid');
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [invoice]);

  if (status === 'paid') return <div>Paiement confirmé.</div>;
  if (!invoice) return <div>Chargement...</div>;

  return (
    <div>
      <p>Scanne ou copie la facture Lightning :</p>
      <pre>{invoice.request}</pre>
      <p>Status: {status}</p>
    </div>
  );
} 