# Composants de DazBox

## Vue d'Ensemble

Les composants de DazBox sont organisés en plusieurs catégories selon leur fonction et leur réutilisabilité. Cette documentation décrit les composants principaux de l'application.

## Composants Globaux

Les composants globaux sont des composants réutilisables dans toute l'application.

### UI Components (`app/components/ui/`)

Composants de base pour l'interface utilisateur :

- `Button` - Boutons avec différents styles et états
- `Input` - Champs de saisie
- `Card` - Conteneurs pour le contenu
- `Modal` - Fenêtres modales
- `Toast` - Notifications
- `Loading` - Indicateurs de chargement
- `Error` - Messages d'erreur

### Layout Components (`app/components/layout/`)

Composants de mise en page :

- `Header` - En-tête de l'application
- `Footer` - Pied de page
- `Sidebar` - Barre latérale
- `Container` - Conteneur de mise en page
- `Grid` - Système de grille

### Auth Components (`app/components/auth/`)

Composants liés à l'authentification :

- `LoginForm` - Formulaire de connexion
- `RegisterForm` - Formulaire d'inscription
- `PasswordReset` - Réinitialisation de mot de passe
- `ProfileForm` - Gestion du profil utilisateur

### Checkout Components (`app/components/checkout/`)

Composants liés au processus d'achat :

- `Cart` - Panier d'achat
- `CheckoutForm` - Formulaire de paiement
- `OrderSummary` - Récapitulatif de commande
- `PaymentMethods` - Méthodes de paiement
- `OrderConfirmation` - Confirmation de commande

### Daz-IA Components (`app/components/daz-ia/`)

Composants liés aux services d'IA :

- `ChatInterface` - Interface de chat avec l'IA
- `ServiceCard` - Présentation des services d'IA
- `FeatureList` - Liste des fonctionnalités
- `Pricing` - Tableaux de prix

### Learning Components (`app/components/learning/`)

Composants pour la section CMS :

- `CourseCard` - Carte de cours
- `LessonContent` - Contenu des leçons
- `ProgressTracker` - Suivi de progression
- `Quiz` - Questionnaires

## Composants Spécifiques

Les composants spécifiques sont des composants utilisés dans des contextes particuliers.

### DazBox Components (`app/[locale]/dazbox/_components/`)

- `ProductGallery` - Galerie de produits
- `ProductDetails` - Détails du produit
- `Specifications` - Spécifications techniques
- `Reviews` - Avis clients

### Dashboard Components (`app/[locale]/@dashboard/_components/`)

- `OrderHistory` - Historique des commandes
- `OrderDetails` - Détails d'une commande
- `AccountSettings` - Paramètres du compte
- `BillingHistory` - Historique de facturation

## Règles de Développement

### Server vs Client Components

- Utiliser les Server Components par défaut
- Utiliser les Client Components uniquement pour :
  - L'interactivité utilisateur
  - Les hooks React
  - Les APIs du navigateur
  - Les animations

### Organisation des Fichiers

- Un composant par fichier
- Nommer les fichiers en PascalCase
- Placer les composants spécifiques dans `_components/`
- Utiliser des dossiers pour regrouper les composants liés

### Styles

- Utiliser Tailwind CSS pour le styling
- Éviter les styles inline
- Utiliser des classes utilitaires
- Maintenir la cohérence des styles

### Props

- Utiliser TypeScript pour les types de props
- Documenter les props obligatoires
- Fournir des valeurs par défaut quand possible
- Éviter les props trop nombreuses

### Tests

- Écrire des tests unitaires pour les composants
- Tester les différents états et props
- Utiliser React Testing Library
- Maintenir une bonne couverture de tests
