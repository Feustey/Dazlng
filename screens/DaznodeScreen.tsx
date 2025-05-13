import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function DaznodeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DazNode</Text>
        <Text style={styles.subtitle}>
          Pilotez votre nœud Lightning avec l'IA
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <StatItem label="Balance" value="1 234 567 sats" />
          <StatItem label="Canaux actifs" value="42" />
          <StatItem label="Capacité totale" value="50M sats" />
          <StatItem label="Revenus (30j)" value="12 345 sats" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fonctionnalités Premium</Text>
          <View style={styles.featureList}>
            <FeatureItem text="Routage optimisé par IA" />
            <FeatureItem text="Intégration Amboss" />
            <FeatureItem text="Alertes Telegram" />
            <FeatureItem text="Rééquilibrage automatique" />
            <FeatureItem text="Support prioritaire" />
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Passer Premium - 30 000 sats/mois</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureText}>• {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[100],
  },
  content: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: Colors.gray[900],
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  statItem: {
    flex: 1,
    minWidth: 150,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[400],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.gray[900],
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: Colors.gray[300],
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
}); 