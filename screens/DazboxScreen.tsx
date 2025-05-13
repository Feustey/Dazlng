import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function DazboxScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DazBox</Text>
        <Text style={styles.subtitle}>
          Votre nœud Lightning clé en main
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Caractéristiques</Text>
          <View style={styles.featureList}>
            <FeatureItem text="Processeur ARM 4 cœurs" />
            <FeatureItem text="8 Go de RAM" />
            <FeatureItem text="SSD 500 Go" />
            <FeatureItem text="Connexion Ethernet Gigabit" />
            <FeatureItem text="Alimentation USB-C" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inclus</Text>
          <View style={styles.featureList}>
            <FeatureItem text="Node Lightning préconfiguré" />
            <FeatureItem text="3 mois d'abonnement DazNode Premium" />
            <FeatureItem text="Support technique prioritaire" />
            <FeatureItem text="Garantie 2 ans" />
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Commander - 290 000 sats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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