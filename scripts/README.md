# Scripts Utilitaires DazNode

## 🔒 Utilisation de Supabase

### Bonnes Pratiques

1. **Création du Client Supabase**
   ```typescript
   import { getSupabaseAdminClient } from '@/lib/supabase';
   const supabase = getSupabaseAdminClient();
   ```

2. **Utilitaires de Test**
   ```typescript
   import { createTestClient, TestResult } from '@/lib/test-utils/supabase-test-client';
   const supabase = createTestClient();
   ```

3. **Gestion des Erreurs**
   ```typescript
   try {
     const { data, error } = await supabase.from('table').select('*');
     if (error) throw error;
   } catch (error) {
     console.error('❌ Erreur:', error);
   }
   ```

### Scripts Disponibles

1. **Test Supabase Integration**
   ```bash
   npx tsx scripts/test-supabase-integration.ts
   ```
   Teste l'intégration complète avec Supabase (OTP, checkout, contact).

2. **Monitoring des Tokens**
   ```bash
   npx tsx scripts/monitor-tokens.ts
   ```
   Surveille et met à jour les tokens T4G des utilisateurs.

3. **Création Admin Dev**
   ```bash
   npx tsx scripts/create-dev-admin.ts
   ```
   Crée un utilisateur admin pour le développement.

4. **Vérification Post-Migration**
   ```bash
   npx tsx scripts/verify-post-migration.ts
   ```
   Vérifie la structure et les données après une migration.

5. **Vérification Simple**
   ```bash
   npx tsx scripts/simple-migration-check.ts
   ```
   Version simplifiée de la vérification post-migration.

### Variables d'Environnement Requises

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (optionnel, défaut: http://localhost:3000)

### Sécurité

⚠️ **Important** :
- Ne jamais commiter de clés d'API ou de secrets
- Toujours utiliser les variables d'environnement
- Utiliser `getSupabaseAdminClient()` uniquement pour les opérations admin
- Vérifier les permissions et les politiques RLS

### Maintenance

Les scripts sont maintenus dans le cadre du projet DazNode. Pour toute modification :
1. Utiliser les utilitaires de test standardisés
2. Suivre les bonnes pratiques de gestion des clients Supabase
3. Documenter les changements dans ce README 