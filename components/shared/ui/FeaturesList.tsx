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
  backgroundColor = Colors.white,
}: FeaturesListProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
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
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  title: {
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
}); 