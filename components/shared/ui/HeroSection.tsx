import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundColor?: string;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundColor = Colors.primary,
}: HeroSectionProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.subtitle} accessibilityRole="text">
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
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
}); 