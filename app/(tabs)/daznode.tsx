import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import PricingCard from '../../components/shared/ui/PricingCard';
import HeroSection from '../../components/shared/ui/HeroSection';

type PlanId = 'gratuit' | 'standard' | 'premium' | 'ai-addon';

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
}

export default function DaznodeScreen() {
  const navigation = useNavigation();
  
  const plans: Plan[] = [
    {
      id: 'gratuit',
      name: 'Gratuit',
      price: '0€',
      features: ['Statistiques de base'],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '9€/mois',
      features: ['Statistiques de base', 'Routage optimisé'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '29€/mois',
      features: [
        'Statistiques de base',
        'Routage optimisé',
        'Intégration Amboss',
        'Sparkseer',
        'Alertes Telegram',
        'Auto-rebalancing',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <HeroSection
        title="Daznode : Optimisez, surveillez, maîtrisez votre activité Lightning"
        subtitle="Profitez d'une plateforme intelligente pour piloter vos canaux Lightning : statistiques avancées, routage optimisé, alertes personnalisées et intégrations puissantes."
      />

      <View style={styles.pricingSection}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.name}
            price={plan.price}
            features={plan.features}
            buttonText={`Choisir ${plan.name}`}
            onPress={() => navigation.navigate('Subscribe', { plan: plan.id })}
          />
        ))}
      </View>

      <View style={styles.addonsSection}>
        <PricingCard
          variant="addon"
          title="Module IA - Prédiction des fee rates"
          price="10€/mois"
          buttonText="Ajouter"
          onPress={() => navigation.navigate('Subscribe', { plan: 'ai-addon' as const })}
        />
        <PricingCard
          variant="addon"
          title="Intégrations personnalisées"
          description="Wallets ou Telegram bots sur mesure"
          buttonText="Nous contacter"
          onPress={() => navigation.navigate('Contact')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pricingSection: {
    padding: 20,
  },
  addonsSection: {
    padding: 20,
  },
}); 