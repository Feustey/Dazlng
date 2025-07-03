# Patterns du Service Lightning

## Création du service

```typescript
// ✅ CORRECT - Utiliser la fonction de création
const lightning = createLightningService()

// ❌ INCORRECT - Ne pas créer d'instance directe
const lightning = new LightningService()
```

## Gestion des erreurs

```typescript
// ✅ CORRECT - Try/catch avec logging
try {
  const invoice = await lightning.createInvoice(amount)
} catch (error) {
  logger.error("❌ LightningService:", error)
  throw new LightningError(error)
}

// ❌ INCORRECT - Pas de gestion d'erreur
const invoice = await lightning.createInvoice(amount)
```

## Validation des montants

```typescript
// ✅ CORRECT - Validation avec Zod
const amount = validateAmount(req.body.amount)

// ❌ INCORRECT - Pas de validation
const amount = req.body.amount
```

## Logging des paiements

```typescript
// ✅ CORRECT - Logging complet
await paymentLogger.log({
  amount,
  status: "pending",
  metadata: { orderId }
})

// ❌ INCORRECT - Logging incomplet
await paymentLogger.log({ amount })
```

## Vérification des paiements

```typescript
// ✅ CORRECT - Polling avec timeout
const status = await lightning.checkPayment(hash, {
  timeout: 5 * 60 * 1000,
  interval: 2000
})

// ❌ INCORRECT - Pas de timeout
while (true) {
  const status = await lightning.checkPayment(hash)
}
```

## Règles importantes

1. Toujours utiliser `createLightningService()` pour obtenir une instance
2. Valider les montants avec les schémas Zod
3. Logger toutes les opérations importantes
4. Gérer les timeouts pour les vérifications
5. Utiliser les types TypeScript stricts