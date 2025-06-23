# Routes API DazNode

## 🔒 Bonnes Pratiques Supabase

### 1. Création des Clients

Utiliser UNIQUEMENT les fonctions suivantes :

```typescript
// Pour les opérations authentifiées standard
import { createSupabaseServerClient } from '@/lib/supabase-auth';
const supabase = await createSupabaseServerClient();

// Pour les opérations admin
import { getSupabaseAdminClient } from '@/lib/supabase';
const adminClient = getSupabaseAdminClient();
```

### 2. Utilitaires API

Utiliser les utilitaires standardisés :

```typescript
import { withAuth, withAdminAuth, handleApiError } from '@/lib/api-utils';

// Route authentifiée standard
export async function GET(req: NextRequest) {
  return withAuth(req, async (user) => {
    try {
      // ... logique de la route
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
}

// Route admin
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (adminUser) => {
    try {
      // ... logique de la route
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
}
```

### 3. Format de Réponse Standard

```typescript
// Succès
return NextResponse.json({
  success: true,
  data: {
    // ... données
  },
  meta?: {
    // ... métadonnées (pagination, etc.)
  }
});

// Erreur
return NextResponse.json({
  success: false,
  error: {
    code: ErrorCodes.SOME_ERROR,
    message: 'Message d\'erreur',
    details?: any
  }
}, { status: 4xx/5xx });
```

### 4. Validation des Données

```typescript
import { z } from 'zod';

const schema = z.object({
  // ... définition du schema
});

const result = schema.safeParse(data);
if (!result.success) {
  return NextResponse.json({
    success: false,
    error: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Données invalides',
      details: result.error.issues
    }
  }, { status: 400 });
}
```

### 5. Gestion des Erreurs

- Utiliser `handleApiError` pour toutes les erreurs
- Logger les erreurs avec `console.error`
- Ne pas exposer les détails techniques en production
- Utiliser les codes d'erreur standardisés de `ErrorCodes`

### 6. Sécurité

- Ne JAMAIS exposer `SUPABASE_SERVICE_ROLE_KEY`
- Utiliser `withAdminAuth` pour les routes admin
- Valider toutes les entrées utilisateur
- Utiliser RLS pour les tables sensibles

### 7. Performance

- Utiliser la pagination pour les listes
- Optimiser les requêtes avec `select` ciblé
- Utiliser les index appropriés
- Mettre en cache quand possible

### 8. Tests

- Créer des tests pour chaque route
- Mocker les réponses Supabase
- Tester les cas d'erreur
- Valider le format de réponse

### 9. Documentation

- Documenter les paramètres de requête
- Spécifier les formats de réponse
- Décrire les cas d'erreur
- Ajouter des exemples d'utilisation 