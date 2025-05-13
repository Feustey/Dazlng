import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Colors from '../../../constants/Colors';
import { cardShadow } from '../../../constants/Shadows';

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
  iconColor = Colors.primary,
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
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    ...cardShadow,
    flex: 1,
    minWidth: 250,
    maxWidth: 350,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
}); 