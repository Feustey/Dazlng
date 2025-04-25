# Page Network

Cette page affiche les statistiques et métriques du réseau Lightning Network en temps réel.

## Fonctionnalités

### Métriques principales

- Nombre total de nœuds
- Nombre total de canaux
- Capacité totale du réseau (en BTC)
- Moyenne de canaux par nœud
- Capacité moyenne par canal (en sats)

### Visualisations

- Graphique d'évolution de la capacité (avec sélection de période)
- Distribution des nœuds par pays (graphique en camembert)

### Périodes disponibles pour l'historique

- 24 heures
- 7 jours
- 30 jours
- 1 an

## Architecture

### Composants

- `page.tsx` : Composant principal de la page
- `../components/ui/charts.tsx` : Composants de visualisation (LineChart et PieChart)
- `../services/network.ts` : Service de gestion des données réseau

### Services API

Le service network interagit avec l'API MCP (http://localhost:8000) et expose les endpoints suivants :

```typescript
// Récupération des statistiques globales
GET /network/stats
Response: {
  total_nodes: number;
  total_channels: number;
  total_capacity: number; // en sats
  capacity_history: Array<{ date: string; value: number }>;
  nodes_by_country: Array<{ country: string; count: number }>;
}

// Récupération de l'historique
GET /network/history?period=1d|1w|1m|1y
Response: Array<{ date: string; value: number }>

// Récupération des détails par pays
GET /network/country/:countryCode
Response: {
  nodes: number;
  channels: number;
  capacity: number; // en sats
}
```

### Gestion des données

- Conversion automatique des sats en BTC
- Formatage des dates pour l'affichage
- Tri des pays par nombre de nœuds
- Mise en cache des données avec actualisation périodique
- Gestion des erreurs et états de chargement

## Utilisation des composants

### LineChart

```typescript
import { LineChart } from "@/components/ui/charts";

<LineChart
  data={Array<{ date: string; value: number }>}
  xKey="date"
  yKey="value"
  height={300}
/>
```

### PieChart

```typescript
import { PieChart } from "@/components/ui/charts";

<PieChart
  data={Array<{ country: string; count: number }>}
  nameKey="country"
  valueKey="count"
  height={300}
/>
```

## Internationalisation

Les traductions sont disponibles dans `app/messages/[locale].json` sous la clé "Network" :

```json
{
  "Network": {
    "title": "Réseau Lightning",
    "subtitle": "Explorez les statistiques du réseau Lightning",
    "totalNodes": "Nombre total de nœuds",
    "totalChannels": "Nombre total de canaux",
    "totalCapacity": "Capacité totale",
    "avgChannelsPerNode": "{count} canaux par nœud",
    "capacityPerChannel": "{amount} par canal",
    "channels": "canaux",
    "capacityHistory": "Évolution de la capacité",
    "nodesByCountry": "Distribution par pays",
    "selectPeriod": "Sélectionner une période",
    "period": {
      "day": "24 heures",
      "week": "7 jours",
      "month": "30 jours",
      "year": "1 an"
    }
  }
}
```

## Thème et Style

Les composants utilisent le système de thème de l'application pour s'adapter automatiquement aux modes clair et sombre. Les couleurs et styles sont définis dans :

- `app/styles/theme.ts` pour les variables de thème
- Tailwind CSS pour les styles de composants
- Nivo pour les thèmes des graphiques

## Performance

### Optimisations

- Chargement parallèle des données avec `Promise.all`
- Mise en cache des données côté client
- Lazy loading des graphiques
- Optimisation des re-rendus avec React.memo

### Bonnes pratiques

- Utilisation de TypeScript pour la sécurité des types
- Gestion des erreurs avec des fallbacks
- États de chargement pour une meilleure UX
- Composants réutilisables et modulaires

## Développement

### Installation des dépendances

```bash
npm install @nivo/core @nivo/line @nivo/pie
```

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Build
npm run build

# Tests
npm run test
```
