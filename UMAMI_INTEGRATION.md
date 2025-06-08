# 📊 Intégration Umami Analytics - DazNode

## Vue d'ensemble

Cette intégration enrichit le dashboard admin de DazNode avec les métriques de trafic détaillées d'Umami, combinées aux données business internes pour une vue d'ensemble complète.

## 🚀 Fonctionnalités

### Métriques Umami Intégrées
- **Pages vues** et **visiteurs uniques** avec évolution
- **Taux de rebond** et **durée moyenne de session**
- **Top pages** les plus visitées
- **Sources de trafic** (referrers)
- **Événements personnalisés** trackés
- **Métriques temps réel** (dernières 24h)

### Fusion avec Données Business
- **Funnel de conversion** complet : Visiteurs → Signups → Clients → Premium
- **Taux de conversion** calculés automatiquement
- **ROI et métriques business** enrichies
- **Corrélation trafic/revenus**

## ⚙️ Configuration

### Variables d'Environnement

```env
# Configuration Umami (optionnel)
UMAMI_API_URL=https://your-umami-instance.com/api
UMAMI_WEBSITE_ID=your-website-id
UMAMI_API_TOKEN=your-api-token
```

### Obtenir un Token API Umami

1. Connectez-vous à votre instance Umami
2. Allez dans **Settings** → **Profile** → **API tokens**
3. Créez un nouveau token avec les permissions :
   - `website:read` - Lecture des statistiques
   - `website:analytics` - Accès aux analytics détaillés

## 🏗️ Architecture

### Service API (`lib/services/umami-api.ts`)
```typescript
// Client unifié pour toutes les métriques Umami
export const umamiApi = new UmamiApiService();

// Récupérer toutes les métriques en une fois
const stats = await umamiApi.getCompleteStats(startAt, endAt);

// Métriques temps réel
const realtime = await umamiApi.getRealTimeStats();

// Métriques pour une période spécifique
const monthly = await umamiApi.getStatsForPeriod(30);
```

### API Route (`/api/admin/analytics`)
```typescript
// Combine Umami + Business metrics
GET /api/admin/analytics?period=30&realtime=false

// Réponse complète
interface AnalyticsResponse {
  umami: UmamiStatsResponse;     // Métriques de trafic
  business: BusinessMetrics;     // Utilisateurs, conversions
  performance: PerformanceMetrics; // Revenus, commandes
  funnel: FunnelMetrics;         // Entonnoir de conversion
}
```

### Composants UI

#### `AnalyticsOverview` 
- **Dashboard principal** : Vue résumé avec métriques clés
- **Funnel visuel** : Conversion en 5 étapes
- **Top pages** : Pages les plus visitées
- **Responsive** et **temps réel**

#### Page Analytics Complète (`/admin/analytics`)
- **Contrôles de période** : 24h, 7j, 30j + mode temps réel
- **Métriques détaillées** : Trafic, business, funnel
- **Sources de trafic** et **événements**
- **Graphiques interactifs**

## 📈 Métriques Disponibles

### Trafic (Umami)
| Métrique | Description | Source |
|----------|-------------|---------|
| `pageviews` | Nombre total de pages vues | Umami API |
| `uniques` | Visiteurs uniques | Umami API |
| `bounces` | Visiteurs ayant quitté sans interaction | Umami API |
| `avgDuration` | Durée moyenne de session | Calculée |
| `topPages` | Pages les plus visitées | Umami API |
| `referrers` | Sources de trafic | Umami API |

### Business (Interne)
| Métrique | Description | Source |
|----------|-------------|---------|
| `totalUsers` | Utilisateurs inscrits | Supabase |
| `premiumUsers` | Abonnés premium | Supabase |
| `conversionRate` | Taux visiteurs → clients | Calculé |
| `monthlyRevenue` | Revenus du mois | Supabase |
| `activeUsers` | Utilisateurs avec commande | Supabase |

### Funnel de Conversion
```
Visiteurs (Umami) → Signups → Vérifiés → Premier Achat → Premium
     100%        →   X%    →    Y%    →      Z%      →   W%
```

## 🎯 Utilisation

### Dashboard Principal
```typescript
// Intégration automatique dans /admin/dashboard
<AnalyticsOverview period={30} />
```

### Analytics Détaillées
```typescript
// Page dédiée /admin/analytics
const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

// Chargement avec période personnalisée
useEffect(() => {
  fetchAnalytics(period, realtime);
}, [period, realtime]);
```

### API Directe
```typescript
// Utilisation du service dans vos composants
import { umamiApi } from '@/lib/services/umami-api';

// Stats complètes
const stats = await umamiApi.getCompleteStats();

// Période spécifique
const weekStats = await umamiApi.getStatsForPeriod(7);

// Vérifier si configuré
if (umamiApi.isConfigured()) {
  // Utiliser Umami
} else {
  // Fallback vers données internes uniquement
}
```

## 🔧 Personnalisation

### Ajouter de Nouvelles Métriques

1. **Étendre les interfaces** dans `umami-api.ts`
2. **Ajouter l'endpoint** dans la classe `UmamiApiService`
3. **Intégrer dans l'API** `/api/admin/analytics`
4. **Afficher dans les composants** UI

### Exemple : Ajouter les Pays
```typescript
// 1. Interface
interface UmamiCountryStats {
  country: string;
  visitors: number;
}

// 2. Service
async getCountries(): Promise<UmamiCountryStats[]> {
  return this.makeRequest(`/websites/${this.websiteId}/countries`);
}

// 3. API Route
const countries = await umamiApi.getCountries();

// 4. Composant
{countries.map(country => (
  <div key={country.country}>
    {country.country}: {country.visitors}
  </div>
))}
```

## 🚨 Gestion d'Erreurs

### Mode Dégradé
Si Umami n'est pas disponible :
- **Métriques business** continuent de fonctionner
- **Fallback automatique** vers données internes
- **Indicateur visuel** d'erreur avec bouton retry

### Monitoring
```typescript
// Logs automatiques des erreurs Umami
console.error('Erreur Umami:', error);

// Métriques de fallback
return {
  pageviews: 0,
  uniques: businessMetrics.totalUsers, // Estimation
  // ... autres fallbacks
};
```

## 📊 Performance

### Cache et Optimisation
- **Cache 5 minutes** sur les appels API Umami
- **Requêtes parallèles** pour toutes les métriques
- **Fallback rapide** en cas d'erreur
- **ISR (Incremental Static Regeneration)** sur les pages

### Limite de Taux
- Respecte les **limites API Umami**
- **Retry automatique** avec backoff exponentiel
- **Circuit breaker** après échecs répétés

## 🎨 Personnalisation UI

### Thème et Couleurs
```typescript
const colorScheme = {
  traffic: 'blue',     // Métriques de trafic
  conversion: 'green', // Taux de conversion
  revenue: 'orange',   // Revenus
  users: 'purple'      // Utilisateurs
};
```

### Composants Réutilisables
- `MetricCard` : Affichage métrique avec tendance
- `FunnelStep` : Étape de conversion visualisée
- `StatCard` : Carte de statistique standard

## 📝 À Faire

### Améliorations Futures
- [ ] **Graphiques historiques** avec Chart.js
- [ ] **Comparaison période précédente**
- [ ] **Alertes automatiques** sur métriques critiques
- [ ] **Export PDF** des rapports
- [ ] **Segmentation utilisateurs** avancée
- [ ] **A/B testing** intégré
- [ ] **Prédictions IA** des tendances

### Intégrations Potentielles
- [ ] **Google Analytics** (dual tracking)
- [ ] **Mixpanel** pour les événements
- [ ] **Hotjar** pour les heatmaps
- [ ] **Intercom** pour le support client

## 🛡️ Sécurité

### Bonnes Pratiques
- **Token API** stocké en variable d'environnement
- **Validation** de tous les paramètres d'entrée
- **Rate limiting** sur les endpoints admin
- **CORS** configuré correctement
- **Logs** des accès sensibles

### Authentification
```typescript
// Toutes les routes analytics sont protégées
export const GET = withEnhancedAdminAuth(
  getAnalyticsHandler,
  { resource: 'analytics', action: 'read' }
);
```

## 📞 Support

### Résolution de Problèmes

**❌ Umami non configuré**
```
Variables d'environnement manquantes → Vérifier .env
```

**❌ Erreur API Token**
```
401 Unauthorized → Régénérer le token Umami
```

**❌ Métriques à zéro**
```
Période trop courte → Essayer 30 jours
```

### Debug Mode
```typescript
// Activer les logs détaillés
UMAMI_DEBUG=true
```

Cette intégration positionne DazNode avec un dashboard analytics professionnel comparable aux solutions SaaS enterprise, tout en gardant le contrôle total des données. 🚀 