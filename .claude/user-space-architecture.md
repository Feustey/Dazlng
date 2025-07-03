# Architecture de l'Espace Utilisateur

L'espace utilisateur (`/app/user/`) est la partie centrale de l'application pour les utilisateurs connectés, conçue pour maximiser la conversion et l'engagement.

## Structure

### Pages principales
- `app/user/dashboard/page.tsx` : Dashboard principal avec gamification et KPIs
- `app/user/node/page.tsx` : Gestion et connexion du nœud Lightning
- `app/user/subscriptions/page.tsx` : Gestion des abonnements avec upgrade prompts
- `app/user/settings/page.tsx` : Paramètres utilisateur et profil
- `app/user/dazia/page.tsx` : IA recommendations avec modèle freemium

### Pages avancées du nœud
- `app/user/node/stats/page.tsx` : Statistiques détaillées du nœud
- `app/user/node/channels/page.tsx` : Gestion des canaux Lightning
- `app/user/node/recommendations/page.tsx` : Recommandations personnalisées

### Pages d'intelligence et optimisation
- `app/user/intelligence/page.tsx` : Intelligence artificielle et insights
- `app/user/rag-insights/page.tsx` : RAG (Retrieval-Augmented Generation) insights
- `app/user/simulation/page.tsx` : Simulateur de performance nœud
- `app/user/optimize/page.tsx` : Outils d'optimisation automatique
- `app/user/alerts/page.tsx` : Système d'alertes et notifications
- `app/user/t4g/page.tsx` : Features T4G (Tuned 4 Growth)

## Layout et Composants

### Layout principal
- `app/user/layout.tsx` : Layout wrapper avec sidebar responsive et header
- `app/user/dashboard/layout.tsx` : Layout spécifique au dashboard

### Composants de layout
- `app/user/components/layout/UserSidebar.tsx` : Navigation latérale avec menu intelligent
- `app/user/components/layout/UserHeader.tsx` : Header avec état de connexion et notifications

### Composants UI spécialisés (vraiment implémentés)
- `app/user/components/ui/StatsWidget.tsx` : Widget de statistiques avec tendances
- `app/user/components/ui/NodeCard.tsx` : Carte d'informations du nœud
- `app/user/components/ui/RecommendationCard.tsx` : Carte de recommandation avec actions
- `app/user/components/ui/UpgradePrompt.tsx` : Prompts d'upgrade vers Premium
- `app/user/components/ui/GamificationCenter.tsx` : Centre de gamification
- `app/user/components/ui/ProfileCompletion.tsx` : Completion de profil avec score
- `app/user/components/ui/SmartRecommendations.tsx` : Recommandations IA intelligentes
- `app/user/components/ui/PremiumConversionModal.tsx` : Modal de conversion premium
- `app/user/components/ui/MobileBurgerMenu.tsx` : Menu burger optimisé mobile
- `app/user/components/ui/RealTimeStats.tsx` : Statistiques temps réel
- `app/user/components/ui/PerformanceMetrics.tsx` : Métriques de performance détaillées

## Patterns d'Intégration

### Authentification et données
- Utilisation de `useUserData()` hook personnalisé pour la gestion état utilisateur
- Sessions JWT + Supabase avec gestion automatique des tokens
- Pattern de récupération avec `session.access_token` dans headers Authorization
- Gestion systématique des états loading/error/success avec toast notifications

### Conversion et engagement (système CRM intégré)
- Système de scoring utilisateur avec points de progression
- Gamification avec achievements et milestones
- Call-to-action adaptatifs selon le statut premium/free
- Recommandations IA avec modèle freemium (floutes pour premium)
- Prompts d'upgrade contextuels avec A/B testing intégré

### Intelligence artificielle intégrée
- Dazia IA : Recommandations personnalisées basées sur les données du nœud
- RAG insights : Analyse de documents et contextualisation
- Simulation de performance en temps réel
- Alertes intelligentes et prédictives

### UX moderne et responsive
- Design Tailwind avec système d'animations personnalisées
- Dark mode automatique et manuel
- Mobile-first avec composants adaptatifs
- Widgets temps réel avec WebSocket pour certaines métriques
- Cards avec micro-interactions et effets hover sophistiqués
- Gradients et glassmorphism pour les éléments premium