# Architecture du Projet DazLng

## Structure des Dossiers

```
dazlng/
├── app/                    # Dossier principal de l'application Next.js
│   ├── api/               # Routes API (non internationalisées)
│   │   ├── auth/         # Routes d'authentification
│   │   ├── user/         # Routes utilisateur
│   │   └── ...           # Autres routes API
│   ├── [locale]/         # Routes internationalisées
│   │   ├── @app/         # Routes protégées
│   │   ├── @auth/        # Routes d'authentification
│   │   ├── @modal/       # Routes modales (intercepting)
│   │   ├── @dashboard/   # Routes parallèles
│   │   └── ...           # Autres routes
│   ├── components/       # Composants réutilisables globaux
│   │   ├── ui/          # Composants UI de base
│   │   ├── auth/        # Composants d'authentification
│   │   ├── network/     # Composants liés au réseau
│   │   └── ...          # Autres composants
│   ├── lib/             # Utilitaires et helpers
│   ├── hooks/           # Hooks personnalisés
│   ├── services/        # Services métier
│   ├── types/           # Types TypeScript
│   └── i18n/            # Configuration et fichiers de traduction
├── public/              # Fichiers statiques
├── scripts/             # Scripts utilitaires
├── __tests__/          # Tests
└── docs/               # Documentation
```

## Règles d'Organisation

### 1. Structure des Routes

- Les routes API doivent être dans `app/api/` (non internationalisées)
- Les routes internationalisées doivent être dans `app/[locale]/`
- Utiliser les groupes de routes (@) pour :
  - Les sections protégées (`@app/`)
  - Les routes d'authentification (`@auth/`)
  - Les routes parallèles (`@dashboard/`)
  - Les modals (`@modal/`)
  - Les pages statiques (`@static/`)

#### Routes Parallèles

- `@dashboard/` : Interface principale de l'application

  - `network/` : Fonctionnalités réseau
  - `node/` : Gestion des nœuds
  - `channels/` : Gestion des canaux
  - `payment/` : Paiements et transactions
  - `checkout/` : Processus de paiement
  - `daz-ia/` : Fonctionnalités IA

- `@modal/` : Routes pour les modals et popups

  - `order-confirmation/` : Confirmation de commande
  - `review/` : Avis et évaluations

- `@static/` : Pages statiques et informations

  - `about/` : À propos
  - `terms/` : Conditions d'utilisation
  - `privacy/` : Politique de confidentialité
  - `help/` : Centre d'aide
  - `contact/` : Contact

- `@auth/` : Routes d'authentification

  - `login/` : Connexion
  - `register/` : Inscription
  - `verify/` : Vérification
  - `reset-password/` : Réinitialisation du mot de passe

- `@app/` : Routes protégées de l'application
  - `settings/` : Paramètres utilisateur
  - `profile/` : Profil utilisateur
  - `orders/` : Historique des commandes

#### Routes Interceptées

Les routes interceptées permettent d'afficher des modals tout en conservant l'URL de la page parente. Elles sont identifiées par le préfixe `(.)` dans le nom du dossier.

##### Structure

```
app/[locale]/
├── @modal/
│   ├── (.)order-confirmation/
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── OrderConfirmationContent.tsx
│   └── (.)review/
│       ├── page.tsx
│       └── _components/
│           └── ReviewContent.tsx
```

##### Règles d'Utilisation

- Utiliser les routes interceptées pour :

  - Les modals de confirmation
  - Les formulaires modaux
  - Les dialogues de confirmation
  - Les popups d'information

- Structure des composants :

  - `page.tsx` : Wrapper du modal avec le composant Modal
  - `_components/` : Composants spécifiques au modal

- Navigation :
  - Utiliser `router.back()` pour fermer le modal
  - Utiliser `useSearchParams` pour passer des paramètres
  - Éviter les redirections directes dans les modals

##### Exemple d'Utilisation

```tsx
// Dans un composant parent
<Link href="/@modal/order-confirmation?orderId=123">Voir la confirmation</Link>;

// Dans le modal
const searchParams = useSearchParams();
const orderId = searchParams.get("orderId");
```

#### Règles de Routage

- Éviter les routes imbriquées trop profondément
- Les routes parallèles doivent partager un layout commun
- Les modals doivent être accessibles via des routes interceptées
- Les pages statiques doivent être dans `@static/`

### 2. Composants

#### Organisation

- Composants globaux/réutilisables : `app/components/`

  - `ui/` : Composants UI de base (boutons, inputs, etc.)
  - `layout/` : Composants de mise en page (header, footer, etc.)
  - `providers/` : Providers React (theme, auth, etc.)
  - `emails/` : Templates d'emails
  - `transactions/` : Composants liés aux transactions

- Composants spécifiques aux fonctionnalités : `app/[locale]/feature/_components/`

  - `network/_components/` : Composants liés au réseau Lightning
  - `node/_components/` : Composants liés aux nœuds
  - `channels/_components/` : Composants liés aux canaux
  - `@auth/_components/` : Composants d'authentification
  - `payment/_components/` : Composants de paiement
  - `checkout/_components/` : Composants de checkout
  - `daz-ia/_components/` : Composants de l'IA
  - `about/_components/` : Composants de la page À propos

- Composants de page : `app/[locale]/_components/`
  - Composants spécifiques à la page d'accueil
  - Composants partagés entre les pages

#### Server vs Client Components

Voir le guide détaillé dans [docs/server-client-components.md](./server-client-components.md)

##### Règles Principales

1. **Par Défaut : Server Components**

   - Utiliser pour l'accès aux données
   - Opérations sensibles
   - Logique métier complexe
   - Pages statiques

2. **Client Components ("use client")**

   - Interactivité utilisateur
   - Hooks React
   - APIs du navigateur
   - État local et animations

3. **Organisation**

   - `ui/` : Principalement Client Components
   - `features/` : Mix de Server et Client Components
   - Pages : Server Components par défaut

4. **Patterns**
   - Composition Server/Client
   - Lazy loading pour composants lourds
   - Suspense pour le streaming
   - Séparation données/interactivité

#### Règles de Colocation

- Les composants spécifiques à une fonctionnalité doivent être placés dans le dossier `_components` de cette fonctionnalité
- Les composants partagés entre plusieurs fonctionnalités restent dans `app/components`
- Les composants UI de base restent dans `app/components/ui`
- Les composants de mise en page restent dans `app/components/layout`
- Un composant ne doit pas dépasser 300 lignes (idéalement)

### 3. Internationalisation

- Tous les textes doivent être internationalisés
- Utiliser les clés de traduction cohérentes
- Les fichiers de traduction doivent être dans `app/i18n/locales/`
- Maintenir la parité entre les différentes langues
- Les routes API ne nécessitent pas d'internationalisation

### 4. Styles

- Utiliser Tailwind CSS comme système de design principal
- Éviter les styles inline
- Organiser les classes Tailwind de manière cohérente
- Utiliser les composants UI de base pour la cohérence

### 5. Types et Interfaces

- Définir les types dans `app/types/`
- Utiliser des interfaces plutôt que des types quand possible
- Documenter les types complexes
- Éviter les types any

### 6. Tests

- Les tests doivent être dans `__tests__/`
- Un test par composant/fonctionnalité
- Utiliser Jest et Testing Library
- Maintenir une couverture de tests > 80%

### 7. API Routes

- Organiser les routes API par domaine dans `app/api/`
- Utiliser des handlers séparés pour les différentes méthodes HTTP
- Valider les entrées avec Zod
- Gérer les erreurs de manière cohérente
- Ne pas internationaliser les routes API

### 8. État Global

#### Client State

- Utiliser Zustand pour la gestion de l'état global
- Organiser les stores par domaine dans `app/lib/store/`
- Utiliser `persist` pour la persistance des données
- Éviter les stores trop volumineux

##### Structure des Stores

```
app/lib/store/
├── auth.ts           # État d'authentification
├── notifications.ts  # Gestion des notifications
├── checkout.ts       # Processus de paiement
└── index.ts         # Export des stores
```

##### Règles d'Utilisation

- Un store par domaine fonctionnel
- Utiliser des interfaces TypeScript pour le typage
- Implémenter des actions claires et documentées
- Gérer les erreurs de manière cohérente
- Utiliser `persist` pour les données importantes

##### Exemple de Store

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: false,
      authError: null,

      login: async (email, password) => {
        set({ isAuthLoading: true });
        try {
          // Logique de connexion
        } catch (error) {
          set({ authError: error.message });
        } finally {
          set({ isAuthLoading: false });
        }
      },

      logout: async () => {
        set({ isAuthLoading: true });
        try {
          // Logique de déconnexion
        } finally {
          set({ isAuthLoading: false, user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

##### Bonnes Pratiques

1. **Organisation** :

   - Un store par domaine fonctionnel
   - Actions claires et documentées
   - Gestion cohérente des erreurs

2. **Performance** :

   - Éviter les re-rendus inutiles
   - Utiliser `partialize`
