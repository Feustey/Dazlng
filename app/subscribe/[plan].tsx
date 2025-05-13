import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import FormInput from '../../components/shared/ui/FormInput';
import FeaturesList from '../../components/shared/ui/FeaturesList';

const plans = {
  gratuit: {
    name: 'Gratuit',
    price: '0€',
    features: ['Statistiques de base'],
  },
  standard: {
    name: 'Standard',
    price: '9€/mois',
    features: ['Statistiques de base', 'Routage optimisé'],
  },
  premium: {
    name: 'Premium',
    price: '29€/mois',
    features: [
      'Statistiques de base',
      'Routage optimisé',
      'Intégration Amboss',
      'Sparkseer',
      'Alertes Telegram',
      'Auto-rebalancing',
    ],
  },
  'ai-addon': {
    name: 'Module IA',
    price: '10€/mois',
    features: ['Prédiction des fee rates', 'Optimisation automatique'],
  },
};

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export default function SubscribeScreen() {
  const { plan } = useLocalSearchParams();
  const planDetails = plans[plan as keyof typeof plans];

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const handleSubmit = () => {
    // Ici, nous implémenterons l'inscription
    console.log('Subscription submitted:', { plan, ...form });
  };

  if (!planDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Plan non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: `Inscription ${planDetails.name}`,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.planHeader}>
          <Text style={styles.title}>{planDetails.name}</Text>
          <Text style={styles.price}>{planDetails.price}</Text>
        </View>

        <FeaturesList features={planDetails.features} />

        <View style={styles.form}>
          <FormInput
            label="Nom complet"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="Votre nom"
          />

          <FormInput
            label="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Entreprise"
            value={form.company}
            onChangeText={(text) => setForm({ ...form, company: text })}
            placeholder="Nom de votre entreprise"
            optional
          />

          <FormInput
            label="Téléphone"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
            placeholder="Votre numéro de téléphone"
            keyboardType="phone-pad"
            optional
          />

          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
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
  planHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  form: {
    gap: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
}); 