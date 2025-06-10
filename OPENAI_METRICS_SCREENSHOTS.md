# Page OpenAI Metrics - Guide Visuel

## Vue d'ensemble de la page

La page OpenAI Metrics offre une vue complète de l'utilisation d'OpenAI et des performances système.

```
┌─────────────────────────────────────────────────────────────────────┐
│  DazNode Admin > OpenAI 🤖                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Métriques OpenAI                              [▼ 30 derniers jours]│
│  Surveillance de l'utilisation d'OpenAI et des performances système │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ⚠️ ALERTE: Coût élevé                                             │
│     Coût OpenAI élevé: $7.45 sur la période                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                  │
│  │ API Calls   │ │ OpenAI      │ │ Recommands  │                  │
│  │ (1h)        │ │ (1h)        │ │ (1h)        │                  │
│  │    234      │ │     12      │ │     28      │                  │
│  └─────────────┘ └─────────────┘ └─────────────┘                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │ 💵 Coût Total│ │ 📊 Requêtes  │ │ ⚡ Tokens    │ │ 👥 Nœuds   ││
│  │   $7.45     │ │    152       │ │   245,800   │ │    89      ││
│  │ Proj: $7.50 │ │ 1617 tok/req │ │ Prompt: 189k│ │ Cache: 85% ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Sections principales

### 1. Header avec sélecteur de période
- Titre et description
- Menu déroulant pour sélectionner la période d'analyse

### 2. Alertes (si présentes)
- Alertes de coût élevé (>100$)
- Alertes de performance (>2000ms)
- Alertes de taux d'erreur (>5%)

### 3. Métriques temps réel
- Rafraîchissement automatique toutes les 60 secondes
- 3 cartes principales : API Calls, Requêtes OpenAI, Recommandations

### 4. Statistiques principales (4 cartes)
- **Coût Total** : Avec projection mensuelle
- **Requêtes Totales** : Avec moyenne tokens/requête
- **Tokens Utilisés** : Avec détail prompt/completion
- **Nœuds Actifs** : Avec taux de cache

### 5. Graphique d'utilisation quotidienne
```
Utilisation quotidienne
├── Axe gauche : Nombre de requêtes (ligne violette)
└── Axe droit : Coût en $ (ligne verte)
```

### 6. Visualisations côte à côte

#### Modèles utilisés (Camembert)
```
   gpt-4 (66%)
 ╱       ╲
│         │  gpt-4-turbo (34%)
 ╲       ╱
```

#### Recommandations (Barres)
```
channel     ████████████ 200
fee         █████████ 150
priority    ████████ 136

Vues: 380    Implémentées: 45
```

### 7. État de santé du système
```
┌─────────────────────────────────────────────────────────────────┐
│ État de santé du système          Statut global: ✅ Opérationnel│
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐│
│ │ Database ✅ │ │ Cache    ✅ │ │ SparkSeer ✅│ │ OpenAI  ✅ ││
│ │ Connection  │ │ Redis OK    │ │ API OK      │ │ API OK     ││
│ │ OK          │ │             │ │             │ │            ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘│
│ Dernière vérification: 14:32:15                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8. Top utilisateurs OpenAI
```
┌─────────────────────────────────────────────────────────────────┐
│ Top utilisateurs OpenAI                                         │
├─────────────────────────────────────────────────────────────────┤
│ 02abc123def456...     25 requêtes    45,000 tokens            │
│ 03xyz789abc012...     22 requêtes    38,500 tokens            │
│ 02def456ghi789...     18 requêtes    31,200 tokens            │
│ 03mno345pqr678...     15 requêtes    28,000 tokens            │
│ 02stu901vwx234...     12 requêtes    22,300 tokens            │
└─────────────────────────────────────────────────────────────────┘
```

### 9. Activité récente
```
┌─────────────────────────────────────────────────────────────────┐
│ Activité récente                                                │
├─────────────────────────────────────────────────────────────────┤
│ 14:28:32  generate_priority_actions  02abc12...  1,523 tokens  │
│ 14:25:18  analyze_node_health       03xyz78...  1,245 tokens  │
│ 14:22:05  generate_recommendations  02def45...  1,890 tokens  │
│ 14:18:42  optimize_channels         03mno34...  2,156 tokens  │
└─────────────────────────────────────────────────────────────────┘
```

### 10. Performance des endpoints
```
┌─────────────────────────────────────────────────────────────────┐
│ Performance des endpoints                                       │
├─────────────────────────────────────────────────────────────────┤
│ /api/v1/node/{pubkey}/info         1,200 appels    245ms ✅    │
│ /api/v1/node/{pubkey}/priorities     152 appels  1,850ms ⚠️    │
│ /api/v1/node/{pubkey}/complete        89 appels    320ms ✅    │
│ /api/v1/network/status                56 appels    180ms ✅    │
│─────────────────────────────────────────────────────────────────│
│ Temps de réponse moyen global:                      428ms      │
│ Taux d'erreur:                                      2.30% ✅    │
└─────────────────────────────────────────────────────────────────┘
```

## Codes couleur

- **Vert** ✅ : Valeurs normales/bonnes
- **Orange** ⚠️ : Valeurs à surveiller
- **Rouge** ❌ : Valeurs critiques
- **Violet** : Couleur principale pour OpenAI/IA
- **Bleu** : Éléments secondaires

## Interactions

1. **Sélecteur de période** : Change la période d'analyse
2. **Hover sur graphiques** : Affiche les valeurs détaillées
3. **Tableaux** : Lignes survolées en gris clair
4. **Rafraîchissement auto** : Indicateur de mise à jour en temps réel

## Responsive Design

- **Desktop** : Toutes les sections visibles
- **Tablet** : Grilles 2x2 deviennent 1x2
- **Mobile** : Tout en colonne unique