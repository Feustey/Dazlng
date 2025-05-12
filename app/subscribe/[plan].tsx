import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';

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

export default function SubscribeScreen() {
  const { plan } = useLocalSearchParams();
  const planDetails = plans[plan as keyof typeof plans];

  const [form, setForm] = useState({
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

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Fonctionnalités incluses :</Text>
          {planDetails.features.map((feature, index) => (
            <Text key={index} style={styles.feature}>• {feature}</Text>
          ))}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Votre nom"
              placeholderTextColor={Colors.gray[400]}
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entreprise (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={form.company}
              onChangeText={(text) => setForm({ ...form, company: text })}
              placeholder="Nom de votre entreprise"
              placeholderTextColor={Colors.gray[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              placeholder="Votre numéro de téléphone"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="phone-pad"
            />
          </View>

          <Pressable style={styles.button} onPress={handleSubmit}>
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
  features: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.secondary,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.gray[700],
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
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
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
}); 