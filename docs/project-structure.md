# Structure du Projet DazBox

## Organisation des Répertoires

dazbox/
├── app/ # Dossier principal de l'application Next.js
│ ├── api/ # Routes API (non internationalisées)
│ │ ├── auth/ # Routes d'authentification
│ │ ├── user/ # Routes utilisateur
│ │ └── ... # Autres routes API
│ ├── [locale]/ # Routes internationalisées
│ │ ├── @app/ # Routes protégées
│ │ ├── @auth/ # Routes d'authentification
│ │ ├── @modal/ # Routes modales (intercepting)
│ │ ├── @dashboard/ # Routes parallèles
│ │ └── ... # Autres routes
│ ├── components/ # Composants réutilisables globaux
│ │ ├── ui/ # Composants UI de base
│ │ ├── auth/ # Composants d'authentification
│ │ └── ... # Autres composants
│ ├── lib/ # Utilitaires et helpers
│ ├── hooks/ # Hooks personnalisés
│ ├── services/ # Services métier
│ ├── types/ # Types TypeScript
│ └── i18n/ # Configuration et fichiers de traduction
├── public/ # Fichiers statiques
│ ├── images/ # Images
│ ├── fonts/ # Polices
│ └── ... # Autres ressources statiques
├── docs/ # Documentation
├── tests/ # Tests
└── scripts/ # Scripts utilitaires

## Répertoires Principaux

### `/app`

Contient le code principal de l'application Next.js, organisé selon l'App Router.

#### `/app/api`

Routes API de l'application, non internationalisées. Organisées par domaine fonctionnel.

#### `/app/[locale]`

Routes internationalisées de l'application. Utilise des groupes de routes pour organiser les fonctionnalités :

- `@app` - Routes protégées nécessitant une authentification
- `@auth` - Routes d'authentification
- `@modal` - Routes interceptées pour les modals
- `@dashboard` - Fonctionnalités principales du tableau de bord

#### `/app/components`

Composants réutilisables globaux. Organisés par type de composant :

- `ui` - Composants UI de base (boutons, inputs, etc.)
- `auth` - Composants liés à l'authentification
- `layout` - Composants de mise en page
- `checkout` - Composants liés au processus d'achat
- `daz-ia` - Composants des services IA
- `learning` - Composants du CMS

#### `/app/lib`

Utilitaires et helpers partagés dans toute l'application.

#### `/app/hooks`

Hooks React personnalisés.

#### `/app/services`

Services métier pour interagir avec les APIs et gérer la logique.

#### `/app/types`

Définitions de types TypeScript partagés.

#### `/app/i18n`

Configuration et fichiers pour l'internationalisation.

### `/public`

Fichiers statiques accessibles depuis le navigateur.

### `/docs`

Documentation du projet.

### `/__tests__`

Tests unitaires et d'intégration.

### `/scripts`

Scripts utilitaires pour le développement et le déploiement.

## Organisation des Composants

### Composants globaux

Les composants réutilisables dans toute l'application sont placés dans `/app/components`.

### Composants spécifiques aux fonctionnalités

Les composants spécifiques à une fonctionnalité sont placés dans `_components` à côté de la page qui les utilise.

Exemple :

```
app/[locale]/@dashboard/dazbox/
├── page.tsx
└── _components/
    ├── ProductCard.tsx
    └── ProductDetails.tsx
```

Cette organisation facilite la maintenance et la compréhension du code en gardant les composants proches de leur utilisation.
