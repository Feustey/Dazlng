# Intégration Umami Analytics pour DazNode

## 🎯 Vue d'ensemble

Cette intégration complète d'Umami Analytics permet de :
- Collecter des données de trafic en temps réel
- Tracker des événements personnalisés (Lightning Network, conversions, erreurs)
- Afficher un dashboard d'analytics complet dans l'admin
- Supporter les modes développement et production avec fallback intelligent

## 📁 Architecture

### Fichiers créés/modifiés

```
app/
├── api/admin/umami-analytics/route.ts     # Endpoint API pour récupérer les données
├── admin/analytics/page.tsx               # Page dashboard analytics admin
lib/services/umami-service.ts              # Service côté client pour tracking
hooks/useUmamiAnalytics.ts                 # Hook React personnalisé
app/layout.tsx                             # Script Umami déjà configuré
```

### Variables d'environnement

```env
# Production uniquement
UMAMI_API_URL=https://your-umami-instance.com/api
UMAMI_API_KEY=your_umami_api_key
UMAMI_WEBSITE_ID=your_website_id

# L'ID du site est déjà configuré dans le code : 21fab8e3-a8fd-474d-9187-9739cce7c9b5
```

## 🚀 Fonctionnalités

### 1. Dashboard Admin (/admin/analytics)

**Métriques principales :**
- 👁️ Pages vues
- 👥 Visiteurs uniques
- 🔄 Taux de rebond
- ⏱️ Durée moyenne de session

**Données temps réel :**
- Visiteurs actifs actuellement
- Sessions en cours
- Pages vues en direct

**Analyses détaillées :**
- 📄 Pages les plus visitées
- 🌍 Répartition géographique
- 🌐 Navigateurs utilisés
- 💻 Systèmes d'exploitation
- 📱 Types d'appareils
- 🎯 Événements personnalisés

**Fonctionnalités avancées :**
- Sélecteur de période (24h, 7j, 30j, 90j)
- Auto-refresh toutes les 5 minutes
- Système de fallback avec données mock
- Indicateur de source de données

### 2. Service côté client (UmamiService)

```typescript
import { trackingEvents } from '@/lib/services/umami-service';

// Exemples d'utilisation :
trackingEvents.login('email');
trackingEvents.nodeConnected('03abc123...');
trackingEvents.upgradeToBasic(2100000); // en satoshis
trackingEvents.buttonClick('connect-wallet', 'user-dashboard');
```

**Événements prédéfinis :**
- **Authentification :** login, logout, register, failed_login
- **Lightning Network :** node_connected, channel_opened, invoice_generated, payment_received
- **Conversions :** upgrade_basic, upgrade_premium, upgrade_enterprise
- **Interactions :** button_click, form_submit, download_start
- **Erreurs :** javascript_error, api_error
- **Performance :** page_load_time, api_response_time

### 3. Hook React personnalisé

```typescript
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics';

function MyComponent() {
  const { 
    isUmamiLoaded, 
    trackEvent, 
    events,
    loadAnalytics,
    analyticsData 
  } = useUmamiAnalytics();

  const handleButtonClick = () => {
    events.buttonClick('premium-upgrade', 'pricing-page');
  };

  return (
    <button onClick={handleButtonClick}>
      Passer à Premium
    </button>
  );
}
```

**Hooks spécialisés :**
- `useUmamiPageTracking()` - Tracking automatique des pages
- `useUmamiErrorTracking()` - Capture automatique des erreurs JS
- `useUmamiPerformanceTracking()` - Métriques de performance

## 🛠️ Configuration

### Mode développement

En mode développement (`NODE_ENV !== 'production'`) :
- ✅ Le dashboard affiche des **données mock réalistes**
- ✅ Les événements sont **simulés en console**
- ✅ Aucune configuration Umami requise
- ✅ Fallback automatique si API indisponible

### Mode production

En mode production :
1. Configurer les variables d'environnement Umami
2. S'assurer que le script Umami est chargé (`app/layout.tsx`)
3. L'API interroge directement Umami
4. Fallback vers données mock si erreur

### Endpoints API

**GET `/api/admin/umami-analytics`**
```typescript
// Paramètres optionnels
?startAt=timestamp&endAt=timestamp&unit=day

// Réponse
{
  success: true,
  data: {
    stats: { pageviews, visitors, visits, bounces, totaltime },
    pageviews: { pageviews: [{x: url, y: count}] },
    metrics: { browsers, os, devices, countries },
    events: [{x: event_name, y: count}],
    realtime: { active_visitors, active_sessions, current_pageviews }
  },
  source: 'mock' | 'umami' | 'mock_fallback',
  timestamp: '2024-01-15T10:30:00Z'
}
```

**POST `/api/admin/umami-analytics`**
```typescript
// Corps de la requête
{
  event: 'custom_event_name',
  data: { key: 'value' }
}

// Réponse
{
  success: true,
  message: 'Événement envoyé à Umami'
}
```

## 📊 Données mock (développement)

Les données mock incluent :
- **2,547 pages vues** sur 7 jours
- **1,832 visiteurs uniques**
- **12 visiteurs actifs** en temps réel
- **Top pages :** /, /daznode, /user/node, /admin/dashboard
- **Pays :** France (54%), Canada (13%), Allemagne (10%)
- **Navigateurs :** Chrome (55%), Safari (19%), Firefox (13%)
- **Événements :** node_connection, premium_upgrade, export_data

## 🔧 Utilisation pratique

### 1. Dans un composant de page

```typescript
'use client';
import { useUmamiPageTracking } from '@/hooks/useUmamiAnalytics';
import { usePathname } from 'next/navigation';

export default function MyPage() {
  const pathname = usePathname();
  useUmamiPageTracking(pathname); // Tracking automatique

  return <div>Ma page</div>;
}
```

### 2. Pour tracker une conversion

```typescript
import { trackingEvents } from '@/lib/services/umami-service';

const handleUpgrade = async (plan: string, amount: number) => {
  try {
    // Logic de payment...
    
    // Tracker la conversion
    if (plan === 'basic') {
      trackingEvents.upgradeToBasic(amount);
    } else if (plan === 'premium') {
      trackingEvents.upgradeToPremium(amount);
    }
  } catch (error) {
    trackingEvents.jsError(error);
  }
};
```

### 3. Pour tracker des actions Lightning

```typescript
import { trackingEvents } from '@/lib/services/umami-service';

const connectNode = async (nodeId: string) => {
  try {
    // Connexion du nœud...
    trackingEvents.nodeConnected(nodeId);
  } catch (error) {
    trackingEvents.apiError('/api/node/connect', 500);
  }
};

const openChannel = async (capacity: number) => {
  trackingEvents.channelOpened(capacity);
};
```

## 🎨 Interface utilisateur

Le dashboard d'analytics dispose de :
- **Design responsive** adapté mobile/desktop
- **Cartes colorées** avec émojis pour une navigation intuitive
- **Indicateurs en temps réel** avec actualisation automatique
- **Sélecteur de période** pour l'analyse temporelle
- **États de chargement** avec animations
- **Gestion d'erreurs** avec boutons de retry
- **Badge de source** indiquant l'origine des données

## 🔄 Système de fallback

1. **Étape 1** : Tentative d'appel API Umami
2. **Étape 2** : Si échec → Données mock avec indication "Fallback"
3. **Étape 3** : En développement → Toujours mock
4. **Étape 4** : Logs détaillés pour debugging

## 📈 Métriques business

L'intégration track automatiquement :
- **Funnel de conversion** : Visiteur → Prospect → Utilisateur → Premium
- **Engagement Lightning** : Connexions nœuds, ouvertures canaux, paiements
- **Performance technique** : Temps de chargement, erreurs API
- **Géolocalisation** : Expansion géographique DazNode
- **Préférences utilisateurs** : Navigateurs, OS, appareils

## 🚨 Monitoring

### Logs automatiques
```
[UMAMI-ANALYTICS] Mode développement - données mock utilisées
[UMAMI-HOOK] Script Umami chargé avec succès
[UMAMI] Événement tracké: premium_upgrade {amount: 2100000}
[UMAMI-ANALYTICS] Erreur API, fallback vers données mock
```

### Erreurs courantes
- ❌ **Variables d'environnement manquantes** → Fallback auto
- ❌ **Script Umami non chargé** → Events en attente puis replay
- ❌ **API Umami indisponible** → Fallback données mock
- ❌ **Permissions insuffisantes** → Logs d'erreur détaillés

## ✅ Tests

Pour tester l'intégration :

1. **Mode développement :**
   ```bash
   npm run dev
   # Aller sur /admin/analytics
   # Vérifier les données mock
   ```

2. **Tracking d'événements :**
   ```javascript
   // Dans la console navigateur
   window.umami?.track('test_event', {test: true});
   ```

3. **API directe :**
   ```bash
   curl -X GET "http://localhost:3000/api/admin/umami-analytics?timeRange=7d"
   ```

## 🎯 Prochaines étapes

1. **Configurer l'instance Umami de production**
2. **Ajouter des événements métier spécifiques**
3. **Créer des dashboards personnalisés par rôle**
4. **Intégrer des alertes automatiques**
5. **Ajouter l'export de données analytics**

---

**🎉 L'intégration Umami est maintenant complète et prête pour la production !**

Les analytics fonctionnent en mode développement avec des données mock réalistes et basculeront automatiquement vers l'API Umami réelle une fois configurée en production. 