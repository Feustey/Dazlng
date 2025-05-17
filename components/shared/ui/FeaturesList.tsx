import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

interface FeaturesListProps {
  title?: string;
  features: string[];
  backgroundColor?: string;
}

export default function FeaturesList({
  title = 'Fonctionnalités incluses :',
  features,
  backgroundColor = '#232336cc',
}: FeaturesListProps) {
  return (
    <View style={[styles.container, { backgroundColor, borderColor: Colors.secondary }]}>
      <Text style={styles.title}>{title}</Text>
      {features.map((feature, index) => (
        <Text 
          key={index} 
          style={styles.feature}
          accessibilityRole="text"
        >
          • {feature}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 15,
    color: Colors.secondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
    textAlign: 'center',
  },
}); 