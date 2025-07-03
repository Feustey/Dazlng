# Composants UI - Espace Utilisateur

Guide pour les composants UI spécialisés de l'espace utilisateur.

## StatsWidget

Widget polyvalent pour afficher des métriques avec tendances.

```tsx
interface StatsWidgetProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: string;
}
```

Usage : KPIs dashboard, métriques de performance, indicateurs de santé.

## NodeCard

Carte d'informations du nœud Lightning avec états connecté/non-connecté.

```tsx
interface NodeCardProps {
  nodeData: {
    pubkey?: string;
    alias?: string;
    totalCapacity?: number;
    activeChannels?: number;
    status?: 'online' | 'offline' | 'syncing';
  } | null;
  showUpgradePrompt?: boolean;
}
```

Usage : Dashboard principal, page de gestion du nœud.

## RecommendationCard

Carte de recommandation avec différenciation gratuit/premium.

```tsx
interface RecommendationCardProps {
  recommendation: {
    id: string | number;
    title: string;
    description?: string;
    isFree?: boolean;
  };
  onApply?: () => void;
  onUpgrade?: () => void;
  isPremium?: boolean;
}
```

Usage : Suggestions d'optimisation, onboarding, conversion premium.

## UpgradePrompt

Prompt d'upgrade vers Premium avec variantes d'affichage.

```tsx
interface UpgradePromptProps {
  message?: string;
  ctaText?: string;
  features?: string[];
  variant?: 'banner' | 'card' | 'modal';
  onUpgrade?: () => void;
}
```

Usage : Headers, modals, call-to-action contextuels.

## Palette de Couleurs

### Couleurs principales
- Indigo : `indigo-600` (primaire), `indigo-700` (hover)
- Purple : `purple-600` (accent), gradients `from-purple-600 to-indigo-600`
- Vert : `green-600` (succès), `green-100` (backgrounds)
- Jaune : `yellow-400` (premium), `yellow-100` (backgrounds)

### États sémantiques
- Succès : `text-green-600`, `bg-green-100`
- Erreur : `text-red-600`, `bg-red-100`  
- Avertissement : `text-yellow-600`, `bg-yellow-100`
- Info : `text-blue-600`, `bg-blue-100`

## Animation et Transitions

- Transitions standard : `transition` (durée 150ms)
- Hover effects : `hover:shadow-lg`, `hover:bg-gray-50`
- Loading states : `animate-pulse`, `animate-spin`
- Micro-interactions : `transform hover:scale-105`