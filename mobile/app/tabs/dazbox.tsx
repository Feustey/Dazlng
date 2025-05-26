import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import Colors from '../../../constants/Colors';
import { cardShadow } from '../../../constants/Shadows';

type DazboxScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function DazboxScreen(): React.ReactElement {
  const navigation = useNavigation<DazboxScreenNavigationProp>();
  
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.mainTitle}>Dazbox : Votre passerelle plug & play vers l'écosystème Lightning</Text>
        <Text style={styles.subtitle}>Installez, branchez, profitez. Accédez à la puissance du Lightning Network en toute simplicité.</Text>
        
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/dazbox.png')}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text style={styles.disclaimerText}>photo non contractuelle</Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.productSection}>
        <Text style={styles.description}>
          Découvrez la Dazbox, le nœud Lightning prêt à l'emploi. Profitez d'une installation ultra-rapide et d'une expérience sans friction.
        </Text>
        <Text style={styles.bonus}>
          Bonus exclusif : 3 mois d'abonnement Daznode Premium inclus pour explorer tout le potentiel de votre nœud.
        </Text>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Caractéristiques :</Text>
          <Text style={styles.feature}>• Installation plug & play</Text>
          <Text style={styles.feature}>• Configuration automatique</Text>
          <Text style={styles.feature}>• Interface intuitive</Text>
          <Text style={styles.feature}>• Support technique inclus</Text>
          <Text style={styles.feature}>• Mises à jour automatiques</Text>
        </View>

        <View style={styles.pricing}>
          <Text style={styles.price}>₿0.004</Text>
          <Text style={styles.priceSubtext}>Prix unique - Pas d'abonnement</Text>
        </View>

        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.buttonText}>Commander maintenant</Text>
          <Text style={styles.buttonSubtext}>3 mois Daznode Premium offerts</Text>
        </Pressable>
      </View>

      {/* Additional Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Besoin de plus d'informations ?</Text>
        <Text style={styles.infoText}>
          Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans votre choix.
        </Text>
        <Pressable 
          style={styles.outlineButton}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.outlineButtonText}>Contactez-nous</Text>
        </Pressable>
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
  heroSection: {
    padding: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: width - 40,
    height: 300,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: -40,
    ...cardShadow,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  disclaimerText: {
    fontSize: 5,
    fontStyle: 'italic',
    color: Colors.gray[300],
    textAlign: 'center',
    position: 'absolute',
    bottom: 5,
    width: '100%',
  },
  productSection: {
    padding: 20,
    paddingTop: 60,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  bonus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 10,
    marginBottom: 20,
  },
  features: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    ...cardShadow,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 5,
  },
  infoSection: {
    padding: 20,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 