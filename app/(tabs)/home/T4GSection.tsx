import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const T4GSection = () => {
  const rewardCategories = [
    {
      title: "Mentoring",
      description: "Aidez les nouveaux utilisateurs à démarrer avec Lightning",
      points: "100 points"
    },
    {
      title: "Feedback",
      description: "Partagez votre expérience et suggestions d'amélioration",
      points: "50 points"
    },
    {
      title: "Installation Commerçants",
      description: "Aidez un commerçant à accepter le Bitcoin",
      points: "200 points"
    },
    {
      title: "Articles & Contenu",
      description: "Créez du contenu éducatif pour la communauté",
      points: "150 points"
    }
  ];

  const rewards = [
    "Réduction sur l'abonnement Daznode",
    "Merchandising exclusif",
    "Badge de réputation",
    "Frais réduits sur DazPay"
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Token For Good (T4G)</Text>
      <Text style={styles.subtitle}>Contribuez à la communauté, gagnez des récompenses</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment gagner des points</Text>
        {rewardCategories.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <Text style={styles.points}>{category.points}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilisez vos points pour</Text>
        {rewards.map((reward, index) => (
          <Text key={index} style={styles.reward}>• {reward}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    color: '#666',
    marginBottom: 8,
  },
  points: {
    color: '#0070f3',
    fontWeight: '500',
  },
  reward: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default T4GSection; 