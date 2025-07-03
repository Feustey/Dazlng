# Meilleures Pratiques TypeScript

## Types et Interfaces

### Définition des types

```typescript
// ✅ CORRECT - Interface pour les objets
interface PaymentStatus {
  status: "pending" | "paid" | "failed"
  hash: string
  amount: number
}

// ✅ CORRECT - Type pour les unions
type PaymentMethod = "lightning" | "onchain"

// ❌ INCORRECT - Type pour les objets
type PaymentStatus = {
  status: string
  hash: string
  amount: number
}
```

### Génériques

```typescript
// ✅ CORRECT - Générique contraint
interface ApiResponse<T extends Record<string, any>> {
  success: boolean
  data?: T
  error?: ApiError
}

// ❌ INCORRECT - Générique non contraint
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: any
}
```

### Enums

```typescript
// ✅ CORRECT - Const enum pour les valeurs fixes
const enum ErrorCode {
  ValidationError = "VALIDATION_ERROR",
  PaymentError = "PAYMENT_ERROR"
}

// ❌ INCORRECT - Enum standard
enum ErrorCode {
  ValidationError = "VALIDATION_ERROR",
  PaymentError = "PAYMENT_ERROR"
}
```

## Validation

### Zod

```typescript
// ✅ CORRECT - Schéma Zod avec inférence
const PaymentSchema = z.object({
  amount: z.number().min(1),
  description: z.string()
})
type Payment = z.infer<typeof PaymentSchema>

// ❌ INCORRECT - Type manuel
type Payment = {
  amount: number
  description: string
}
```

### Assertions

```typescript
// ✅ CORRECT - Type guard personnalisé
function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof Error &&
    "code" in error &&
    "details" in error
}

// ❌ INCORRECT - Type assertion forcée
const error = someError as PaymentError
```

## Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Règles importantes

1. Utiliser `interface` pour les objets, `type` pour les unions
2. Préférer les const enums aux enums standards
3. Utiliser Zod pour la validation runtime
4. Créer des type guards plutôt que des assertions
5. Activer le mode strict TypeScript
6. Éviter `any`, préférer `unknown`
7. Utiliser les génériques avec contraintes
8. Documenter les types complexes