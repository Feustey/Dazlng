import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({
  title,
  subtitle,
}: HeroSectionProps) {
  return (
    <View style={[styles.container, { backgroundColor: '#232336cc', borderColor: Colors.secondary }]}>
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
    padding: 32,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.muted,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 