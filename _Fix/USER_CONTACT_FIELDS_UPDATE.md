# Ajout des Champs de Contact Utilisateur

## 🎯 Fonctionnalités Ajoutées

L'utilisateur peut maintenant compléter son profil avec des informations de contact détaillées dans la page `/user/settings` :

### **Nouveaux Champs Disponibles**

#### 📱 **Contact**
- **Téléphone** : Format international (`+33123456789`)
- **Compte Telegram** : Username avec validation (`@moncompte`)

#### 📍 **Adresse**
- **Adresse complète** : Ligne d'adresse libre
- **Ville** : Ville de résidence
- **Code postal** : Format français 5 chiffres (`75001`)
- **Pays** : Sélection dans une liste (France par défaut)

## 🗄️ **Structure Base de Données**

### **Nouveaux Champs Ajoutés à `profiles`**

```sql
-- Champs de contact
compte_telegram TEXT             -- @username Telegram
phone TEXT                      -- Déjà existant, maintenant visible

-- Champs d'adresse
address TEXT                    -- Adresse complète sur une ligne
ville TEXT                      -- Ville
code_postal TEXT               -- Code postal (5 chiffres)
pays TEXT DEFAULT 'France'     -- Pays de résidence
```

### **Contraintes de Validation**

```sql
-- Validation format Telegram
CHECK (compte_telegram IS NULL OR compte_telegram ~ '^@[a-zA-Z0-9_]{5,32}$')

-- Validation code postal français
CHECK (code_postal IS NULL OR code_postal ~ '^[0-9]{5}$')
```

### **Index pour Performance**

```sql
CREATE INDEX idx_profiles_ville ON profiles(ville);
CREATE INDEX idx_profiles_pays ON profiles(pays);
CREATE INDEX idx_profiles_telegram ON profiles(compte_telegram);
```

## 🎨 **Interface Utilisateur**

### **Organisation en Sections**

La page des paramètres est maintenant organisée en sections claires :

1. **Informations Personnelles**
   - Nom, Prénom, Email
   - Clé publique Lightning
   - Comptes sociaux (X/Twitter, Nostr, Telegram)
   - Téléphone

2. **📍 Adresse** (Section dédiée)
   - Adresse complète
   - Ville, Code postal, Pays (layout 3 colonnes)

### **Sélecteur de Pays**

Options disponibles dans le sélecteur :
- 🇫🇷 France (par défaut)
- 🇧🇪 Belgique
- 🇨🇭 Suisse  
- 🇨🇦 Canada
- 🇱🇺 Luxembourg
- 🇩🇪 Allemagne
- 🇪🇸 Espagne
- 🇮🇹 Italie
- 🌍 Autre

## ✅ **Validation et Formats**

### **Côté Client (Interface)**

```typescript
// Validation Telegram
if (form.compte_telegram && form.compte_telegram.trim() !== '') {
  const telegramPattern = /^@[a-zA-Z0-9_]{5,32}$/;
  if (!telegramPattern.test(form.compte_telegram.trim())) {
    setMessage('❌ Format Telegram invalide (ex: @moncompte, 5-32 caractères)');
    return;
  }
}

// Validation code postal
if (form.code_postal && form.code_postal.trim() !== '') {
  const postalPattern = /^[0-9]{5}$/;
  if (!postalPattern.test(form.code_postal.trim())) {
    setMessage('❌ Code postal invalide (5 chiffres requis)');
    return;
  }
}
```

### **Côté Serveur (API)**

```typescript
// Schéma Zod étendu
compte_telegram: z.union([
  z.string().trim().regex(/^@[a-zA-Z0-9_]{5,32}$/, 'Format Telegram invalide'),
  z.string().length(0), // Chaîne vide acceptée
  z.null()
]).optional(),

code_postal: z.union([
  z.string().trim().regex(/^[0-9]{5}$/, 'Code postal invalide (5 chiffres requis)'),
  z.string().length(0), // Chaîne vide acceptée
  z.null()
]).optional()
```

## 📊 **Score de Profil Mis à Jour**

Le système de scoring a été enrichi pour inclure les nouveaux champs :

```sql
-- Distribution des points (total 100)
Email vérifié:        15 points
Pubkey Lightning:     20 points  
Compte Twitter/X:     15 points
Compte Nostr:         15 points
Compte Telegram:      10 points (NOUVEAU)
Téléphone vérifié:    15 points
Adresse complète:     10 points (NOUVEAU)
```

### **Logique d'Adresse**

L'adresse rapporte 10 points si :
- **Adresse complète** renseignée, OU
- **Ville + Code postal** renseignés ensemble

## 🔧 **API Endpoints Modifiés**

### **GET/PUT `/api/user/profile`**

**Champs ajoutés dans les réponses :**
```json
{
  "compte_telegram": "@moncompte",
  "phone": "+33123456789",
  "address": "123 rue de la Paix",
  "ville": "Paris", 
  "code_postal": "75001",
  "pays": "France"
}
```

## 📝 **Instructions Utilisateur**

### **Formats Attendus**

1. **Telegram** : `@username` (5-32 caractères, lettres, chiffres, underscore)
   - ✅ `@moncompte`
   - ✅ `@user_123`
   - ❌ `moncompte` (manque @)
   - ❌ `@abc` (trop court)

2. **Téléphone** : Format international recommandé
   - ✅ `+33123456789`
   - ✅ `+1234567890`
   - ❌ `0123456789` (ne commence pas par 1-9)

3. **Code Postal** : 5 chiffres exactement
   - ✅ `75001`
   - ✅ `69000`
   - ❌ `7500` (trop court)
   - ❌ `75001a` (contient une lettre)

### **Champs Optionnels**

Tous les nouveaux champs sont **optionnels** :
- Peuvent être laissés vides
- Chaînes vides automatiquement converties en `null`
- Validation seulement si renseignés

## 🚀 **Déploiement**

### **Migration Base de Données**

```bash
# La migration sera appliquée automatiquement au déploiement
# Fichier: supabase/migrations/add_user_contact_fields.sql
```

### **Build et Déploiement**

```bash
npm run build  # ✅ Build réussi (4.32 kB pour /user/settings)
git push origin main  # ✅ Déployé
```

## 🧪 **Tests Recommandés**

1. **Accéder** à `/user/settings`
2. **Tester formats valides :**
   - Telegram : `@votre_username` 
   - Code postal : `75001`
   - Téléphone : `+33123456789`

3. **Tester formats invalides** (doit afficher erreurs claires)
4. **Tester sauvegarde** avec champs vides (doit fonctionner)
5. **Vérifier** que les données persistent après rechargement

L'interface est maintenant complète et prête pour la collecte d'informations de contact utilisateur ! 🎉 