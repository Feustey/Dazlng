import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';
import { sendEmail } from '../../utils/email';

interface OrderDetails {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export default function CheckoutScreen() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulons des détails de commande (à remplacer par vos données réelles)
  const orderDetails: OrderDetails = {
    items: [
      { id: '1', name: 'Produit 1', price: 29.99, quantity: 2 },
      { id: '2', name: 'Produit 2', price: 19.99, quantity: 1 },
    ],
    total: 79.97,
  };

  const handleCheckout = async () => {
    if (!form.fullName || !form.email || !form.address || !form.city || !form.postalCode || !form.phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Email de confirmation pour le client
      const customerResult = await sendEmail({
        to: form.email,
        subject: 'Confirmation de votre commande - DAZ3',
        html: `
          <h2>Merci pour votre commande !</h2>
          <p>Cher(e) ${form.fullName},</p>
          <p>Nous avons bien reçu votre commande. Voici un récapitulatif :</p>
          
          <h3>Détails de la commande :</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Produit</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Quantité</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">Prix</th>
            </tr>
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.price.toFixed(2)}€</td>
              </tr>
            `).join('')}
            <tr style="background-color: #f8f9fa;">
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>Total</strong></td>
              <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>${orderDetails.total.toFixed(2)}€</strong></td>
            </tr>
          </table>

          <h3>Adresse de livraison :</h3>
          <p>
            ${form.fullName}<br>
            ${form.address}<br>
            ${form.postalCode} ${form.city}
          </p>

          <p>Nous vous contacterons bientôt pour la livraison.</p>
          <p>Cordialement,<br>L'équipe DAZ3</p>
        `
      });

      // Email pour l'administrateur
      const adminResult = await sendEmail({
        to: 'admin@.com', // Remplacez par votre email d'administration
        subject: `Nouvelle commande de ${form.fullName}`,
        html: `
          <h2>Nouvelle commande reçue</h2>
          <h3>Informations client :</h3>
          <p>
            <strong>Nom :</strong> ${form.fullName}<br>
            <strong>Email :</strong> ${form.email}<br>
            <strong>Téléphone :</strong> ${form.phone}<br>
            <strong>Adresse :</strong> ${form.address}<br>
            <strong>Code postal :</strong> ${form.postalCode}<br>
            <strong>Ville :</strong> ${form.city}
          </p>

          <h3>Détails de la commande :</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${orderDetails.items.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;">${item.price.toFixed(2)}€</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>Total</strong></td>
              <td style="padding: 10px; text-align: right; border: 1px solid #dee2e6;"><strong>${orderDetails.total.toFixed(2)}€</strong></td>
            </tr>
          </table>
        `
      });

      if (customerResult.success && adminResult.success) {
        Alert.alert(
          'Succès',
          'Votre commande a été confirmée. Vous recevrez un email de confirmation.',
          [{ text: 'OK', onPress: () => {
            setForm({ fullName: '', email: '', address: '', city: '', postalCode: '', phone: '' });
            // Ici, vous pouvez ajouter la navigation vers une page de confirmation ou le panier
          }}]
        );
      } else {
        throw new Error('Échec de l\'envoi des emails de confirmation');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la confirmation de la commande. Veuillez réessayer.');
      console.error('Erreur lors de l\'envoi des emails:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Finaliser la commande',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Informations de livraison</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={(text) => setForm({ ...form, fullName: text })}
              placeholder="Votre nom complet"
              placeholderTextColor={Colors.gray[400]}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              placeholder="Votre numéro de téléphone"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
              placeholder="Votre adresse"
              placeholderTextColor={Colors.gray[400]}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1, { marginRight: 10 }]}>
              <Text style={styles.label}>Code postal</Text>
              <TextInput
                style={styles.input}
                value={form.postalCode}
                onChangeText={(text) => setForm({ ...form, postalCode: text })}
                placeholder="Code postal"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(text) => setForm({ ...form, city: text })}
                placeholder="Ville"
                placeholderTextColor={Colors.gray[400]}
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={styles.orderSummary}>
            <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>
            {orderDetails.items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)}€</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{orderDetails.total.toFixed(2)}€</Text>
            </View>
          </View>

          <Pressable 
            style={[styles.button, isSubmitting && styles.buttonDisabled]} 
            onPress={handleCheckout}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.secondary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondary,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.secondary,
  },
  orderSummary: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.secondary,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    flex: 2,
    color: Colors.secondary,
  },
  itemQuantity: {
    flex: 1,
    textAlign: 'center',
    color: Colors.gray[600],
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
    color: Colors.secondary,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 