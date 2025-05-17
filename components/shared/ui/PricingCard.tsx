import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Colors from '../../../constants/Colors';

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
    backgroundColor: Colors.background,
    borderRadius: 28,
    padding: 32,
    marginBottom: 28,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
        transition: 'box-shadow 0.2s',
      },
    }),
  },
  addonCard: {
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  planName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  addonTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 8,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  price: {
    fontSize: 32,
    color: Colors.secondary,
    fontWeight: '700',
    marginBottom: 18,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  description: {
    fontSize: 17,
    marginBottom: 18,
    color: Colors.muted,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  feature: {
    fontSize: 16,
    marginBottom: 6,
    color: Colors.text,
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    ...Platform.select({
      web: {
        transition: 'background 0.2s, color 0.2s',
        cursor: 'pointer',
      },
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({ web: 'Inter, sans-serif', default: 'System' }),
    letterSpacing: 0.2,
  },
}); 