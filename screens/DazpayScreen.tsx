import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function DazpayScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DazPay</Text>
        <Text style={styles.subtitle}>
          Solution de paiement Lightning pour les commerces
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <StatItem label="Transactions (24h)" value="42" />
          <StatItem label="Volume (24h)" value="123 456 sats" />
          <StatItem label="Commission moyenne" value="0.5%" />
          <StatItem label="Temps moyen" value="2.3s" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fonctionnalités</Text>
          <View style={styles.featureList}>
            <FeatureItem text="Terminal de paiement web" />
            <FeatureItem text="Application mobile (bientôt)" />
            <FeatureItem text="Tableau de bord détaillé" />
            <FeatureItem text="Intégration API" />
            <FeatureItem text="Support multidevises" />
          </View>
        </View>

        <View style={styles.pricingCard}>
          <Text style={styles.cardTitle}>Offres</Text>
          
          <View style={styles.planContainer}>
            <View style={styles.plan}>
              <Text style={styles.planName}>Basic</Text>
              <Text style={styles.planPrice}>Gratuit</Text>
              <Text style={styles.planDetail}>1% de commission</Text>
            </View>

            <View style={[styles.plan, styles.planPremium]}>
              <Text style={styles.planName}>Premium</Text>
              <Text style={styles.planPrice}>30 000 sats/mois</Text>
              <Text style={styles.planDetail}>0.5% de commission</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Passer Premium</Text>
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
  pricingCard: {
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
  planContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  plan: {
    flex: 1,
    backgroundColor: Colors.gray[800],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  planPremium: {
    backgroundColor: Colors.primary,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  planDetail: {
    fontSize: 14,
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