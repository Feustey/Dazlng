import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '../../../constants/Colors';
import { cardShadow } from '../../../constants/Shadows';

export interface PricingCardProps {
  title: string;
  price?: string;
  features?: string[];
  description?: string;
  buttonText: string;
  onPress: () => void;
  variant?: 'plan' | 'addon';
}

export default function PricingCard({
  title,
  price,
  features,
  description,
  buttonText,
  onPress,
  variant = 'plan',
}: PricingCardProps) {
  return (
    <View style={[styles.card, variant === 'addon' && styles.addonCard]}>
      <Text style={variant === 'plan' ? styles.planName : styles.addonTitle}>
        {title}
      </Text>
      {price && (
        <Text style={styles.price}>{price}</Text>
      )}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      {features && features.map((feature, index) => (
        <Text key={index} style={styles.feature}>
          • {feature}
        </Text>
      ))}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    ...cardShadow,
  },
  addonCard: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: Colors.gray[600],
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.gray[800],
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
}); 