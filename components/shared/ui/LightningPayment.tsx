import { useState, useEffect } from 'react';
import { Text, View, Alert, Platform, StyleSheet, Pressable } from 'react-native';
import { generateInvoice, checkPayment } from '../../../lib/lightning';

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
        console.log('WebLN non disponible:', err);
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
  const checkPaymentStatus = async (paymentHash: string) => {
    try {
      const isPaid = await checkPayment(paymentHash);
      
      if (isPaid) {
        setPaymentStatus('success');
        if (onSuccess) onSuccess();
      } else if (paymentStatus === 'pending') {
        // Réessayer dans 5 secondes
        setTimeout(() => checkPaymentStatus(paymentHash), 5000);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du paiement:', err);
      setError(`Erreur lors de la vérification du paiement: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

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
              <img 
                src={`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(invoice.paymentRequest)}`} 
                alt="QR Code Lightning" 
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amount: {
    marginBottom: 16,
  },
  qrContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
  },
  errorText: {
    color: '#ef4444',
  },
  successText: {
    color: '#22c55e',
  },
  albyButton: {
    backgroundColor: '#eab308',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  walletButton: {
    backgroundColor: '#22c55e',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
}); 