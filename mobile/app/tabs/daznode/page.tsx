import React from 'react';
import { View, ScrollView } from 'react-native';
import ProductCard from 'components/shared/ui/ProductCard';

const DaznodePage = () => {
  const freeFeatures = [
    { text: "✓ Statistiques de base" },
    { text: "✓ Monitoring basique" },
    { text: "✓ Dashboard simple" }
  ];

  const basicFeatures = [
    { text: "✓ Routing optimisé" },
    { text: "✓ Statistiques avancées" },
    { text: "✓ Monitoring en temps réel" },
    { text: "✓ Support prioritaire" }
  ];

  const premiumFeatures = [
    { text: "✓ Intégration Amboss" },
    { text: "✓ Intégration Sparkseer" },
    { text: "✓ Alertes Telegram" },
    { text: "✓ Auto-rebalancing" }
  ];

  const addonsFeatures = [
    { text: "✓ Modèle prédictif de fee rate (10€/mois)" },
    { text: "✓ Intégration Wallets personnalisée" },
    { text: "✓ Bots Telegram sur mesure" }
  ];

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <ProductCard
          title="Daznode - Gratuit"
          subtitle="Pour débuter avec Lightning"
          price="0€/mois"
          features={freeFeatures}
        />

        <ProductCard
          title="Daznode - Basic"
          subtitle="Pour les nodes actifs"
          price="9€/mois"
          features={basicFeatures}
        />

        <ProductCard
          title="Daznode - Premium"
          subtitle="Pour les nodes professionnels"
          price="29€/mois"
          features={premiumFeatures}
        />

        <ProductCard
          title="Add-ons disponibles"
          subtitle="Personnalisez votre expérience"
          price="À partir de 10€/mois"
          features={addonsFeatures}
        />
      </View>
    </ScrollView>
  );
};

export default DaznodePage; 