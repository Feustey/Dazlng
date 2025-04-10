# Standards pour les Routes API dans Next.js

## Principes généraux

1. **Utiliser les utilitaires standardisés** - Pour maintenir une cohérence dans toutes les API, toujours utiliser les utilitaires `successResponse` et `errorResponse` définis dans `app/lib/api/responses.ts`.

2. **Stratégies de cache adaptées** - Éviter d'utiliser `dynamic = "force-dynamic"` sauf en cas de nécessité absolue.

3. **Structure de réponse uniforme** - Toutes les réponses doivent suivre le même format.

## Structure de réponse

### Réponse réussie

```json
{
  "success": true,
  "data": { ... }
}
```

### Réponse d'erreur

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

## Stratégies de mise en cache

Suivant le type de donnée, utilisez la stratégie appropriée :

- **Données statiques ou qui changent rarement** : `export const revalidate = 3600; // 1 heure`
- **Données semi-dynamiques** : `export const revalidate = 60; // 1 minute`
- **Données vraiment dynamiques** : Utilisez la validation à la demande avec `revalidatePath()` ou `revalidateTag()`

Évitez d'utiliser `dynamic = "force-dynamic"` quand c'est possible, car cela désactive complètement la mise en cache.

## Quand utiliser force-dynamic

Utilisez `force-dynamic` uniquement dans ces cas :

- Données nécessitant une fraîcheur absolue à chaque requête (ex: informations de paiement)
- Routes authentifiées où le cache pourrait poser des problèmes de sécurité
- Données qui doivent être différentes pour chaque utilisateur et chaque requête

## Gestion des erreurs

- Utilisez les constantes `HttpStatus` pour les codes d'état
- Capturez toujours les exceptions avec try/catch
- Journalisez les erreurs côté serveur avant de renvoyer une réponse
- Évitez de renvoyer des détails d'erreur sensibles aux clients

## Exemple

```typescript
import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../lib/api/responses";

// Revalidation toutes les heures
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const data = await fetchSomeData();
    return successResponse(data);
  } catch (error) {
    console.error("Error:", error);
    return errorResponse("Message d'erreur", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
```
