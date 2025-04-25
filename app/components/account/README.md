# Documentation des Composants de Compte Utilisateur

## Structure de la Base de Données

### Tables Principales

#### 1. Table `users`

- **Champs**:
  - `id`: UUID (clé primaire)
  - `name`: string (nullable)
  - `email`: string (unique)
  - `phone`: string (nullable)
  - `company`: string (nullable)
  - `settings`: JSONB (nullable)
    - `notifications`: boolean
    - `language`: string
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 2. Table `orders`

- **Champs**:
  - `id`: UUID (clé primaire)
  - `user_id`: UUID (clé étrangère vers users)
  - `product_type`: enum ('dazenode', 'daz-ia')
  - `plan`: string (nullable)
  - `billing_cycle`: string (nullable)
  - `amount`: integer
  - `payment_method`: string
  - `payment_status`: enum ('pending', 'paid', 'failed', 'refunded')
  - `metadata`: JSONB (nullable)
    - `node_type`: string
    - `subscription_id`: string
    - `features`: string[]
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 3. Table `deliveries`

- **Champs**:
  - `id`: UUID (clé primaire)
  - `order_id`: UUID (clé étrangère vers orders)
  - `address`: string (nullable)
  - `city`: string (nullable)
  - `zip_code`: string (nullable)
  - `country`: string (nullable)
  - `shipping_status`: enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  - `tracking_number`: string (nullable)
  - `notes`: string (nullable)
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 4. Table `payments`

- **Champs**:
  - `id`: UUID (clé primaire)
  - `order_id`: UUID (clé étrangère vers orders)
  - `amount`: integer
  - `currency`: string
  - `status`: enum ('pending', 'completed', 'failed', 'refunded')
  - `payment_method`: string
  - `transaction_id`: string (nullable)
  - `created_at`: timestamp
  - `updated_at`: timestamp

#### 5. Table `checkout_sessions`

- **Champs**:
  - `id`: UUID (clé primaire)
  - `user_id`: UUID (clé étrangère vers users)
  - `order_id`: UUID (clé étrangère vers orders, nullable)
  - `status`: string
  - `amount`: integer
  - `currency`: string
  - `payment_method`: string (nullable)
  - `payment_status`: string
  - `metadata`: JSONB (nullable)
  - `created_at`: timestamp
  - `updated_at`: timestamp

### Fonctions Utilitaires

#### 1. `get_user_total_orders`

- **Paramètres**:
  - `user_id`: UUID
- **Retourne**: number (montant total des commandes payées)

#### 2. `check_order_status`

- **Paramètres**:
  - `order_id`: UUID
- **Retourne**: string (statut de la commande)

## Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS avec les politiques suivantes :

1. **Table `users`**:

   - Lecture : utilisateurs peuvent voir leurs propres données
   - Mise à jour : utilisateurs peuvent modifier leurs propres données

2. **Table `orders`**:

   - Lecture : utilisateurs peuvent voir leurs propres commandes
   - Création : utilisateurs peuvent créer des commandes

3. **Table `deliveries`**:

   - Lecture : utilisateurs peuvent voir les livraisons liées à leurs commandes

4. **Table `payments`**:

   - Lecture : utilisateurs peuvent voir les paiements liés à leurs commandes

5. **Table `checkout_sessions`**:
   - Lecture : utilisateurs peuvent voir leurs propres sessions
   - Création : utilisateurs peuvent créer des sessions

## Performance

### Index

- `idx_orders_user_id` sur `orders(user_id)`
- `idx_orders_payment_status` sur `orders(payment_status)`
- `idx_deliveries_order_id` sur `deliveries(order_id)`
- `idx_payments_order_id` sur `payments(order_id)`
- `idx_checkout_sessions_user_id` sur `checkout_sessions(user_id)`

### Triggers

- Mise à jour automatique de `updated_at` sur toutes les tables

## Types TypeScript

Les types TypeScript sont définis dans `app/lib/supabase.types.ts` et reflètent exactement la structure de la base de données. Ils incluent :

1. Types pour chaque table (`Row`, `Insert`, `Update`)
2. Types pour les fonctions utilitaires
3. Types pour les enums et les champs JSONB

## Utilisation

### Exemple de Création d'Utilisateur

```typescript
const { data, error } = await supabase.from("users").insert({
  email: "user@example.com",
  name: "John Doe",
  settings: {
    notifications: true,
    language: "fr",
  },
});
```

### Exemple de Création de Commande

```typescript
const { data, error } = await supabase.from("orders").insert({
  user_id: userId,
  product_type: "dazenode",
  plan: "pro",
  billing_cycle: "monthly",
  amount: 1000,
  payment_method: "card",
  payment_status: "pending",
  metadata: {
    node_type: "raspberry_pi",
    features: ["vpn", "backup"],
  },
});
```

### Exemple d'Utilisation des Fonctions Utilitaires

```typescript
const { data: totalOrders } = await supabase.rpc("get_user_total_orders", {
  user_id: userId,
});

const { data: orderStatus } = await supabase.rpc("check_order_status", {
  order_id: orderId,
});
```

## UserProfile

Le composant `UserProfile` permet aux utilisateurs de gérer leurs informations personnelles.

### Props

Aucune prop n'est requise. Le composant utilise le hook `useSession` de NextAuth pour récupérer les informations de l'utilisateur.

### Fonctionnalités

- Affichage des informations de l'utilisateur
- Mode édition/lecture
- Validation des champs
- Sauvegarde automatique

### Utilisation

```tsx
import { UserProfile } from "@/components/account/UserProfile";

export default function AccountPage() {
  return (
    <div>
      <UserProfile />
    </div>
  );
}
```

## SettingsForm

Le composant `SettingsForm` permet aux utilisateurs de gérer leurs préférences.

### Props

Aucune prop n'est requise.

### Fonctionnalités

- Gestion des notifications (email, SMS)
- Mode sombre
- Sauvegarde automatique des préférences

### Utilisation

```tsx
import { SettingsForm } from "@/components/account/SettingsForm";

export default function AccountPage() {
  return (
    <div>
      <SettingsForm />
    </div>
  );
}
```

## OrdersList

Le composant `OrdersList` affiche l'historique des commandes de l'utilisateur.

### Props

Aucune prop n'est requise.

### Fonctionnalités

- Filtrage par type de produit (Daznode, Daz-IA)
- Affichage du statut des commandes
- Détails des commandes

### Utilisation

```tsx
import { OrdersList } from "@/components/account/OrdersList";

export default function AccountPage() {
  return (
    <div>
      <OrdersList />
    </div>
  );
}
```

## Tests

Les composants sont testés avec :

- Tests unitaires
- Tests d'accessibilité (aXe)
- Tests de rendu
- Tests d'interaction

Pour exécuter les tests :

```bash
npm test
```

## Accessibilité

Tous les composants sont conformes aux standards WCAG 2.1 avec :

- Labels ARIA appropriés
- Rôles sémantiques
- Navigation au clavier
- Contraste des couleurs
- Messages d'erreur accessibles

## Performance

Les composants sont optimisés pour la performance avec :

- Chargement différé
- Mise en cache des données
- Optimisation des re-rendus
- Animations fluides
