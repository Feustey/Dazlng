app/user/
├── dashboard/
│   └── page.tsx          # Dashboard principal avec KPIs
├── node/
│   ├── page.tsx          # Vue d'ensemble du nœud
│   ├── stats/
│   │   └── page.tsx      # Statistiques détaillées
│   ├── channels/
│   │   └── page.tsx      # Gestion des canaux
│   └── recommendations/
│       └── page.tsx      # Recommandations personnalisées
├── optimize/
│   ├── page.tsx          # Centre d'optimisation
│   └── [feature]/
│       └── page.tsx      # Pages de features spécifiques
├── subscriptions/
│   └── page.tsx          # Gestion abonnements
├── billing/
│   └── page.tsx          # Factures et paiements
├── settings/
│   └── page.tsx          # Paramètres utilisateur
├── components/
│   ├── layout/
│   │   ├── UserSidebar.tsx
│   │   └── UserHeader.tsx
│   └── ui/
│       ├── NodeCard.tsx
│       ├── StatsWidget.tsx
│       ├── RecommendationCard.tsx
│       └── UpgradePrompt.tsx
└── layout.tsx            # Layout wrapper
