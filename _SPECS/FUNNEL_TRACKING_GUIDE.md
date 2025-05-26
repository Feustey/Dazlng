# Guide du Système de Tracking du Funnel de Conversion

## 🎯 Vue d'ensemble

Ce système de tracking permet de suivre en temps réel le comportement des utilisateurs dans le funnel de conversion de dazno.de. Il combine tracking local et intégration Umami pour une analyse complète.

## 📊 Fonctionnalités Implémentées

### 1. Tracking des Événements
- **Page Views** : Suivi des visites de pages
- **CTA Clicks** : Clics sur les boutons d'action
- **Scroll Depth** : Profondeur de défilement
- **Form Interactions** : Interactions avec les formulaires
- **Demo Interactions** : Engagement avec les démos
- **Product Interest** : Intérêt pour les produits

### 2. Stockage des Données
- **Local Storage** : Stockage côté client pour analyse immédiate
- **Session Tracking** : Suivi des sessions utilisateur
- **Umami Integration** : Envoi vers Umami si configuré

### 3. Dashboard Analytics
- **Métriques en temps réel** : Événements, sessions, conversions
- **Funnel Visualization** : Visualisation du parcours utilisateur
- **Export de données** : Export JSON des analytics

## 🚀 Utilisation

### Hook de Tracking Principal

```typescript
import { useConversionTracking } from '../hooks/useConversionTracking';

const { trackCTAClick, trackPageView, trackScrollDepth } = useConversionTracking();

// Tracker un clic CTA
trackCTAClick('primary', 'hero_section', { action: 'start_free' });

// Tracker une vue de page
trackPageView('landing_page', { section: 'hero' });

// Tracker le scroll (automatique avec useScrollTracking)
```

### Hook de Scroll Tracking

```typescript
import { useScrollTracking } from '../hooks/useScrollTracking';

// Tracking automatique du scroll
useScrollTracking({ 
  pageName: 'landing_page',
  thresholds: [25, 50, 75, 100] // Pourcentages à tracker
});
```

## 📁 Structure des Fichiers

```
hooks/
├── useConversionTracking.ts    # Hook principal de tracking
└── useScrollTracking.ts        # Hook de tracking du scroll

components/shared/ui/
├── NewHero.tsx                 # Hero avec tracking intégré
├── HowItWorks.tsx             # Section avec CTA trackés
├── CTASection.tsx             # Section finale avec tracking
└── FunnelAnalytics.tsx        # Dashboard d'analytics

app/
├── admin/analytics/page.tsx    # Page d'analytics admin
└── test-funnel/page.tsx       # Page de test du funnel
```

## 🔧 Configuration

### Variables d'Environnement Umami (Optionnel)

```env
UMAMI_API_URL=https://your-umami-instance.com/api
UMAMI_WEBSITE_ID=your-website-id
UMAMI_API_KEY=your-api-key
```

### Intégration dans un Composant

```typescript
import React, { useEffect } from 'react';
import { useConversionTracking } from '../hooks/useConversionTracking';

const MyComponent = () => {
  const { trackCTAClick, trackPageView } = useConversionTracking();

  useEffect(() => {
    trackPageView('my_page');
  }, [trackPageView]);

  const handleButtonClick = () => {
    trackCTAClick('primary', 'my_component', { 
      action: 'custom_action',
      metadata: { customData: 'value' }
    });
  };

  return (
    <button onClick={handleButtonClick}>
      Mon Bouton Tracké
    </button>
  );
};
```

## 📈 Métriques Disponibles

### Événements Trackés
1. **page_view** : Vues de pages
2. **cta_click** : Clics sur CTA (primary/secondary)
3. **scroll_depth** : Profondeur de scroll (25%, 50%, 75%, 100%)
4. **form_interaction** : Interactions formulaires (start/complete/abandon)
5. **demo_interaction** : Interactions démo (start/complete/skip)
6. **product_interest** : Intérêt produit (dazbox/daznode/dazpay)

### Données de Session
- **Session ID** : Identifiant unique de session
- **Timestamp** : Horodatage des événements
- **User Agent** : Informations navigateur
- **Metadata** : Données contextuelles

## 🧪 Tests

### Page de Test
Accédez à `/test-funnel` pour tester le système :
- Interface complète avec tous les composants
- Analytics en temps réel
- Instructions de test intégrées

### Tests Automatisés
```bash
# Installer Puppeteer (si pas déjà fait)
npm install puppeteer

# Lancer les tests automatisés
node scripts/test-funnel.js
```

### Tests Manuels
1. Ouvrir `/test-funnel`
2. Interagir avec les différents CTA
3. Scroller sur la page
4. Observer les analytics en temps réel
5. Exporter les données

## 📊 Dashboard Analytics

### Accès
- **Admin** : `/admin/analytics`
- **Test** : `/test-funnel` (section analytics intégrée)

### Métriques Affichées
- **Total Événements** : Nombre total d'événements trackés
- **Sessions Uniques** : Nombre de sessions distinctes
- **Événements/Session** : Moyenne d'événements par session
- **Durée Session** : Durée moyenne des sessions

### Funnel de Conversion
- Visualisation étape par étape
- Taux de conversion entre étapes
- Identification des points de friction

## 🔍 Debugging

### Mode Développement
En mode développement, tous les événements sont loggés dans la console :

```javascript
console.log('🎯 Tracking Event:', {
  eventName: 'funnel_cta_click',
  stepName: 'cta_click',
  action: 'primary',
  location: 'hero_section',
  timestamp: '2024-01-15T10:30:00.000Z',
  sessionId: 'daz_1705312200000_abc123'
});
```

### Vérification des Données
```javascript
// Dans la console du navigateur
const analytics = JSON.parse(localStorage.getItem('daz_analytics') || '[]');
console.log('Analytics data:', analytics);
```

## 🚀 Déploiement

### Checklist Pré-déploiement
- [ ] Variables Umami configurées (si utilisé)
- [ ] Tests du funnel passés
- [ ] Analytics dashboard fonctionnel
- [ ] Export de données opérationnel

### Monitoring Post-déploiement
1. Vérifier les événements dans Umami
2. Contrôler les métriques du dashboard
3. Analyser les taux de conversion
4. Identifier les optimisations possibles

## 📋 Maintenance

### Nettoyage des Données
Le système limite automatiquement à 1000 événements en local storage pour éviter la surcharge.

### Mise à jour des Seuils
Modifiez les seuils de scroll dans `useScrollTracking` selon vos besoins :

```typescript
useScrollTracking({ 
  pageName: 'my_page',
  thresholds: [10, 25, 50, 75, 90, 100] // Personnalisable
});
```

## 🎯 Optimisations Futures

### Améliorations Possibles
1. **Heatmaps** : Intégration de cartes de chaleur
2. **A/B Testing** : Framework de tests A/B
3. **Segmentation** : Segmentation des utilisateurs
4. **Alertes** : Alertes sur les métriques critiques
5. **Machine Learning** : Prédiction des conversions

### Intégrations Additionnelles
- Google Analytics 4
- Mixpanel
- Amplitude
- Custom webhooks

---

**Note** : Ce système est conçu pour être léger, performant et respectueux de la vie privée. Toutes les données sont stockées localement par défaut, avec envoi optionnel vers Umami. 