import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Feature {
  text: string;
}

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: Feature[];
  bonusFeatures?: Feature[];
}

const ProductCard = ({ title, subtitle, price, features, bonusFeatures }: ProductCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.price}>{price}</Text>
        {features.map((feature, index) => (
          <Text key={index} style={styles.feature}>{feature.text}</Text>
        ))}
      </View>

      {bonusFeatures && (
        <View style={styles.bonusSection}>
          <Text style={styles.bonusTitle}>Bonus inclus :</Text>
          {bonusFeatures.map((feature, index) => (
            <Text key={index} style={styles.bonusFeature}>{feature.text}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  feature: {
    marginBottom: 8,
  },
  bonusSection: {
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    padding: 16,
  },
  bonusTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  bonusFeature: {
    marginBottom: 4,
  },
});

export default ProductCard; 