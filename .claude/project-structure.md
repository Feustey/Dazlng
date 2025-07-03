# Structure du Projet DazNode (Mise à jour 2024)

Ce projet est une application Next.js 14.1.0 avec App Router, spécialisée dans la gestion de nœuds Lightning Network. L'application utilise Tailwind CSS pour le styling, Supabase pour la base de données, et intègre l'IA (Claude, OpenAI) pour des recommandations avancées.

## Organisation des Dossiers

### App Router (Next.js 14.1.0)
- `app/` : Pages et routes Next.js
  - **Pages produits** : DazNode, DazBox, DazPay, DazFlow avec leurs checkouts respectifs
  - **Pages publiques** : about, contact, help, terms, coming-soon
  - `api/` : Routes API étendues (auth, payments, Lightning, AI, proxy)
  - `auth/`, `register/` : Authentification avec OTP et Lightning wallet connect
  - `user/` : Espace utilisateur complet avec dashboard, gestion nœud, IA recommendations
  - `admin/` : Panel d'administration avec CRM, analytics, gestion utilisateurs

### Composants et Logique
- `components/` : Composants réutilisables
  - `shared/` : Composants partagés (Navigation, UI de base, layout)
  - `web/` : Composants spécifiques web (LightningPayment, QR codes)
  - Composants spécialisés par page dans leurs dossiers respectifs
- **Tous les styles sont en classes Tailwind** avec animations et dark mode
- `lib/` : Services, utilitaires, validations, clients API
- `hooks/` : Custom hooks React (useToast, useUserData, etc.)
- `types/` : Définitions TypeScript pour Lightning, CRM, utilisateurs

### Ressources et Configuration
- `public/assets/` : Images, logos, favicon
- `constants/` : Constantes globales et configuration
- `utils/` : Fonctions utilitaires (formatage, validation)
- `messages/` : Fichiers de traduction (fr.json, en.json)
- `scripts/` : Scripts de test, migration, et maintenance
- `supabase/migrations/` : Migrations de base de données

### Internationalisation
- `next-intl` : Support français/anglais
- Middleware pour détection de langue
- Messages centralisés par langue

## Conventions

- **TypeScript strict** : Configuration stricte activée pour toute l'app
- **Tailwind CSS** : Système de design complet avec animations personnalisées
- **Composants** : Structure modulaire avec composants spécialisés par section
- **API Routes** : Architecture RESTful avec validation Zod et gestion d'erreurs
- **Authentification** : Multi-méthodes (email + OTP, Lightning wallet)
- **Responsive** : Mobile-first avec optimisations spécifiques

## Technologies Clés
- **Frontend** : Next.js 14.1.0, React 18, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Supabase (PostgreSQL)
- **Authentification** : Supabase Auth + Custom JWT + Lightning wallets
- **Paiements** : Lightning Network (LND, Core Lightning, Alby, NWC)
- **IA** : Anthropic Claude, OpenAI integration
- **Monitoring** : Umami analytics, custom performance tracking
- **Internationalisation** : next-intl (FR/EN)

## Fichiers de Configuration
- `next.config.js` : Configuration Next.js avec optimisations de performance
- `tailwind.config.js` : Configuration Tailwind avec animations personnalisées
- `tsconfig.json` : Configuration TypeScript stricte
- `package.json` : Dépendances et scripts de développement
- `middleware.ts` : Middleware pour auth, i18n, rate limiting

---

**Résumé** :  
- Application Lightning Network complète et enterprise-ready
- Architecture scalable avec séparation des responsabilités claire
- Intégration IA avancée pour recommandations personnalisées  
- CRM et analytics intégrés pour la gestion utilisateurs
- Support multi-wallets Lightning Network
- Internationalisation et responsive design