"use client";

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function DazpayCheckoutScreen(): React.ReactElement {
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

  const handleChange = (name: string, value: string): void => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (): void => {
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
    // Version mobile : pas d'auth, enregistre la commande sans user_id
    const res = await fetch('https://dazno.de/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: null,
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
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Dazpay</Text>
      {paymentSuccess ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: '#22c55e', fontSize: 18 }}>Paiement réussi ! Merci pour votre commande.</Text>
          {orderId && <Text>Numéro de commande : <Text style={{ fontWeight: 'bold' }}>{orderId}</Text></Text>}
          <Text>Vous recevrez un email de confirmation sous peu.</Text>
        </View>
      ) : showPayment ? (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontWeight: 'bold' }}>Récapitulatif :</Text>
          <Text>Produit : {product.name}</Text>
          <Text>Prix : {product.priceEur}Sats (~{product.priceSats} sats)</Text>
          <Text>Quantité : {product.quantity}</Text>
          <Text>Total : {product.priceEur * product.quantity}Sats</Text>
          <Button title="Simuler le paiement" onPress={handlePaymentSuccess} color="#22c55e" />
          <Button title="Modifier les infos" onPress={() => setShowPayment(false)} color="#e11d48" />
          {error && <Text style={{ color: '#e11d48', marginTop: 12 }}>{error}</Text>}
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          <TextInput style={styles.input} placeholder="Nom complet*" value={form.fullName} onChangeText={v => handleChange('fullName', v)} />
          <TextInput style={styles.input} placeholder="Email*" value={form.email} onChangeText={v => handleChange('email', v)} />
          <TextInput style={styles.input} placeholder="Adresse*" value={form.address} onChangeText={v => handleChange('address', v)} />
          <TextInput style={styles.input} placeholder="Ville*" value={form.city} onChangeText={v => handleChange('city', v)} />
          <TextInput style={styles.input} placeholder="Code postal*" value={form.postalCode} onChangeText={v => handleChange('postalCode', v)} />
          <TextInput style={styles.input} placeholder="Pays*" value={form.country} onChangeText={v => handleChange('country', v)} />
          <TextInput style={styles.input} placeholder="Téléphone" value={form.phone} onChangeText={v => handleChange('phone', v)} />
          <Button title="Procéder au paiement" onPress={handleSubmit} color="#f7931a" />
          {error && <Text style={{ color: '#e11d48', marginTop: 12 }}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
}); 