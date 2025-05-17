import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Zap, Shield, Award } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../constants/Colors';
import { RootStackParamList } from '../../../types/navigation';
import { cardShadow } from '../../../constants/Shadows';
import Hero from '../../../components/shared/ui/Hero';
import BenefitCard from '../../../components/shared/ui/BenefitCard';

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: Record<string, unknown>) => void;
};

const products = [
  {
    id: 'dazbox',
    title: 'Dazbox',
    subtitle: 'Votre nœud Lightning plug & play',
    description: 'Installez, branchez, profitez. La solution matérielle la plus simple pour rejoindre le réseau Lightning.',
    price: '299€',
    bonus: '3 mois Daznode Premium offerts',
  },
  {
    id: 'daznode',
    title: 'Daznode',
    subtitle: 'Optimisation et contrôle avancé',
    description: 'Pilotez votre nœud Lightning avec des outils professionnels : statistiques, routage optimisé, alertes.',
    price: 'Dès 9€/mois',
    bonus: 'Version gratuite disponible',
  },
  {
    id: 'dazpay',
    title: 'DazPay',
    subtitle: 'Paiement Commerçants',
    description: 'Terminal Lightning simple avec interface d\'encaissement et dashboard. Solution complète pour accepter les paiements Bitcoin.',
    price: '1% par transaction',
    bonus: 'Option Pro : 0.5% + 15€/mois',
  },
];

const benefits = [
  {
    icon: Zap,
    title: 'Installation Facile',
    description: 'Branchez et rejoignez le réseau Lightning en quelques minutes.',
  },
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Sécurité de niveau entreprise protégeant votre nœud et vos fonds.',
  },
  {
    icon: Award,
    title: 'Gagnez des Commissions',
    description: 'Générez des revenus passifs en routant des paiements.',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Hero
        title="DazBox"
        subtitle="Your Plug & Play Lightning Node"
        imageUrl="https://images.pexels.com/photos/6781008/pexels-photo-6781008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        buttonText="Get Started"
        onButtonPress={() => navigation.navigate('Main', { screen: 'Dazbox' })}
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Participez au Futur de Bitcoin</Text>
        <Text style={styles.sectionDescription}>
          Rejoignez la révolution du réseau Lightning avec notre nœud pré-configuré. Renforcez l'écosystème Bitcoin et gagnez des commissions sans expertise technique requise.
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        {benefits.map((benefit, index) => (
          <View key={index}>
            <BenefitCard
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              iconColor="#F7931A"
            />
          </View>
        ))}
      </View>

      <View style={styles.daziaSectionContainer}>
        <Text style={styles.sectionTitle}>Propulsé par Dazia</Text>
        <Text style={styles.sectionDescription}>
          Notre moteur d'optimisation IA assure que votre nœud est toujours configuré pour une rentabilité et une efficacité réseau maximales.
        </Text>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.daziaImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.productsSection}>
        {products.map((product) => (
          <Pressable 
            key={product.id} 
            onPress={() => navigation.navigate('Main', { screen: product.id === 'dazbox' ? 'Dazbox' : product.id === 'daznode' ? 'Daznode' : 'Dazpay' })}
            style={styles.productCard}
          >
            <View style={styles.productContent}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productSubtitle}>{product.subtitle}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <Text style={styles.productBonus}>{product.bonus}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
        <Text style={styles.ctaText}>
          Choisissez la solution qui correspond à vos besoins et rejoignez la révolution Lightning
        </Text>
        <Pressable 
          style={styles.secondaryCtaButton}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.secondaryCtaButtonText}>Contactez-nous</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    lineHeight: 24,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 12,
  },
  daziaSectionContainer: {
    padding: 20,
  },
  daziaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 20,
  },
  productsSection: {
    padding: 20,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 20,
    ...cardShadow,
  },
  productContent: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
  },
  productBonus: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  ctaSection: {
    backgroundColor: Colors.white,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  secondaryCtaButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  secondaryCtaButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});