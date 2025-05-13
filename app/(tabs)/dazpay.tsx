import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { cardShadow } from '../../constants/Shadows';
import { Terminal, BarChart3, Zap, ArrowRightLeft } from 'lucide-react-native';

export default function DazPayScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.mainTitle}>DazPay : Encaissez en Lightning, simplement et sans engagement</Text>
        <Text style={styles.subtitle}>
          Solution complète pour les commerçants : terminal Lightning, interface d'encaissement et dashboard de suivi.
        </Text>
        <Text style={styles.highlight}>0€ de frais d'installation</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Une solution complète</Text>
        
        <View style={styles.featureCard}>
          <Terminal size={24} color={Colors.primary} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Terminal Lightning Simple</Text>
            <Text style={styles.featureDescription}>
              Interface d'encaissement intuitive avec option logicielle ou matérielle (DazBox).
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <BarChart3 size={24} color={Colors.primary} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Dashboard Détaillé</Text>
            <Text style={styles.featureDescription}>
              Suivez vos transactions, générez des rapports et gérez votre activité depuis une interface unique.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Zap size={24} color={Colors.primary} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Paiements Instantanés</Text>
            <Text style={styles.featureDescription}>
              Recevez les paiements en quelques secondes avec la technologie Lightning Network.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <ArrowRightLeft size={24} color={Colors.primary} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Conversion Flexible</Text>
            <Text style={styles.featureDescription}>
              Gardez vos bitcoins ou convertissez automatiquement en euros selon vos besoins.
            </Text>
          </View>
        </View>
      </View>

      {/* Pricing Plans */}
      <View style={styles.pricingSection}>
        <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
        
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Plan Standard</Text>
          <Text style={styles.planPrice}>1%</Text>
          <Text style={styles.planDescription}>par transaction</Text>
          <Text style={styles.planFeature}>• Terminal Lightning inclus</Text>
          <Text style={styles.planFeature}>• Interface d'encaissement intuitive</Text>
          <Text style={styles.planFeature}>• Dashboard de suivi des transactions</Text>
          <Text style={styles.planFeature}>• Support par email</Text>
          <Pressable 
            style={styles.button}
            onPress={() => navigation.navigate('Register', { plan: 'standard' })}
          >
            <Text style={styles.buttonText}>Commencer gratuitement</Text>
          </Pressable>
        </View>

        <View style={[styles.planCard, styles.proPlan]}>
          <View style={styles.proTag}>
            <Text style={styles.proTagText}>POPULAIRE</Text>
          </View>
          <Text style={styles.planTitle}>Plan Pro</Text>
          <Text style={styles.planPrice}>0.5%</Text>
          <Text style={styles.planDescription}>par transaction + 15€/mois</Text>
          <Text style={styles.planFeature}>• Tous les avantages du plan Standard</Text>
          <Text style={styles.planFeature}>• Taux de commission réduit</Text>
          <Text style={styles.planFeature}>• Support prioritaire 7j/7</Text>
          <Text style={styles.planFeature}>• Formation personnalisée</Text>
          <Pressable 
            style={styles.button}
            onPress={() => navigation.navigate('Register', { plan: 'pro' })}
          >
            <Text style={styles.buttonText}>Choisir Pro</Text>
          </Pressable>
        </View>
      </View>

      {/* Conversion Option */}
      <View style={styles.conversionSection}>
        <Text style={styles.sectionTitle}>Option de conversion BTC {`>`} EUR</Text>
        <Text style={styles.conversionDescription}>
          Conversion instantanée via nos partenaires de confiance (Strike, River, Btcpay + liquidity node). Recevez vos paiements directement en euros sur votre compte bancaire.
        </Text>
        <Pressable 
          style={styles.outlineButton}
          onPress={() => navigation.navigate('Contact')}
        >
          <Text style={styles.outlineButtonText}>En savoir plus</Text>
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
  heroSection: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 10,
    lineHeight: 24,
  },
  highlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 10,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.secondary,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.background,
    borderRadius: 8,
    ...cardShadow,
  },
  featureContent: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.secondary,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  pricingSection: {
    padding: 20,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    ...cardShadow,
    position: 'relative',
  },
  proPlan: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  proTag: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proTagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.secondary,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  planDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 20,
  },
  planFeature: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.secondary,
  },
  conversionSection: {
    padding: 20,
    backgroundColor: Colors.gray[100],
  },
  conversionDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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