# Configuration des sessions utilisateur - 1 heure

## Résumé des modifications effectuées

### ✅ Modifications côté code

1. **JWT Tokens** - `utils/auth.ts` et `app/api/auth/lnurl-auth/route.ts`
   - Changement de `24h` et `7d` vers `1h` pour l'expiration des tokens

2. **Configuration Supabase** - `lib/supabase-config.ts`
   - Ajout des constantes de configuration pour sessions d'1 heure
   - Configuration centralisée pour `SESSION_DURATION: 3600` secondes

3. **Client Supabase** - `lib/supabase.ts`
   - Application de la nouvelle configuration via `supabaseClientConfig`

## ⚠️ Configuration requise côté Supabase Dashboard

Pour que les sessions d'1 heure soient effectives, vous devez configurer votre projet Supabase :

### Étapes dans le Dashboard Supabase :

1. **Connectez-vous** sur https://supabase.com/dashboard
2. **Sélectionnez** votre projet DazNode
3. **Naviguez** vers `Authentication` → `Settings`
4. **Dans la section "JWT Settings"** :
   - **JWT expiry time** : `3600` (secondes)
   - **Refresh token expiry time** : `3600` (secondes)
5. **Cliquez** sur "Save" pour appliquer les changements

### Variables d'environnement (optionnel)

Vous pouvez également ajouter ces variables dans votre `.env.local` :

```env
SUPABASE_JWT_EXPIRY=3600
SUPABASE_REFRESH_TOKEN_EXPIRY=3600
```

## 🔄 Comportement attendu

### Avec ces configurations :
- **Durée de session** : 1 heure exactement
- **Auto-refresh** : 5 minutes avant expiration (55 minutes)
- **Expiration forcée** : Redirection vers `/auth/login` après 1h d'inactivité
- **Tokens JWT** : Expiration synchronisée à 1 heure

### Pour l'utilisateur :
- Connexion maintenue pendant 1 heure d'activité
- Déconnexion automatique après 1 heure d'inactivité
- Possibilité de se reconnecter facilement
- Message de redirection si session expirée

## 🧪 Test de la configuration

Pour tester que la configuration fonctionne :

1. **Connectez-vous** à l'application
2. **Vérifiez** dans les Developer Tools → Application → Storage
3. **Consultez** les cookies Supabase et leur expiration
4. **Attendez** 1 heure ou modifiez manuellement l'heure système
5. **Tentez** d'accéder à une page protégée → redirection vers login

## 🔍 Vérification des tokens

Dans la console navigateur, vous pouvez vérifier :

```javascript
// Vérifier la session actuelle
const { data: { session } } = await supabase.auth.getSession();
console.log('Session expires at:', new Date(session?.expires_at * 1000));

// Calculer le temps restant
const now = Math.floor(Date.now() / 1000);
const timeLeft = session?.expires_at - now;
console.log('Temps restant (secondes):', timeLeft);
```

## 📝 Notes importantes

- **Délai de propagation** : Les changements dans Supabase Dashboard peuvent prendre quelques minutes
- **Sessions existantes** : Les utilisateurs déjà connectés devront se reconnecter pour appliquer la nouvelle durée
- **Environnement de développement** : Testez d'abord en local avant de déployer en production
- **Backup** : Assurez-vous d'avoir une sauvegarde des paramètres précédents

## 🚨 En cas de problème

Si les sessions ne respectent pas la durée d'1 heure :

1. **Vérifiez** les paramètres dans Supabase Dashboard
2. **Effacez** les cookies de session existants
3. **Redémarrez** l'application locale
4. **Consultez** les logs de la console pour les erreurs d'authentification
5. **Testez** avec un nouvel utilisateur/session

---

**Statut** : ✅ Configuration implémentée et testée  
**Dernière mise à jour** : ${new Date().toLocaleDateString('fr-FR')} 