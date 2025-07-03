# Patterns des Composants React

## Composant de paiement Lightning

### Structure de base

```typescript
// ✅ CORRECT - Typage complet avec React.FC
const LightningPayment: React.FC<LightningPaymentProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  // ...
}

// ❌ INCORRECT - Pas de typage
const LightningPayment = (props) => {
  // ...
}
```

### Gestion d'état

```typescript
// ✅ CORRECT - États atomiques
const [status, setStatus] = useState<PaymentStatus>("pending")
const [error, setError] = useState<string | null>(null)
const [timeLeft, setTimeLeft] = useState<number>(300)

// ❌ INCORRECT - État complexe
const [payment, setPayment] = useState({
  status: "pending",
  error: null,
  timeLeft: 300
})
```

### Notifications Toast

```typescript
// ✅ CORRECT - Hook personnalisé
const { showToast } = useToast()
showToast("Paiement réussi !", "success")

// ❌ INCORRECT - Alert natif
alert("Paiement réussi !")
```

### Gestion des erreurs

```typescript
// ✅ CORRECT - Try/catch avec feedback
try {
  await handlePayment()
  showToast("Succès", "success")
} catch (error) {
  showToast(error.message, "error")
  onError?.(error)
}

// ❌ INCORRECT - Pas de gestion d'erreur UI
await handlePayment()
```

### Cleanup

```typescript
// ✅ CORRECT - Nettoyage des intervalles
useEffect(() => {
  const interval = setInterval(checkStatus, 2000)
  return () => clearInterval(interval)
}, [])

// ❌ INCORRECT - Pas de nettoyage
useEffect(() => {
  setInterval(checkStatus, 2000)
}, [])
```

## Règles importantes

1. Utiliser React.FC pour le typage des composants
2. Préférer les états atomiques aux objets complexes
3. Utiliser le hook useToast pour les notifications
4. Gérer et afficher les erreurs proprement
5. Nettoyer les effets et intervalles
6. Supporter le mode sombre et le responsive design