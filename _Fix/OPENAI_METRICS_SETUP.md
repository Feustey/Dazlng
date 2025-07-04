# Configuration de la page OpenAI Metrics

## Vue d'ensemble

La page OpenAI Metrics dans l'admin permet de visualiser:
- L'utilisation d'OpenAI (requêtes, tokens, coûts)
- Les recommandations générées
- Les métriques système
- Les alertes et projections de coûts

## Configuration requise

### Variables d'environnement

Ajouter ces variables dans votre fichier `.env.local`:

```env
# API Dazno
DAZNO_API_BASE_URL=https://api.dazno.de
DAZNO_API_TOKEN=your_dazno_api_token_here
```

### Installation des dépendances

```bash
npm install recharts --legacy-peer-deps
```

## Endpoints API créés

- `/api/admin/openai/metrics` - Métriques complètes avec période configurable
- `/api/admin/openai/metrics/realtime` - Métriques temps réel (dernière heure)

## Accès

La page est accessible via:
- URL: `/admin/openai`
- Menu: Admin > Principal > OpenAI 🤖

## Fonctionnalités

### 1. Sélection de période
- 7 derniers jours
- 30 derniers jours (par défaut)
- 90 derniers jours
- 365 derniers jours

### 2. Métriques temps réel
- Rafraîchissement automatique toutes les 60 secondes
- API calls de la dernière heure
- Requêtes OpenAI récentes
- Recommandations générées

### 3. Visualisations
- Graphique linéaire: Évolution quotidienne des requêtes et coûts
- Diagramme circulaire: Répartition des modèles utilisés
- Graphique en barres: Types de recommandations
- Tableaux: Top utilisateurs, activité récente, performances endpoints

### 4. Alertes
- Coût élevé (>100$ sur la période)
- Taux d'erreur élevé (>5%)
- Performance dégradée (>2000ms)

## Sécurité

- Authentification requise via middleware `withAdmin`
- Token JWT vérifié automatiquement
- Accès restreint aux administrateurs

## Développement

### Structure des composants

```
app/admin/openai/
├── page.tsx              # Page principale
app/api/admin/openai/
├── metrics/
│   ├── route.ts         # Endpoint métriques complètes
│   └── realtime/
│       └── route.ts     # Endpoint métriques temps réel
```

### Types TypeScript

Les interfaces complètes sont définies dans `page.tsx`:
- `OpenAIMetrics` - Structure des métriques complètes
- `RealtimeMetrics` - Structure des métriques temps réel

## Troubleshooting

### Erreur "Cannot find module 'recharts'"
```bash
npm install recharts --legacy-peer-deps
```

### Erreur 401 Unauthorized
- Vérifier que l'utilisateur est connecté et a les droits admin
- Vérifier le token DAZNO_API_TOKEN

### Pas de données
- Vérifier la connexion à l'API Dazno
- Vérifier les logs serveur pour les erreurs

## Améliorations futures

- [ ] Export des données en CSV
- [ ] Filtrage par pubkey spécifique
- [ ] Graphiques de comparaison entre périodes
- [ ] Notifications push pour les alertes critiques
- [ ] Cache côté serveur pour optimiser les performances