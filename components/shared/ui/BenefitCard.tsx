import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '../../../constants/Colors';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconSize?: number;
}

export default function BenefitCard({
  icon: IconComponent,
  title,
  description,
  iconColor = Colors.secondary,
  iconSize = 32,
}: BenefitCardProps) {
  return (
    <View style={styles.container}>
      <IconComponent size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
    flex: 1,
    minWidth: 250,
    maxWidth: 350,
    margin: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.secondary,
    marginTop: 16,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
}); 