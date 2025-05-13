import React from 'react';
import { View } from 'react-native';
import ProductCard from '../../../components/shared/ui/ProductCard';

const DazboxPage = () => {
  const features = [
    { text: "✓ Node Lightning plug & play" },
    { text: "✓ Installation facile en quelques minutes" },
    { text: "✓ 3 mois de Daznode Premium inclus" },
    { text: "✓ Support technique dédié" }
  ];

  const bonusFeatures = [
    { text: "• Accès à la communauté Daz" },
    { text: "• Guides d'utilisation détaillés" },
    { text: "• Formation Lightning Network" }
  ];

  return (
    <View style={{ flex: 1 }}>
      <ProductCard
        title="Dazbox - Node Lightning Plug & Play"
        subtitle="Votre porte d'entrée vers l'écosystème Lightning"
        price="199€"
        features={features}
        bonusFeatures={bonusFeatures}
      />
    </View>
  );
};

export default DazboxPage; 