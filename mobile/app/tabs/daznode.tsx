import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../../constants/Colors';
import PricingCard from '../../../components/shared/ui/PricingCard';
import HeroSection from '../../../components/shared/ui/HeroSection';
import { FaBolt } from 'react-icons/fa';

type PlanId = 'gratuit' | 'standard' | 'premium' | 'ai-addon';

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
}

export default function DaznodeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
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
            cta={`Choisir ${plan.name}`}
            ctaHref=""
            color="from-indigo-400 to-indigo-600"
            icon={<FaBolt />}
            buttonText={`Choisir ${plan.name}`}
            onPress={() => navigation.navigate('Subscribe', { plan: plan.id })}
            microcopy={plan.id === 'gratuit' ? 'Sans engagement' : undefined}
          />
        ))}
      </View>

      <View style={styles.addonsSection}>
        <PricingCard
          title="Module IA - Prédiction des fee rates"
          price="10€/mois"
          features={['Prédiction intelligente des frais Lightning']}
          cta="Ajouter"
          ctaHref=""
          color="from-pink-400 to-pink-600"
          icon={<FaBolt />}
          buttonText="Ajouter"
          onPress={() => navigation.navigate('Subscribe', { plan: 'ai-addon' as const })}
          microcopy="Boostez votre node avec l'IA"
        />
        <PricingCard
          title="Intégrations personnalisées"
          price="Sur devis"
          features={['Wallets ou Telegram bots sur mesure']}
          cta="Nous contacter"
          ctaHref=""
          color="from-yellow-400 to-yellow-600"
          icon={<FaBolt />}
          buttonText="Nous contacter"
          onPress={() => navigation.navigate('Contact')}
          microcopy="Projet sur mesure, parlons-en !"
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