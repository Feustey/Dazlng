# Patterns des Routes API

## Structure de base

```typescript
// ✅ CORRECT - Route avec validation et gestion d'erreur
export async function POST(req: Request) {
  try {
    const data = await validateRequestBody(req)
    const result = await handleRequest(data)
    return json({ success: true, data: result })
  } catch (error) {
    return handleApiError(error)
  }
}

// ❌ INCORRECT - Route sans validation
export async function POST(req: Request) {
  const data = await req.json()
  const result = await handleRequest(data)
  return json({ success: true, data: result })
}
```

## Validation des requêtes

```typescript
// ✅ CORRECT - Schéma Zod avec parsing
const schema = z.object({
  amount: z.number().min(1).max(16777215),
  description: z.string().min(1)
})

const data = await validateRequestBody(req, schema)

// ❌ INCORRECT - Validation manuelle
const { amount, description } = await req.json()
if (!amount || amount < 1) throw new Error("Invalid amount")
```

## Réponses standardisées

```typescript
// ✅ CORRECT - Format de réponse unifié
return json<ApiResponse<InvoiceData>>({
  success: true,
  data: invoice,
  meta: { timestamp: new Date().toISOString() }
})

// ❌ INCORRECT - Format inconsistant
return json({ invoice })
```

## Gestion des erreurs

```typescript
// ✅ CORRECT - Erreurs typées et standardisées
if (error instanceof ZodError) {
  return json({
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: error.errors
    }
  }, { status: 400 })
}

// ❌ INCORRECT - Erreurs non standardisées
return json({ error: "Invalid data" }, { status: 400 })
```

## Logging

```typescript
// ✅ CORRECT - Logging structuré
logger.info({
  type: "payment_created",
  amount,
  status: "pending"
})

// ❌ INCORRECT - Logging minimal
console.log("Payment created")
```

## Règles importantes

1. Valider toutes les entrées avec Zod
2. Utiliser le format de réponse standardisé
3. Gérer les erreurs de manière cohérente
4. Logger les opérations importantes
5. Utiliser les types TypeScript stricts
6. Respecter les conventions REST