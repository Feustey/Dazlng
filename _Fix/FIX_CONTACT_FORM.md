# Correction du formulaire de contact DazNode

## Problème identifié

Le formulaire de contact n'envoyait pas les emails car :
1. L'API attendait des champs non présents dans le formulaire (`companyName`, `companyPhone`, etc.)
2. La table `contacts` n'existait pas dans la base de données
3. Manque de logs détaillés pour déboguer les erreurs

## Corrections apportées

### 1. Mise à jour de l'API `/api/contact/route.ts`

- **Suppression des champs non utilisés** : L'API n'attend plus que les champs réellement envoyés par le formulaire
- **Ajout de validation email** : Vérification du format email côté serveur
- **Amélioration des logs** : Ajout de logs détaillés pour chaque étape du processus
- **Vérification de la configuration** : Vérification que `RESEND_API_KEY` est bien configurée
- **Gestion d'erreurs améliorée** : Meilleur retour d'erreur avec détails en mode développement
- **Templates email améliorés** : HTML plus professionnel avec styles inline

### 2. Création de la table `contacts`

Nouvelle migration : `supabase/migrations/20250108_create_contacts_table.sql`

Structure de la table :
```sql
- id (UUID)
- first_name, last_name (VARCHAR)
- email (VARCHAR)
- subject (VARCHAR) 
- message (TEXT)
- status (new, read, replied, archived)
- Métadonnées : ip_address, user_agent, source
- Timestamps : created_at, updated_at
```

Fonctionnalités :
- Index pour les performances
- Trigger pour `updated_at` automatique
- RLS (Row Level Security) activé
- Politique pour insertion anonyme (formulaire public)
- Politique pour accès admin

### 3. Script de test

Création d'un script de test : `scripts/test-contact-form.js`

## Instructions de déploiement

### 1. Appliquer la migration de base de données

```bash
# En local
npx supabase migration up

# En production
npx supabase db push
```

### 2. Vérifier les variables d'environnement

Assurez-vous que ces variables sont définies :
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxx
```

### 3. Tester le formulaire

#### Test avec le script
```bash
# En local
node scripts/test-contact-form.js

# En production
API_URL=https://dazno.de node scripts/test-contact-form.js
```

#### Test manuel
1. Aller sur `/contact`
2. Remplir le formulaire avec des données valides
3. Soumettre le formulaire
4. Vérifier les logs du serveur
5. Vérifier la réception des emails

### 4. Vérifier les données

```sql
-- Vérifier les contacts enregistrés
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;

-- Vérifier les logs d'emails
SELECT * FROM email_logs WHERE type LIKE 'contact_%' ORDER BY created_at DESC LIMIT 10;
```

## Dépannage

### Erreur "Configuration email manquante"
- Vérifier que `RESEND_API_KEY` est bien définie
- Redémarrer le serveur après ajout de la variable

### Erreur "Erreur lors de l'enregistrement"
- Vérifier que la migration a bien été appliquée
- Vérifier les permissions de la base de données
- Consulter les logs détaillés en mode développement

### Emails non reçus
- Vérifier le domaine dans Resend (dazno.de doit être vérifié)
- Vérifier les logs dans le dashboard Resend
- Vérifier la table `email_logs` pour les erreurs

### Erreur de rate limiting
- Le formulaire limite à 5 soumissions par 15 minutes par IP
- Attendre ou tester avec une IP différente

## Améliorations futures possibles

1. **Honeypot anti-spam** : Ajouter un champ invisible pour piéger les bots
2. **CAPTCHA** : Intégrer reCAPTCHA ou hCaptcha
3. **Attachements** : Permettre l'envoi de fichiers
4. **Auto-réponse personnalisée** : Templates différents selon le sujet
5. **Intégration CRM** : Créer automatiquement un lead dans le CRM
6. **Notifications temps réel** : WebSocket ou SSE pour notifier les admins

## Monitoring

Pour surveiller le bon fonctionnement :

```sql
-- Contacts par jour
SELECT 
  DATE(created_at) as date,
  COUNT(*) as contacts,
  COUNT(DISTINCT email) as unique_emails
FROM contacts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Taux de succès des emails
SELECT 
  type,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY type), 2) as percentage
FROM email_logs
WHERE type LIKE 'contact_%'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY type, status
ORDER BY type, count DESC;
```