"use client";

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DaznodeCheckoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Daznode</Text>
      <Text style={styles.text}>Bienvenue sur la page de paiement Daznode (mobile).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
}); 