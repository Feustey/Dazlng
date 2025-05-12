import React, { useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions, Pressable } from 'react-native';
import { ArrowRight, Zap, Shield, Award } from 'lucide-react-native';
import { Link } from 'expo-router';
import Colors from '../../constants/Colors';
import { AppRoutes } from '../../types/navigation';
import { cardShadow } from '../../constants/Shadows';

type ProductId = keyof AppRoutes['(tabs)'];

const products: Array<{
  id: ProductId;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  bonus: string;
}> = [
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

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View style={[
        styles.heroContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }]
        }
      ]}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/6781008/pexels-photo-6781008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>DazBox</Text>
          <Text style={styles.heroSubtitle}>Your Plug & Play Lightning Node</Text>
          <TouchableOpacity style={styles.mainCtaButton}>
            <Text style={styles.mainCtaButtonText}>Get Started</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Be Part of Bitcoin's Future</Text>
        <Text style={styles.sectionDescription}>
          Join the Lightning Network revolution with our pre-configured node. Strengthen the Bitcoin ecosystem and earn commissions with zero technical expertise required.
        </Text>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitCard}>
          <Zap size={32} color="#F7931A" />
          <Text style={styles.benefitTitle}>Easy Setup</Text>
          <Text style={styles.benefitText}>Plug in and go live on the Lightning Network in minutes, not days.</Text>
        </View>
        
        <View style={styles.benefitCard}>
          <Shield size={32} color="#F7931A" />
          <Text style={styles.benefitTitle}>Secure</Text>
          <Text style={styles.benefitText}>Enterprise-grade security protecting your node and funds.</Text>
        </View>
        
        <View style={styles.benefitCard}>
          <Award size={32} color="#F7931A" />
          <Text style={styles.benefitTitle}>Earn Commissions</Text>
          <Text style={styles.benefitText}>Generate passive income through routing payments.</Text>
        </View>
      </View>

      <View style={styles.daziaSectionContainer}>
        <Text style={styles.sectionTitle}>Powered by Dazia</Text>
        <Text style={styles.sectionDescription}>
          Our AI optimization engine ensures your node is always configured for maximum profitability and network efficiency.
        </Text>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.daziaImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.productsSection}>
        {products.map((product) => (
          <Link key={product.id} href={product.id === 'index' ? '/' : `/(tabs)/${product.id}`} asChild>
            <Pressable style={styles.productCard}>
              <View style={styles.productContent}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productSubtitle}>{product.subtitle}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productBonus}>{product.bonus}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
        <Text style={styles.ctaText}>
          Choisissez la solution qui correspond à vos besoins et rejoignez la révolution Lightning
        </Text>
        <Link href="/contact" asChild>
          <Pressable style={styles.secondaryCtaButton}>
            <Text style={styles.secondaryCtaButtonText}>Contactez-nous</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  heroContainer: {
    position: 'relative',
    height: 420,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 25,
    textAlign: 'center',
  },
  mainCtaButton: {
    flexDirection: 'row',
    backgroundColor: '#F7931A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  mainCtaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionContainer: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  benefitsContainer: {
    flexDirection: 'column',
    padding: 15,
    marginTop: 10,
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    ...cardShadow,
    alignItems: 'flex-start',
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginTop: 10,
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  daziaSectionContainer: {
    padding: 20,
    marginTop: 10,
  },
  daziaImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 15,
  },
  productsSection: {
    padding: 20,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 20,
    ...cardShadow,
    overflow: 'hidden',
  },
  productContent: {
    padding: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productSubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  productBonus: {
    fontSize: 14,
    color: Colors.success,
  },
  ctaSection: {
    padding: 20,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  secondaryCtaButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});