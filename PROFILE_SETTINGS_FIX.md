# Correction des Erreurs de Sauvegarde du Profil Utilisateur

## 🐛 Problème Initial
L'utilisateur rencontrait une erreur "Erreur lors de la sauvegarde" dans la page des paramètres (`/user/settings`) lors de la tentative de modification de ses informations personnelles.

## 🔍 Diagnostic
L'erreur provenait de plusieurs problèmes dans l'API de mise à jour du profil :

1. **Validation Zod trop stricte** : Les chaînes vides étaient rejetées
2. **Gestion des valeurs null vs chaînes vides** : Confusion entre `""`, `null` et `undefined`
3. **Messages d'erreur peu informatifs** : Difficile de diagnostiquer le problème
4. **Manque de validation côté client** : Erreurs détectées trop tard

## ✅ Solutions Implémentées

### 1. Amélioration de la Validation Zod (`/api/user/profile/route.ts`)

**Avant :**
```typescript
pubkey: z.union([
  z.string().regex(/^[0-9a-fA-F]{66}$/, 'Pubkey invalide'),
  z.null()
]).optional()
```

**Après :**
```typescript
pubkey: z.union([
  z.string().trim().regex(/^[0-9a-fA-F]{66}$/, 'Clé publique Lightning invalide (66 caractères hexadécimaux requis)'),
  z.string().length(0), // Permet une chaîne vide
  z.null()
]).optional()
```

### 2. Nettoyage Automatique des Données

Ajout d'une fonction utilitaire pour nettoyer les chaînes :

```typescript
const cleanStringValue = (value: string | null | undefined): string | null => {
  if (!value || value.trim() === '') return null;
  return value.trim();
}
```

### 3. Messages d'Erreur Détaillés

**API :**
```typescript
if (error instanceof z.ZodError) {
  const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
  return NextResponse.json({ 
    error: { 
      message: `Données invalides: ${errorMessage}`,
      details: error.errors
    }
  }, { status: 400 })
}
```

**Client :**
```typescript
let errorMessage = 'Erreur lors de la sauvegarde';
if (errorData.error) {
  if (typeof errorData.error === 'string') {
    errorMessage = errorData.error;
  } else if (errorData.error.message) {
    errorMessage = errorData.error.message;
  }
}
setMessage(`❌ ${errorMessage}`);
```

### 4. Validation Côté Client

Ajout de validations préventives dans le formulaire :

```typescript
// Validation pubkey
if (form.pubkey && form.pubkey.trim() !== '') {
  const pubkeyPattern = /^[0-9a-fA-F]{66}$/;
  if (!pubkeyPattern.test(form.pubkey.trim())) {
    setMessage('❌ La clé publique Lightning doit contenir exactement 66 caractères hexadécimaux');
    return;
  }
}

// Validation téléphone
if (form.phone && form.phone.trim() !== '') {
  const phonePattern = /^\+?[1-9]\d{1,14}$/;
  if (!phonePattern.test(form.phone.trim())) {
    setMessage('❌ Format de téléphone invalide (ex: +33123456789)');
    return;
  }
}
```

### 5. Logs de Debugging

Ajout de logs détaillés pour le debugging :

```typescript
console.log('[API] Données reçues pour mise à jour profil:', JSON.stringify(body, null, 2))
console.log('[API] Données validées:', JSON.stringify(validatedData, null, 2))
console.log('[API] Données à sauvegarder:', JSON.stringify(profileData, null, 2))
```

## 🧪 Tests de Validation

### Clés Publiques Lightning
- ✅ `02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b` (66 chars hex)
- ❌ `02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12` (65 chars)
- ❌ `02778g4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b` (caractère invalide)
- ✅ `""` (chaîne vide acceptée)
- ✅ `null` (valeur null acceptée)

### Numéros de Téléphone
- ✅ `+33123456789` (format international)
- ✅ `+1234567890` (format court)
- ❌ `0123456789` (commence par 0)
- ❌ `++33123456789` (double +)
- ✅ `""` (chaîne vide acceptée)

### Gestion des Chaînes
- `"  test  "` → `"test"` (trim automatique)
- `""` → `null` (chaîne vide convertie en null)
- `"   "` → `null` (espaces uniquement convertis en null)
- `null` → `null` (conservé tel quel)
- `undefined` → `null` (converti en null)

## 🚀 Déploiement

```bash
# Build réussi
npm run build
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages (81/81)

# Commit et push
git add app/api/user/profile/route.ts app/user/settings/page.tsx
git commit -m "🔧 Correction erreurs sauvegarde profil utilisateur"
git push origin main
```

## 📝 Instructions pour l'Utilisateur

1. **Connectez-vous** à l'application
2. **Accédez** à `/user/settings`
3. **Modifiez** vos informations :
   - Nom et prénom (texte libre)
   - Clé publique Lightning (66 caractères hexadécimaux ou vide)
   - Compte X/Twitter (texte libre)
   - Clé publique Nostr (texte libre)
   - Téléphone (format international ou vide)
4. **Cliquez** sur "Enregistrer les modifications"
5. **Vérifiez** le message de confirmation ✅

## 🔧 Debug en Cas de Problème

1. **Ouvrez** la console développeur (F12)
2. **Regardez** les logs lors de la sauvegarde
3. **Vérifiez** les erreurs de validation affichées
4. **Contactez** le support avec les logs si nécessaire

Les erreurs sont maintenant beaucoup plus explicites et permettent un debugging facile. 