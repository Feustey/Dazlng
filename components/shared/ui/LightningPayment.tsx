"use client";

import { useState, useEffect, useCallback } from 'react';
import { Text, View, Alert, Platform, StyleSheet, Pressable } from 'react-native';
import { generateInvoice, checkPayment } from '../../../lib/lightning';
import Colors from '../../../constants/Colors';
import Image from 'next/image';

interface LightningPaymentProps {
  amount: number;
  onSuccess?: () => void;
  productName: string;
}

declare global {
  interface Window {
    webln?: {
      enable: () => Promise<void>;
      sendPayment: (paymentRequest: string) => Promise<{ preimage: string }>;
    };
  }
}

export default function LightningPayment({ amount, onSuccess, productName }: LightningPaymentProps) {
  const [invoice, setInvoice] = useState<{ paymentRequest: string; paymentHash: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si WebLN est disponible (extension Alby installée)
  useEffect(() => {
    const checkWebLN = async () => {
      try {
        setIsLoading(true);
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.webln) {
          await window.webln.enable();
          setIsWebLNAvailable(true);
        }
      } catch (err) {
        // console.log('WebLN non disponible:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkWebLN();
  }, []);

  // Générer l'invoice au chargement du composant
  useEffect(() => {
    const createInvoice = async () => {
      try {
        setIsLoading(true);
        const invoiceData = await generateInvoice({
          amount: amount,
          memo: `Paiement pour ${productName}`,
        });
        
        setInvoice(invoiceData);
        
        // Commencer à vérifier l'état du paiement
        if (invoiceData.paymentHash) {
          checkPaymentStatus(invoiceData.paymentHash);
        }
      } catch (err) {
        setError(`Erreur lors de la génération de la facture: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      } finally {
        setIsLoading(false);
      }
    };

    createInvoice();
  }, [amount, productName]);

  // Fonction pour vérifier l'état du paiement
  const checkPaymentStatus = useCallback(async (paymentHash: string) => {
    try {
      const isPaid = await checkPayment(paymentHash);
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else if (paymentStatus === 'pending') {
        setTimeout(() => checkPaymentStatus(paymentHash), 5000);
      }
    } catch (err) {
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [onSuccess, paymentStatus]);

  // Fonction pour payer avec WebLN (Alby extension)
  const payWithWebLN = async () => {
    if (!invoice || !window.webln) return;

    try {
      setIsLoading(true);
      await window.webln.enable();
      
      const result = await window.webln.sendPayment(invoice.paymentRequest);
      
      if (result.preimage) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(`Erreur de paiement WebLN: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoice?.paymentHash) {
      checkPaymentStatus(invoice.paymentHash);
    }
  }, [checkPaymentStatus, invoice]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement en cours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>Paiement réussi! Merci pour votre achat.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paiement Bitcoin Lightning</Text>
      <Text style={styles.amount}>Montant: {amount} sats</Text>
      
      {invoice && (
        <>
          {/* QR Code pour paiement mobile */}
          <View style={styles.qrContainer}>
            {Platform.OS === 'web' && (
              <Image 
                src={`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(invoice.paymentRequest)}`}
                alt="QR Code Lightning"
                width={250}
                height={250}
                style={styles.qrCode}
              />
            )}
          </View>
          
          {/* Bouton WebLN pour desktop avec Alby */}
          {isWebLNAvailable && Platform.OS === 'web' && (
            <Pressable 
              onPress={payWithWebLN}
              style={styles.albyButton}
            >
              <Text style={styles.buttonText}>Payer avec Alby</Text>
            </Pressable>
          )}
          
          {/* Bouton pour copier l'invoice */}
          <Pressable 
            onPress={() => {
              if (Platform.OS === 'web') {
                navigator.clipboard.writeText(invoice.paymentRequest);
                Alert.alert('Succès', 'Facture copiée dans le presse-papier');
              }
            }}
            style={styles.copyButton}
          >
            <Text style={styles.buttonText}>Copier la facture Lightning</Text>
          </Pressable>
          
          {/* Lien de secours pour ouvrir avec un wallet Lightning */}
          <Pressable 
            onPress={() => {
              if (Platform.OS === 'web') {
                window.location.href = `lightning:${invoice.paymentRequest}`;
              }
            }}
            style={styles.walletButton}
          >
            <Text style={styles.buttonText}>Ouvrir avec un Wallet Lightning</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 28,
    backgroundColor: '#232336cc',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    maxWidth: 440,
    marginHorizontal: 'auto',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  amount: {
    marginBottom: 16,
    color: Colors.text,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  qrContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  successText: {
    color: Colors.success,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
  },
  albyButton: {
    backgroundColor: Colors.secondary,
    padding: 14,
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.secondary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  copyButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  walletButton: {
    backgroundColor: Colors.success,
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  buttonText: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
}); 