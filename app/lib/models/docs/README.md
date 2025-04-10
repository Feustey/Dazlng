# Architecture des Modèles Mongoose

Ce dossier contient l'implémentation des modèles Mongoose pour l'application DazLng, avec une architecture optimisée pour Next.js App Router.

## Structure

```
app/lib/models/
├── index.ts          # Point d'entrée principal avec pattern Singleton et gestion client/serveur
├── schema/
│   └── index.ts      # Définition des schémas Mongoose
└── docs/
    └── README.md     # Cette documentation
```

## Caractéristiques principales

- **Pattern Singleton** : Les modèles sont initialisés une seule fois par session serveur
- **Compatible isomorphique** : Fonctionne à la fois côté client et serveur
- **Compatible Edge Runtime** : Support des middlewares Next.js grâce aux modèles factices
- **Système de cache** : Optimisation des requêtes fréquentes
- **Logging intégré** : Suivi des opérations de base de données

## Utilisation

### Import des modèles

Toujours utiliser les exports avec suffixe `Model` pour garantir la compatibilité isomorphique :

```typescript
import { UserModel, NodeModel } from "@/app/lib/models";

// Utilisation dans un composant Server Component
export async function getData() {
  const users = await UserModel.find();
  return users;
}
```

### Utilisation du cache

Le système de cache permet d'optimiser les requêtes fréquentes :

```typescript
import { NodeModel, cachedQuery } from "@/app/lib/models";

// Requête avec mise en cache
const topNodes = await cachedQuery(
  NodeModel,
  (model) => model.find().sort({ capacity: -1 }).limit(10),
  "top-nodes",
  300000 // TTL de 5 minutes
);
```

## Points d'attention

### Compatibilité Edge Runtime

Nous utilisons une approche d'objets factices pour le Edge Runtime :

- Les modèles détectent automatiquement l'environnement Edge
- En Edge Runtime, les modèles retournent des objets factices avec API compatible
- Évitez les opérations complexes de base de données dans les middlewares
- Pour les API qui nécessitent MongoDB, utilisez des Route Handlers avec `runtime: 'nodejs'`

```typescript
// middleware.ts
// L'import des modèles est sécurisé grâce aux objets factices
import { UserModel } from "@/app/lib/models";

// route.ts (API)
export const runtime = "nodejs"; // Spécifiez nodejs pour utiliser MongoDB/Mongoose

export async function GET() {
  const users = await UserModel.find();
  return Response.json(users);
}
```

### Tests

Pour tester les modèles :

```typescript
// Dans vos tests
import { UserModel } from "@/app/lib/models";
import { getServerSession } from "next-auth";

// Mock la session pour les tests
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Test d'exemple
it("should fetch user data", async () => {
  // Arrange
  const mockUser = { _id: "123", name: "Test User" };
  jest.spyOn(UserModel, "findById").mockResolvedValue(mockUser);

  // Act
  const result = await getUserData("123");

  // Assert
  expect(result).toEqual(mockUser);
});
```

## Bonnes pratiques

1. **Toujours utiliser les exports `*Model`** au lieu des modèles directs
2. **Implémenter des méthodes statiques** sur les schémas pour les opérations fréquentes
3. **Utiliser le cache** pour les requêtes répétées avec peu de changements
4. **Vérifier le contexte d'exécution** avant d'utiliser Mongoose
