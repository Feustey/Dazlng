import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Bienvenue dans l'écosystème Daz</Text>
        <Text style={styles.subtitle}>
          Découvrez nos solutions innovantes pour la finance décentralisée
        </Text>
      </View>

      <View style={styles.productsContainer}>
        <ProductCard
          title="DazNode"
          description="Pilotez vos revenus passifs grâce à l'IA"
          price="30 000 sats/mois"
          onPress={() => alert('DazNode sélectionné')}
        />

        <ProductCard
          title="DazBox"
          description="Votre nœud clé en main, prêt à l'emploi"
          price="290 000 sats"
          onPress={() => alert('DazBox sélectionné')}
        />

        <ProductCard
          title="DazPay"
          description="Le terminal de paiement nouvelle génération"
          price="30 000 sats/mois"
          onPress={() => alert('DazPay sélectionné')}
        />
      </View>
    </ScrollView>
  );
}

function ProductCard({ title, description, price, onPress }: {
  title: string;
  description: string;
  price: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={styles.cardPrice}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[300],
    textAlign: 'center',
  },
  productsContainer: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: Colors.gray[900],
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: Colors.gray[300],
    marginBottom: 12,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
}); 