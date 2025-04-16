# Guide des Server et Client Components

## Principes Généraux

### Server Components (Par défaut)

Les Server Components sont le comportement par défaut dans Next.js 13+. Ils offrent plusieurs avantages :

- Réduction du JavaScript côté client
- Meilleure performance initiale
- Meilleur SEO
- Accès direct aux ressources serveur

#### Quand utiliser les Server Components

```tsx
// app/components/UserProfile.tsx
async function UserProfile({ userId }: { userId: string }) {
  // ✅ Accès direct à la base de données
  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single();

  return <div>{user.name}</div>;
}
```

Utilisez les Server Components pour :

- Accès aux ressources backend (base de données, APIs)
- Opérations sensibles (secrets API, tokens)
- Dépendances lourdes
- Pages statiques ou avec peu d'interactivité
- Logique métier complexe

### Client Components ("use client")

Les Client Components sont nécessaires pour l'interactivité côté client.

#### Quand utiliser les Client Components

```tsx
"use client";

// app/components/ui/Button.tsx
import { useState } from "react";

export function Button({ children }: { children: React.ReactNode }) {
  // ✅ Utilisation de hooks React
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button onClick={() => setIsLoading(true)} disabled={isLoading}>
      {children}
    </button>
  );
}
```

Utilisez les Client Components pour :

- Interactivité utilisateur (onClick, onChange)
- Utilisation de hooks React (useState, useEffect)
- Accès aux APIs du navigateur
- Gestion d'état local
- Animations côté client

## Organisation du Code

### Pattern de Composition

```tsx
// Server Component parent
// app/[locale]/profile/page.tsx
import { UserProfile } from "./UserProfile";
import { EditProfileButton } from "./EditProfileButton";

export default async function ProfilePage() {
  // ✅ Données chargées côté serveur
  const userData = await fetchUserData();

  return (
    <div>
      {/* ✅ Component serveur avec données */}
      <UserProfile user={userData} />

      {/* ✅ Component client pour l'interactivité */}
      <EditProfileButton userId={userData.id} />
    </div>
  );
}
```

### Bonnes Pratiques

1. **Séparation des Responsabilités**

```tsx
// ❌ Éviter de mélanger logique serveur et client
"use client";
async function BadComponent() {
  const data = await fetchFromDatabase(); // Erreur !
  const [state, setState] = useState();
}

// ✅ Séparer les responsabilités
// ServerComponent.tsx
async function DataFetcher() {
  const data = await fetchFromDatabase();
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx
("use client");
function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData);
}
```

2. **Optimisation des Performances**

```tsx
// ❌ Éviter de marquer des composants parents comme client inutilement
"use client";
function ParentComponent() {
  return (
    <div>
      <StaticContent /> {/* Forcé en client inutilement */}
      <InteractiveContent /> {/* Nécessite client */}
    </div>
  );
}

// ✅ Garder le parent en server et isoler les parties interactives
function ParentComponent() {
  return (
    <div>
      <StaticContent /> {/* Reste en server */}
      <ClientInteractiveContent /> {/* Marqué 'use client' */}
    </div>
  );
}
```

3. **Gestion des Données**

```tsx
// ✅ Pattern recommandé pour la gestion des données
// ServerComponent.tsx
async function DataComponent() {
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}

// ClientComponent.tsx
("use client");
function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // Mise à jour et interactivité ici
}
```

## Structure des Dossiers

```
app/
├── components/
│   ├── ui/ (principalement client components)
│   │   ├── Button.tsx ('use client')
│   │   └── Input.tsx ('use client')
│   └── features/ (mix de server et client)
│       ├── UserProfile.tsx (server)
│       └── EditProfile.tsx ('use client')
```

## Règles de Performance

1. **Lazy Loading**

```tsx
// ✅ Charger dynamiquement les composants lourds
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <p>Chargement...</p>,
});
```

2. **Suspense Boundaries**

```tsx
// ✅ Utiliser Suspense pour le streaming
import { Suspense } from "react";

function Page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

## Résumé

- Par défaut, utilisez des Server Components
- Passez en Client Component uniquement quand nécessaire
- Isolez l'interactivité dans des composants clients dédiés
- Utilisez la composition pour optimiser les performances
- Pensez au streaming et au lazy loading pour les composants lourds
