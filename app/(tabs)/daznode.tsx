import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Colors from '../../constants/Colors';
import { cardShadow } from '../../constants/Shadows';

export default function DaznodeScreen() {
  const plans = [
    {
      id: 'gratuit',
      name: 'Gratuit',
      price: '0€',
      features: ['Statistiques de base'],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '9€/mois',
      features: ['Statistiques de base', 'Routage optimisé'],
    },
    {
      id: 'premium',
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
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.mainTitle}>Daznode : Optimisez, surveillez, maîtrisez votre activité Lightning</Text>
        <Text style={styles.subtitle}>
          Profitez d'une plateforme intelligente pour piloter vos canaux Lightning : statistiques avancées, routage optimisé, alertes personnalisées et intégrations puissantes.
        </Text>
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            {plan.features.map((feature, featureIndex) => (
              <Text key={featureIndex} style={styles.feature}>• {feature}</Text>
            ))}
            <Link href={`/subscribe/${plan.id}`} asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Choisir {plan.name}</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>

      {/* Add-ons Section */}
      <View style={styles.addonsSection}>
        <Text style={styles.sectionTitle}>Modules complémentaires</Text>
        <View style={styles.addonCard}>
          <Text style={styles.addonTitle}>Module IA - Prédiction des fee rates</Text>
          <Text style={styles.addonPrice}>10€/mois</Text>
          <Link href="/subscribe/ai-addon" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Ajouter</Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.addonCard}>
          <Text style={styles.addonTitle}>Intégrations personnalisées</Text>
          <Text style={styles.addonDescription}>Wallets ou Telegram bots sur mesure</Text>
          <Link href="/contact" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Nous contacter</Text>
            </Pressable>
          </Link>
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
  heroSection: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 24,
  },
  pricingSection: {
    padding: 20,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    ...cardShadow,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
  },
  addonsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addonCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  addonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addonPrice: {
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 15,
  },
  addonDescription: {
    fontSize: 16,
    marginBottom: 15,
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
}); 