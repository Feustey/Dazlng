import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

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
    backgroundColor: Colors.background,
    borderRadius: 28,
    padding: 32,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    margin: 12,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 8,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.muted,
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: 16,
  },
  feature: {
    marginBottom: 8,
    color: Colors.text,
    fontSize: 15,
  },
  bonusSection: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginTop: 8,
  },
  bonusTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.secondary,
    textAlign: 'center',
  },
  bonusFeature: {
    marginBottom: 4,
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProductCard; 