# Composants Réseau

## NetworkStats

Composant serveur qui affiche les statistiques principales du réseau Lightning.

### Utilisation

```tsx
import { NetworkStats } from "@/components/network/NetworkStats";

export default function Page() {
  return (
    <div>
      <NetworkStats />
    </div>
  );
}
```

### Propriétés

Aucune propriété n'est requise. Le composant charge ses propres données via le service `network.service.ts`.

### Structure des données

Le composant utilise l'interface `NetworkStats` définie dans `network.service.ts` :

```typescript
interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  activeNodes: number;
  activeChannels: number;
  networkGrowth: {
    nodes: number;
    channels: number;
    capacity: number;
  };
  capacityHistory: any[];
  nodesByCountry: any[];
  lastUpdate: Date;
}
```

### Mise en cache

Les données sont mises en cache pendant 60 secondes via la constante `revalidate` dans `network.service.ts`.

## Graphiques

### LineChart

Composant client pour afficher l'historique de la capacité du réseau.

#### Utilisation

```tsx
import { LineChart } from "@/components/ui/charts";

<LineChart data={capacityHistory} xKey="date" yKey="value" height={300} />;
```

### PieChart

Composant client pour afficher la distribution des nœuds par pays.

#### Utilisation

```tsx
import { PieChart } from "@/components/ui/charts";

<PieChart
  data={nodesByCountry}
  nameKey="country"
  valueKey="count"
  height={300}
/>;
```

## Services

### network.service.ts

Service centralisé pour la gestion des données réseau.

#### Fonctions principales

- `getNetworkStats()`: Récupère les statistiques actuelles du réseau
- `getHistoricalStats(days)`: Récupère l'historique des statistiques
- `getPeersOfPeers(nodeId)`: Récupère les pairs d'un nœud

#### Mise en cache

```typescript
export const revalidate = 60; // Revalidation toutes les minutes
```

## Tests

Les tests sont organisés dans le dossier `__tests__/network/` :

- `NetworkStats.test.tsx`: Tests du composant NetworkStats
- `charts.test.tsx`: Tests des composants de graphiques
- `network.service.test.ts`: Tests du service réseau
